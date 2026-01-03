const revenueRepository = require('@/repositories/revenue.repository');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');

class RevenueService {
  async getRevenueByDay(restaurantId, date) {
    return await revenueRepository.getRevenueByDay(restaurantId, date);
  }

  async getRevenueByWeek(restaurantId, weekStart) {
    // Interpret YYYY-MM-DD as local date (avoid UTC parsing differences)
    const start = typeof weekStart === 'string' && weekStart.trim()
      ? new Date(`${weekStart}T00:00:00`)
      : new Date(weekStart);

    if (Number.isNaN(start.getTime())) {
      throw new ERR_RESPONSE.BadRequestError('Invalid weekStart', ERR.INVALID_INPUT);
    }

    const end = new Date(start);

    end.setDate(end.getDate() + 7);

    return await revenueRepository.getRevenueByWeek(restaurantId, start, end);
  }

  async getTotalRevenue(restaurantId) {
    return await revenueRepository.getTotalRevenue(restaurantId);
  }
}

module.exports = new RevenueService();