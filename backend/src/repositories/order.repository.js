const { orderStatusObject, orderStatus } = require('@/constants/orderStatus');
const Order = require('../models/Order');

class OrderRepository {

  async create(payload) {
    return Order.create(payload);
  }

  async findByUserId(userId) {
    return Order.find({ userId: userId }).sort({ updatedAt: -1 });
  }

  async findById(orderId) {
    return Order.findById(orderId);
  }

  async cancelOrder(orderId) {
    return Order.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true });
  }

  async getOrdersOfRestaurant(filter, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ updatedAt: -1 })
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

  /**
   * Lấy dữ liệu 7 ngày nhất cho Dashboard Admin
   */
  async getDashboardStats(sinceDate) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sinceDate },
          status: { $in: [orderStatusObject.completed, orderStatusObject.cancelled] }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          completed: {
            $sum: { $cond: [{ $eq: ["$_id.status", "completed"] }, "$count", 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$_id.status", "cancelled"] }, "$count", 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
  }

  /**
   * Thống kê chi tiết cho màn hình Order
   */
  async getStatusDistributionSummary(filters) {
    const { startDate, endDate } = filters;
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) })
      };
    }

    return await Order.aggregate([
      { $match: match },
      {
        $facet: {
          // Đếm tất cả trạng thái hiện có
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          // Tổng doanh thu từ đơn hoàn thành
          revenue: [
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ]
        }
      }
    ]);
  }
}

module.exports = new OrderRepository();