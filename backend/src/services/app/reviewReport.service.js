const reviewService = require('./review.service');
const restaurantService = require('../restaurant.service');
const ERR = require("@/utils/httpErrors");
const reviewReportRepo = require('@/repositories/reviewReport.repository');
class ReviewReportService {
  async create(reviewId, userId, reason) {
    // lấy review
    const review = await reviewService.getDetail(reviewId);
    if (!review) throw new ERR.NotFoundError("Review Not Found");

    // không cho user tự report chính comment của họ
    if (review.userId.toString() === userId.toString()) {
      throw new ERR.UnprocessableEntityError("You cannot report your own review");
    }

    // kiêm tra xem user có phải là chủ nhà hàng của review 
    const isOwner = await restaurantService.checkOwner(review.restaurantId, userId);
    if (!isOwner) {
      throw new ERR.ForbiddenError("Only restaurant owner can report this review");
    }
    
    // prevent dup
    const exists = await reviewReportRepo.findOne({
      reviewId,
      reportedBy: userId,
      status: "PENDING",
    });

    if (exists) {
      throw new ERR.UnprocessableEntityError("You already reported this review");
    }

    // create
    const report = await reviewReportRepo.create({
      reviewId: review.id,
      reportedBy: userId,
      reason: reason
    });

    return report;
  }
}

module.exports = new ReviewReportService();