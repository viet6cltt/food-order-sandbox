const repoRestaurantRequest = require('../../repositories/restaurantRequest.repository');
const serviceRestaurant = require('../restaurant.service');
const ERR_RESPONSE = require('../../utils/httpErrors');

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

    const approveReq = await repoRestaurantRequest.approve(requestId);

    const restaurant = await serviceRestaurant.createRestaurant({
      name: request.restaurantName,
      ownerId: request.userId,
      description: request.description,
      address: request.address,
      phone: request.phone,
      categoriesId: request.categoriesId,
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