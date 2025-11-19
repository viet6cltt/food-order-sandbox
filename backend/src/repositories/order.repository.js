const Order = require('../models/Order');

class OrderRepository {

  async create(payload) {
    return Order.create(payload);
  }

  async findByUserId(userId) {
    return Order.find({ userId: userId });
  }

  async findByOrderId(orderId) {
    return Order.findById(orderId);
  }

  async cancelOrder(orderId) {
    return Order.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true });
  }

  async getOrdersOfRestaurant(filter, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
      const total = await Order.countDocuments(filter);

      return {
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
  }

  async updateOrderStatus(orderId, status) {
    return await Order.findByIdAndUpdate(orderId, {
      status: status
    },
    { new: true}
    );
  }
}

module.exports = new OrderRepository();