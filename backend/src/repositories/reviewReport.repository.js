const Review = require('@/models/Review');
const ReviewReport = require('../models/ReviewReport');

class ReviewReportRepo { 

  async create(data) {
    return await ReviewReport.create(data);
  }

  async findOne(filter) {
    return await ReviewReport.findOne(filter);
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

  async findById(id) {
    return ReviewReport.findById(id)
      .populate("reviewId")
      .populate("reportedBy", "firstname lastname");
  }

  async update(id, data) {
    return await ReviewReport.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new ReviewReportRepo();