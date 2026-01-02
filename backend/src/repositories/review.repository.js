const Review = require('../models/Review');

class ReviewRepo {
  async create(data) {
    return await Review.create(data);
  }

  async findByUserIdOrOrderId({ userId, orderId }) {
    return await Review.findOne({ userId, orderId });
  }

  async findPublishedByRestaurant(restaurantId, { skip, limit }) {
    const [items, total] = await Promise.all([
      Review.find({ restaurantId, status: "PUBLISHED" })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstname lastname avatarUrl"),
      Review.countDocuments({ restaurantId, status: "PUBLISHED" }),
    ]);

    return { items, total };
  }

  async findPublishedByMenuItem(menuItemId, { skip, limit }) {
    const [items, total] = await Promise.all([
      Review.find({ items: menuItemId, status: "PUBLISHED" })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstname lastname avatarUrl"),
      Review.countDocuments({ items: menuItemId, status: "PUBLISHED" }),
    ]);

    return { items, total };
  }

  async findById(id) {
    return await Review.findById(id);
  }

  async findDetail(id) {
    return await Review.findById(id).populate("userId", "firstname lastname avatarUrl");
  }

  async updateStatus(id, status) {
    return await Review.findByIdAndUpdate(id, { status }, { new: true });
  }

  async deleteById(id) {
    return await Review.findByIdAndDelete(id);
  }
}

module.exports = new ReviewRepo();