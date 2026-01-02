const reportRepo = require("@/repositories/report.repository");
const adminReviewService = require('./adminReview.service');

const ERR = require("@/utils/httpErrors");
const { ReportStatus, ResolutionAction } = require("@/constants/report.constants");
const adminRestaurantService = require("./adminRestaurant.service");
const adminUserService = require("./adminUser.service");

class AdminReportService {

  async getAllReports(pagination, { targetType, status }) {
    const { skip, limit, page } = pagination;
    
    const { reports, total } = await reportRepo.findAll({
      status,
      targetType,
      limit,
      skip
    });

    return {
      items: reports,
      meta: {
        total,
        page,
        limit, 
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getReportDetail(reportId) {
    const report = await reportRepo.findById(reportId);
    if (!report) throw new ERR.NotFoundError('Report not found');
    return report;
  }
  
  /**
   * Xử lý báo cáo (RESOLVE or REJECT)
   */
  async resolve(reportId, updateData) {
    const { status, adminNote, resolvedAction, resolvedBy } = updateData;

    const report = await reportRepo.findById(reportId);
    if (!report) throw new ERR.NotFoundError('Report not found');

    if (report.status !== ReportStatus.PENDING) {
      throw new ERR.ConflictError('Report is already processed and cannot be modified');
    }

    // Nếu admin xác nhận vi phạm (RESOLVED), thực thi hành động
    if (status === ReportStatus.RESOLVED && resolvedAction !== "NONE") {
      await this._executePenalty(report.targetId, resolvedAction);
    }

    // update
    // nếu reject thì k làm gì, chỉ cập nhật status là REJECTED
    return await reportRepo.resolve(reportId, {
      status,
      adminNote,
      resolvedAction,
      resolvedBy
    });
  }

  // Private method: thực thi hành động

  async _executePenalty(targetId, action) {
    switch (action) {
      case ResolutionAction.HIDE_REVIEW:
        // ẩn review
        await adminReviewService.hideReview(targetId);
        break;
        
      case ResolutionAction.BLOCK_RESTAURANT:
        // khóa quán
        await adminRestaurantService.blockRestaurant(targetId);
        break;

      case ResolutionAction.BLOCK_USER:
        // khóa tài khoản user
        await adminUserService.blockUser(targetId);
        break;
      case ResolutionAction.REJECT_REPORT:
      case "NONE":
        break;
      
      default:
        console.warn(`${action} is not supported`);
    }
  }
}

module.exports = new AdminReportService();