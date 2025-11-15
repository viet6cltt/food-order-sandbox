const Restaurant = require('../models/Restaurant');

class RestaurantRepository { 
  async getById(restaurantId) {
    return await Restaurant.findById(restaurantId);
  }
}
module.exports = new RestaurantRepository();