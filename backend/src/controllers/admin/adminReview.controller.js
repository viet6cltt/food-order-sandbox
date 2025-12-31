const service = require('@/services/admin/adminReview.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');

class AdminReviewController {

  async hideReview(req, res, next) {
    try {
      const { reviewId } = req.params;

      if (!reviewId) throw new ERR_RESPONSE.BadRequestError("Missing reviewId");

      const review = await service.hideReview(reviewId);
      return SUCCESS.success(res, "Hide review successfully", review);

    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;

      if (!reviewId) throw new ERR_RESPONSE.BadRequestError("Missing reviewId");

      await service.deleteReview(reviewId);
      return SUCCESS.accepted(res, "Hide review successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminReviewController();
