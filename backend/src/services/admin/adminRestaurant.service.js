const { RestaurantStatus } = require('@/constants/restaurant.constants');
const restaurantRepository = require('@/repositories/restaurant.repository');

class AdminRestaurantService {

  async blockRestaurant(restaurantId) {
    return await restaurantRepository.updateStatus(restaurantId, RestaurantStatus.BLOCKED);
  }
}

module.exports = new AdminRestaurantService();