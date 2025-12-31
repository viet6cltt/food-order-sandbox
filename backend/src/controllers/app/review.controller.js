const reviewService = require('@/services/app/review.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');

class ReviewController {
  async create(req, res, next) {
    try { 
      const { orderId, restaurantId, rating, comment} = req.body;
      
      if (!orderId || !restaurantId || !rating) {
        throw new ERR_RESPONSE.BadRequestError("Missing required fields");
      }
      const review = await reviewService.create({
        userId: req.userId,
        orderId,
        restaurantId,
        rating,
        comment
      });

      return SUCCESS.created(res, "Review created", review);

    } catch (err) {
      next (err);
    }
  }

  async listByRestaurant(req, res, next) {
    try {
      const restaurantId = req.params.restaurantId;
      const pagination = req.pagination;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing restaurantId");
      }

      const result = await reviewService.listByRestaurant(restaurantId, pagination);
      return SUCCESS.success(res, "Reviews fetched", result);
    } catch (err) { next(err); }
  }

  async getDetail(req, res, next) {
    try {
      const { reviewId } = req.params.reviewId;
      if (!reviewId) {
        throw new ERR_RESPONSE.BadRequestError("Missing reviewId");
      }

      const result = await reviewService.getDetail(reviewId);
      return SUCCESS.success(res, "Review detail", result);
    } catch (err) {
      next(err);
    }
  }
} 

module.exports = new ReviewController();