const RestaurantService = require('../services/restaurant.service')

class RestaurantController {
  // [GET] /
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 16

      const result = await RestaurantService.getList({ page, limit })
      return res.status(200).json({ success: true, data: result.items, meta: result.meta })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new RestaurantController()
