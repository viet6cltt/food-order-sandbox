const reviewService = require('./review.service');
const restaurantService = require('./restaurant.service');
const ERR = require("@/utils/httpErrors");
const reportRepo = require('@/repositories/report.repository');
const { ReportStatus, TargetType } = require('@/constants/report.constants');
const userService = require('./user.service');

class ReportService {
  async createReport({ reportedBy, targetId, targetType, reason, description }) {
    // 1. kiểm tra đối tượng báo cáo có tồn tại không
    await this._validateTarget(reportedBy, targetId, targetType);

    // 2. kiểm tra trùng lặp
    const existing = await reportRepo.findExisting(reportedBy, targetId, targetType);
    if (existing) throw new ERR.BadRequestError("You have reported this target already");

    // 3. tạo báo cáo
    return await reportRepo.create({
      reportedBy,
      targetId,
      targetType,
      reason,
      description
    });
  }

  // private method to validation
  async _validateTarget(userId, targetId, targetType) {
    switch (targetType) {
      case TargetType.REVIEW:
        const review = await reviewService.getDetail(targetId);
        if (!review) throw new ERR.NotFoundError("Review not found");

        // Check owner: only owner can report the review of restaurant
        const checkOwner = restaurantService.checkOwner(review.restaurantId, userId);
        if (!checkOwner) throw new ERR.ForbiddenError("Only restaurant owner has permission to report this review");

        break;

      case TargetType.RESTAURANT:
        const res = await restaurantService.getRestaurantInfo(targetId);
        if (!res) throw new ERR.NotFoundError('Restaurant not found');
        break;

      case TargetType.USER:
        if (targetId.toString() === userId.toString()) {
          throw new ERR.ForbiddenError("Bạn không thể tự báo cáo chính mình");
        }
        const targetUser = await userService.findById(targetId);
        if (!targetUser) throw new ERR.NotFoundError("User not found");
        break;

      default: 
        throw new ERR.BadRequestError('Target Type is invalid');
    }
  }
}

module.exports = new ReportService();