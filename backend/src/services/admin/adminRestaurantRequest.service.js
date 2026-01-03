const repoRestaurantRequest = require('@/repositories/restaurantRequest.repository');
const serviceRestaurant = require('../app/restaurant.service');
const ERR_RESPONSE = require('@/utils/httpErrors');
const userService = require('../app/user.service');
const { UserRole } = require('@/constants/user.constants');
const redisService = require('../redis.service');

class AdminRestaurantRequestService {

  async getPendingRequests() {
    return await repoRestaurantRequest.getPendingRequests();
  }

  async getById(requestId) {
    return await repoRestaurantRequest.getById(requestId);
  }

  async approveRequest(requestId) {
    const request = await repoRestaurantRequest.getById(requestId);
    if (!request) {
      throw new ERR_RESPONSE.NotFoundError("Request not found");
    }

    // If already approved, allow idempotent approve (useful if a previous attempt failed mid-way).
    if (request.status !== 'pending') {
      if (request.status === 'approved') {
        const ownerId = request.userId?._id ?? request.userId;
        const existing = await serviceRestaurant.getRestaurantByOwnerId(ownerId);
        if (existing) return { approveReq: request, restaurant: existing };
        // fall through to create restaurant (recovery)
      } else {
        throw new ERR_RESPONSE.UnprocessableEntityError("This request was handled");
      }
    }

    const coords = request?.address?.geo?.coordinates;
    const hasValidCoords =
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number' &&
      !Number.isNaN(coords[0]) &&
      !Number.isNaN(coords[1]);

    if (!hasValidCoords) {
      throw new ERR_RESPONSE.BadRequestError(
        'Restaurant request is missing address.geo.coordinates (lng/lat). Please ask the owner to resubmit with a valid address.'
      );
    }

    if (request.userId.role === UserRole.CUSTOMER) {
      // Cập nhật DB
      await userService.updateUser(request.userId._id, { role: UserRole.RESTAURANT_OWNER})

      // XỬ LÍ BLACKLIST ĐỂ ĐỔI ROLE CÓ HIỆU LỰC NGAY
      await redisService.setForceRefresh(request.userId._id);
    }

    const approveReq = request.status === 'pending'
      ? await repoRestaurantRequest.approve(requestId)
      : request;

    const restaurant = await serviceRestaurant.createRestaurant({
      name: request.restaurantName,
      ownerId: request.userId,
      description: request.description,
      address: request.address,
      phone: request.phone,
      categoriesId: request.categoriesId,
      bannerUrl: request.bannerUrl,
    });

    return { approveReq, restaurant };
  }

  async rejectRequest(requestId, reason) {
    const request = await repoRestaurantRequest.getById(requestId);

    if (!request) {
      throw new ERR_RESPONSE.BadRequestError("Request not found");
    }

    if (request.status !== "pending") {
      throw new ERR_RESPONSE.UnprocessableEntityError("This request was handled");
    }

    return await repoRestaurantRequest.reject(requestId, reason);
  }
}

module.exports = new AdminRestaurantRequestService();