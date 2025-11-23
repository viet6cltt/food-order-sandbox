const RestaurantService = require('../services/restaurant.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');

class RestaurantController {
  // [GET] /:restaurantId
  async getInfo(req, res, next) {
    try {
      const { restaurantId } = req.params;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing restaurant ID", ERR.INVALID_INPUT);
      }

      const restaurantInfo = await RestaurantService.getRestaurantInfo(restaurantId);

      return res.json(restaurantInfo);
    } catch (err) {
      next(err);
    }
  }

  // [GET] /
  async list(req, res, next) {
    try {
      const page = req.query.page || 1
      const limit = req.query.limit || 16
      const { items, meta } = await RestaurantService.getList({ page, limit })
      res.json({ success: true, data: items, meta })
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RestaurantController();