const Order = require('../models/Order');
const { Types } = require("mongoose");
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

class RevenueRepository {
  async getRevenueByDay(restaurantId, date) {
    let start;
    if (typeof date === 'string' && date.trim()) {
      // Interpret YYYY-MM-DD as local midnight
      start = new Date(`${date}T00:00:00`);
    } else if (date instanceof Date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
    } else {
      // Default to today (local)
      start = new Date();
      start.setHours(0, 0, 0, 0);
    }

    if (Number.isNaN(start.getTime())) {
      throw new ERR_RESPONSE.BadRequestError('Invalid date', ERR.INVALID_INPUT);
    }

    const end = new Date(start);

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

