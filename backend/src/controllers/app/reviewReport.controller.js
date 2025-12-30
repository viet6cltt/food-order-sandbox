
const reportService = require('@/services/app/reviewReport.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');


class ReviewReportController {
  async create(res, req, next) {
    try {
      const { reviewId } = req.params;
      const { reason } = req.body;
      const userId = req.userId;

      if (!reviewId) throw new ERR_RESPONSE.BadRequestError("Missing reviewId");

      const report = await reportService.create(reviewId, userId, reason);

      return SUCCESS.created(res, "Report review successfully", report);
    } catch (err) { next(err); }
  }
}

module.exports = new ReviewReportController();