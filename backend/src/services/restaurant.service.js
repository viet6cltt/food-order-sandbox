const RestaurantRepo = require('../repositories/restaurant.repository')

exports.getList = async (opts = {}) => {
  // opts can include pagination: { limit, offset }
  const { limit = 16, page = 1 } = opts
  const offset = (page - 1) * limit
  const items = await RestaurantRepo.getAll({ limit, offset })
  return {
    items,
    meta: {
      page,
      limit,
      total: 64, // currently mocked total
    },
  }
}
