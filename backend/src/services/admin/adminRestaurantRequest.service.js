const repoRestaurantRequest = require('../../repositories/restaurantRequest.repository');
const serviceRestaurant = require('../restaurant.service');
const ERR_RESPONSE = require('../../utils/httpErrors');
const userRepo = require('../../repositories/user.repository');

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

    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new ERR_RESPONSE.NotFoundError('User not found');
    }

    const restaurant = await serviceRestaurant.createRestaurant({
      name: request.restaurantName,
      ownerId: request.userId,
      description: request.description,
      bannerUrl: request.bannerUrl,
      address: request.address,
      phone: request.phone,
      categoriesId: request.categoriesId,
    });

    if (user.role === 'customer') {
      await userRepo.updateUser(request.userId, { role: 'restaurant_owner' });
    }

    const approveReq = await repoRestaurantRequest.approve(requestId);

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