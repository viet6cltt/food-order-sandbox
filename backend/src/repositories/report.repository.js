const Report = require('@/models/Report');

class ReportRepository { 
  /**
   * Tạo báo cáo mới
   */
  async create(reportData) {
    return await Report.create(reportData);
  }

  /**
   * Tìm chi tiết báo cáo
   * Tối ưu: Populate chi tiết đối tượng bị báo cáo dựa trên targetType
   */
  async findById(reportId) {
    const report = await Report.findById(reportId)
      .populate('reportedBy', 'username phone firstname lastname avatarUrl')
      .populate('resolvedBy', 'username');

    if (!report) return null;

    // Populate động dựa trên targetType để lấy nội dung thực tế
    const modelMap = {
      'REVIEW': { path: 'targetId', model: 'Review', populate: { path: 'userId', select: 'username' } },
      'RESTAURANT': { path: 'targetId', model: 'Restaurant', select: 'name address logo' },
      'USER': { path: 'targetId', model: 'User', select: 'username email' }
    };

    const options = modelMap[report.targetType];
    if (options) {
      await report.populate(options);
    }

    return report;
  }

  /**
   * Lấy danh sách báo cáo cho Admin
   * Hiển thị ở bảng: Cần biết người báo cáo và lý do
   */
  async findAll({ status, targetType, limit = 10, skip = 0 }) {
    const query = {};
    if (status) query.status = status;
    if (targetType) query.targetType = targetType;

    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reportedBy', 'username firstname lastname avatarUrl')
        // Populate sơ bộ target để hiện tên/nội dung ngắn ở bảng danh sách
        .lean(), 
      Report.countDocuments(query)
    ]);

    // Populate nội dung sơ bộ cho danh sách (để hiện "Tên quán" hoặc "Nội dung review" ngắn)
    for (let report of reports) {
      if (report.targetType === 'RESTAURANT') {
        await Report.populate(report, { path: 'targetId', model: 'Restaurant', select: 'name' });
      } else if (report.targetType === 'REVIEW') {
        await Report.populate(report, { path: 'targetId', model: 'Review', select: 'comment rating' });
      }
    }

    return {
      reports,
      total
    };
  }

  async findExisting(reportedBy, targetId, targetType) {
    return await Report.findOne({ reportedBy, targetId, targetType });
  }

  async resolve(reportId, { status, adminNote, resolvedAction, resolvedBy }) {
    return await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        adminNote,
        resolvedAction,
        resolvedBy,
        resolvedAt: new Date()
      },
      { new: true }
    ).populate('resolvedBy', 'username');
  }

  async findByTarget(targetId) {
    return await Report.find({ targetId })
      .sort({ createdAt: -1 })
      .populate('reportedBy', 'username');
  }
}

module.exports = new ReportRepository();