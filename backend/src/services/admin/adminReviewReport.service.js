const reviewReportRepo = require("@/repositories/reviewReport.repository");
const adminReviewService = require('./adminReview.service');

const ERR = require("@/utils/httpErrors");

class AdminReviewReportService {

  async getAllReports({ status, skip, limit}) {
    return await reviewReportRepo.findAll({ status, skip, limit });
  }

  async resolveReport(reportId, action, adminNote = null) {
    const report = await reviewReportRepo.findById(reportId);
    if (!report) throw new ERR.NotFoundError("Report not found");
    
    if (report.status !== "PENDING") {
      throw new ERR.UnprocessableEntityError("Report is already resolved");
    }

    const reviewId = report.reviewId.toString();
    if (action === "HIDE_REVIEW") {
      await adminReviewService.hideReview(reviewId);
    } else if (action === "DELETE_REVIEW") {
      await adminReviewService.deleteReview(reviewId);
    } else {
      throw new ERR.BadRequestError("Invalid action");
    }

    const updated = await reviewReportRepo.update(reportId, { status: "RESOLVED", adminNote });

    return updated;
  }

  async rejectReport(reportId, adminNote = null) {
    const report = await reviewReportRepo.findById(reportId);
    if (!report) throw new ERR.NotFoundError("Report not found");

    if (report.status !== "PENDING") {
      throw new ERR.UnprocessableEntityError("Report is already handled");
    }

    const updated = await reviewReportRepo.update(reportId, {
      status: "REJECTED",
      adminNote
    });

    return updated;
  }
}

module.exports = new AdminReviewReportService();