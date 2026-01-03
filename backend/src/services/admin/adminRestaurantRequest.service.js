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

    if (request.status !== 'pending') {
      throw new ERR_RESPONSE.UnprocessableEntityError("This request was handled");
    }

    if (request.userId.role === UserRole.CUSTOMER) {
      // Cập nhật DB
      await userService.updateUser(request.userId._id, { role: UserRole.RESTAURANT_OWNER})

      // XỬ LÍ BLACKLIST ĐỂ ĐỔI ROLE CÓ HIỆU LỰC NGAY
      await redisService.setForceRefresh(request.userId._id);
    }

    const approveReq = await repoRestaurantRequest.approve(requestId);

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