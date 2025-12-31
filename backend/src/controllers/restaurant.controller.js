const RestaurantService = require('../services/restaurant.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');
const { Types } = require('mongoose');

class RestaurantController {
  // [GET] /recommend
  async recommend(req, res, next) {
    try {
      const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 5));
      const items = await RestaurantService.getRecommend({ limit });
      return res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /:restaurantId
  async getInfo(req, res, next) {
    try {
      const { restaurantId } = req.params;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing restaurant ID", ERR.INVALID_INPUT);
      }

      if (!Types.ObjectId.isValid(restaurantId)) {
        throw new ERR_RESPONSE.BadRequestError("Invalid restaurant ID", ERR.INVALID_INPUT);
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

  async search(req, res, next) {
    try {
      const { keyword, lat, lng } = req.query;
      const { skip, limit } = req.pagination;

      const data = await RestaurantService.searchRestaurants({ keyword, lat, lng, skip, limit });

      return SUCCESS_RESPONSE.success(res, `search restaurants by keyword ${keyword}`, data);
    } catch (err) {
      next(err);
    }
  }

  async uploadBanner(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const file = req.file;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing id if Restaurant", ERR.INVALID_INPUT);
      }

      if (!file) {
        throw new ERR_RESPONSE.BadRequestError("File is required");
      }

      const updated = await RestaurantService.uploadBanner(id, file);

      return SUCCESS_RESPONSE.success(res, `Banner updated successfully`, updated);
    } catch (err) {
      next(err);
    }
  }

  // [GET] /owner/restaurant
  async getMyRestaurant(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError("User not authenticated", ERR.UNAUTHORIZED);
      }

      const restaurant = await RestaurantService.getRestaurantByOwnerId(userId);
      
      if (!restaurant) {
        throw new ERR_RESPONSE.NotFoundError("Restaurant not found for this owner", ERR.RESTAURANT_NOT_FOUND);
      }

      return SUCCESS_RESPONSE.success(res, "Get restaurant successfully", restaurant);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RestaurantController();