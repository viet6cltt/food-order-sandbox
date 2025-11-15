const RestaurantRepository = require('../repositories/restaurant.repository');

class RestaurantService {
  
  // get restaurant info 
  async getRestaurantInfo(restanrantId) {
    return await RestaurantRepository.getById(restanrantId);
  }
}

module.exports = new RestaurantService();