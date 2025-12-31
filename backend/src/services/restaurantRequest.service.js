const repoRestaurantRequest = require('../repositories/restaurantRequest.repository');
const serviceRestaurant = require('./restaurant.service');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

class RestaurantRequestService {
  
  async submitRequest(userId, data) {
    const exists = await repoRestaurantRequest.getPendingRequestsByUserId(userId);
    if (exists) {
      throw new ERR_RESPONSE.UnprocessableEntityError("This user already has a pending request");
    }

    return await repoRestaurantRequest.createRequest({ ...data, userId });
  }

  async getMyRequest(userId) {
    return await repoRestaurantRequest.getPendingByUserId(userId);
  }
}

module.exports = new RestaurantRequestService();