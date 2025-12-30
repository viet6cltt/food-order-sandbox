const ReviewReport = require('../models/ReviewReport');

class ReviewReportRepo { 

  async create(data) {
    return await ReviewReport.create(data);
  }

  async findAll({ status, skip, limit }) {
    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      ReviewReport.find(filter)
        .populate("reviewId")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      ReviewReport.countDocuments(filter),
    ]);

    return { items, total };
  }

  async update(id, data) {
    return await ReviewReport.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new ReviewReport();