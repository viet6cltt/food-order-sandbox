const Report = require('@/models/Report');

class ReportRepository { 

  /**
   * Tạo báo cáo mới (User/Owner)
   */
  async create(reportData) {
    return await Report.create(reportData);
  }

  /**
   * Tìm báo cáo theo ID và populate thông tin người báo cáo
   */
  async findById(reportId) {
    return await Report.findById(reportId)
      .populate('reportedBy', 'username phone firstname lastname')
      .populate('resolvedBy', 'username');
  }

  /**
   * Lấy danh sách báo cáo cho Admin (có lọc, phân trang)
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
        .populate('reportedBy', 'username'),
        Report.countDocuments(query)
    ]);

    return {
      reports,
      total
    };
  }

  /**
     * Kiểm tra xem một user đã báo cáo đối tượng này chưa (tránh spam)
     */
  async findExisting(reportedBy, targetId, targetType) {
      return await Report.findOne({ reportedBy, targetId, targetType });
  }

/**
   * Cập nhật trạng thái xử lý báo cáo (Admin)
   */
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
      );
  }

  /**
   * Tìm all báo cáo liên quan đến 1 đối tượng cụ thể
   */
  async findByTarget(targetId) {
    return await Report.find({ targetId }).sort({ createdAt: -1 });
  }
}

module.exports = new ReportRepository();