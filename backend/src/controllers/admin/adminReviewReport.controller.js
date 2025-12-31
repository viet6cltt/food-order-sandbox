const service = require('@/services/admin/adminReviewReport.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');

class AdminReviewReportController {
  /**
   * GET /admin/review-reports
   * Query: status=PENDING|RESOLVED|REJECTED
   */
  async getAllReports(req, res, next) {
    try {
      const { status } = req.query;
      const { skip, limit } = req.pagination;

      const result = await service.getAllReports({ status, skip, limit });

      return SUCCESS.success(res, "Get reports successfully", result);
    } catch (err) {
      next(err);
    }
  } 

  /**
   * PATCH /admin/review-reports/:reportId
   * Body: { action: "HIDE_REVIEW" | "DELETE_REVIEW" | "REJECT", adminNote?: string }
   */
  async handleReport(req, res, next) {
    try {
      const { reportId } = req.params;
      const { action, adminNote } = req.body;

      if (!reportId) throw new ERR.BadRequestError("Missing reportId");
      if (!action) throw new ERR.BadRequestError("Missing action");

      let result;
      if (action === "REJECT") {
        result = await service.rejectReport(reportId, adminNote);
      } else {
        // HIDE_REVIEW or DELETE_REVIEW
        result = await service.resolveReport(reportId, action, adminNote);
      }

      return SUCCESS.success(res, "Handle report successfully", result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminReviewReportController();
