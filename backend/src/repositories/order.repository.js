const { orderStatusObject, orderStatus } = require('@/constants/orderStatus');
const Order = require('../models/Order');

class OrderRepository {

  async create(payload) {
    return await Order.create(payload);
  }

  async findByUserId(userId) {
    return await Order.find({ userId: userId }).sort({ updatedAt: -1 });
  }

  async findById(orderId) {
    return await Order.findById(orderId);
  }

  async cancelOrder(orderId) {
    return await Order.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true });
  }

  async update(orderId, updatedFields) {
    return await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });
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
  async getOrderTrend(startDate, endDate) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['completed', 'cancelled'] }
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
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          completed: 1,
          cancelled: 1
        }
      }
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
            { $group: { _id: null, total: { $sum: { $add: ["$totalFoodPrice", "$shippingFee"]} } } }
          ]
        }
      }
    ]);
  }

  /**
   * Lấy top selling categories
   */
  async getTopCategoriesTotalSales() {
    return await Order.aggregate([
      {
        // 1. Chỉ lấy những đơn hàng đã hoàn tất
        $match: { status: "completed" }
      },
      { 
        // 2. Chia nhỏ mảng items để xử lý từng món ăn
        $unwind: "$items" 
      },
      {
        // 3. Tìm thông tin MenuItem để lấy categoryId
        $lookup: {
          from: "menuitems", // Đảm bảo tên collection chính xác trong MongoDB
          localField: "items.menuItemId",
          foreignField: "_id",
          as: "menuItemInfo"
        }
      },
      { $unwind: "$menuItemInfo" },
      {
        // 4. Nhóm theo categoryId và tính tổng số lượng (quantity)
        $group: {
          _id: "$menuItemInfo.categoryId",
          totalCompletedQuantity: { $sum: "$items.quantity" }
        }
      },
      {
        // 5. Lấy tên thể loại từ collection Category
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        // 6. Định dạng kết quả trả về
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.name",
          totalQuantity: "$totalCompletedQuantity"
        }
      },
      { 
        // 7. Sắp xếp từ cao xuống thấp
        $sort: { totalQuantity: -1 } 
      }
    ]);
  }
}

module.exports = new OrderRepository();