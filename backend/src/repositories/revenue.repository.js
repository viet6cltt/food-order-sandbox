const Order = require('../models/Order');
const { Types } = require("mongoose");

class RevenueRepository {
  async getRevenueByDay(restaurantId, date) {
    const start = new Date(date);
    const end = new Date(date);

    end.setDate(end.getDate() + 1);

    return await Order.aggregate([
      {
        $match: {
          restaurantId: new Types.ObjectId(`${restaurantId}`),
          status: "completed",
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $addFields: {
          revenue: {
            $subtract: [
              { $add: ["$totalFoodPrice", "$shippingFee"] },
              "$discountAmount"
            ]
          }
        }
      },
      {
        $group: {
          _id: null, 
          totalRevenue: { $sum: "$revenue" },
          orderCount: { $sum: 1 }
        }
      }
    ]);
  }

  async getRevenueByWeek(restaurantId, startOfWeek, endOfWeek) {
    return await Order.aggregate([
    {
      $match: {
        restaurantId: new Types.ObjectId(`${restaurantId}`),
        status: "completed",
        createdAt: { $gte: startOfWeek, $lt: endOfWeek }
      }
    },
    {
      $addFields: {
        revenue: {
          $subtract: [
            { $add: ["$totalFoodPrice", "$shippingFee"] },
            "$discountAmount"
          ]
        }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        dailyRevenue: { $sum: "$revenue" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
    ]);
  }

  async getTotalRevenue(restaurantId) {
    return await Order.aggregate([
      {
        $match: {
          restaurantId: new Types.ObjectId(`${restaurantId}`),
          status: "completed"
        }
      },
      {
        $addFields: {
          revenue: {
            $subtract: [
              { $add: ["$totalFoodPrice", "$shippingFee"] },
              "$discountAmount"
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);
  }
}

module.exports = new RevenueRepository();

