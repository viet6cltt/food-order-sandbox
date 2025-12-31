const revenueRepository = require('../repositories/revenue.repository');


class RevenueService {
  async getRevenueByDay(restaurantId, date) {
    return await revenueRepository.getRevenueByDay(restaurantId, date);
  }

  async getRevenueByWeek(restaurantId, weekStart) {
    const start = new Date(weekStart);
    const end = new Date(weekStart);

    end.setDate(end.getDate() + 7);

    return await revenueRepository.getRevenueByWeek(restaurantId, start, end);
  }

  async getTotalRevenue(restaurantId) {
    return await revenueRepository.getTotalRevenue(restaurantId);
  }
}

module.exports = new RevenueService();