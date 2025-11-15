const RestaurantService = require('../services/restaurant.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');

class RestaurantController {
  // [GET] /:restaurantId
  async getInfo(req, res, next) {
    try {
      console.log(req.userId);
      const { restaurantId } = req.params;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing id if Restaurant", ERR.INVALID_INPUT);
      }

      const restaurantInfo = await RestaurantService.getRestaurantInfo(restaurantId);

      return res.json(restaurantInfo);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new RestaurantController();