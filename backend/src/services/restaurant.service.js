const RestaurantRepository = require('../repositories/restaurant.repository');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

function isWithinBusinessHours(current, open, close) {
  // current, open, close đều dạng "HH:MM"

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const cur = toMinutes(current);
  const op = toMinutes(open);
  const cl = toMinutes(close);

  // Trường hợp quán mở qua đêm (ví dụ 20:00 → 02:00)
  if (cl < op) {
    return cur >= op || cur < cl;
  }

  return cur >= op && cur < cl;
}

class RestaurantService {
  
  // get restaurant info 
  async getRestaurantInfo(restaurantId) {
    if (!restaurantId) {
      throw new ERR_RESPONSE.BadRequestError("Missing restaurant ID", ERR.INVALID_INPUT);
    }

    const restaurant = await RestaurantRepository.getById(restaurantId);
    
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError("Restaurant not found", ERR.RESTAURANT_NOT_FOUND);
    }

    return restaurant;
  }

  // check owner 
  async checkOwner(restaurantId, userId) {
    console.log(restaurantId);
    const restaurant = await this.getRestaurantInfo(restaurantId);

    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError("Restaurant is not found", ERR.RESTAURANT_NOT_FOUND)
    }
    if (restaurant.ownerId.toString() !== userId.toString()) {
      throw new ERR_RESPONSE.ForbiddenError("You are not the owner of this restaurant", ERR.RESTAURANT_NOT_OWNER);
    }

    return restaurant;
  }

  async checkOpenTime(restaurant) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    return isWithinBusinessHours(currentTime, restaurant.opening_time, restaurant.closing_time);
  }
}

// Standalone functions for backward compatibility
async function getList({ page = 1, limit = 16 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1)
  const l = Math.max(1, parseInt(limit, 10) || 16)
  const offset = (p - 1) * l

  const { items, total } = await RestaurantRepository.getAll({ limit: l, offset })

  return {
    items,
    meta: {
      page: p,
      limit: l,
      total: typeof total === 'number' ? total : items.length,
    },
  }
}

async function getRestaurantInfo(restaurantId) {
  const service = new RestaurantService();
  return await service.getRestaurantInfo(restaurantId);
}

const restaurantService = new RestaurantService();

module.exports = Object.assign(restaurantService, {
  getList, 
  getRestaurantInfo,
  RestaurantService
})