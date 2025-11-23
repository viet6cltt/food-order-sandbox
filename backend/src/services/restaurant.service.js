const RestaurantRepository = require('../repositories/restaurant.repository');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

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
  if (!restaurantId) {
    throw new ERR_RESPONSE.BadRequestError("Missing restaurant ID", ERR.INVALID_INPUT);
  }

  const restaurant = await RestaurantRepository.getById(restaurantId);
  
  if (!restaurant) {
    throw new ERR_RESPONSE.NotFoundError("Restaurant not found", ERR.RESTAURANT_NOT_FOUND);
  }

  return restaurant;
}

module.exports = { getList, getRestaurantInfo }