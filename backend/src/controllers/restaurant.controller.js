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

  async getAll(req, res, next) {
    try {
      // 1. Lấy các tham số từ query string
      const { 
        categoryId, 
        sortBy 
      } = req.query;

      const pagination = req.pagination;

      // 2. Ép kiểu và chuẩn bị dữ liệu gửi xuống Service
      // Mặc định sortBy là 'rating' như bạn yêu cầu
      const options = {
        categoryId: categoryId || null,
        pagination,
        sortBy: sortBy || 'rating' 
      };

      // 3. Gọi Service xử lý logic nghiệp vụ
      const result = await RestaurantService.getRestaurants(options);

      // 4. Trả về kết quả cho Client
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách nhà hàng thành công',
        data: result
      });
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

      console.log(keyword, lat, lng);

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

  async getRecommend(req, res, next) {
    try {
      const data = await RestaurantService.getRecommend();
      return SUCCESS_RESPONSE.success(res, 'Get recommend successfully', data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RestaurantController();