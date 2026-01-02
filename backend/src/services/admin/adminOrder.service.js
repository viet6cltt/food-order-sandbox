const orderRepository = require("@/repositories/order.repository");

class AdminOrderService {
  
  async getWeeklyPerformanceTrend() {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);

    const stats = await orderRepository.getDashboardStats(sinceDate);
    return stats.map(item => ({
      date: item._id,
      completed: item.completed,
      cancelled: item.cancelled
    }));
  }

  async getOrderAnalysisReport(filters) {

    const processedFilters = {};

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0); // Đặt về đầu ngày
      processedFilters.startDate = start;
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // Đặt về cuối ngày
      processedFilters.endDate = end;
    }

    const data = await orderRepository.getStatusDistributionSummary(processedFilters);

    const result = data[0];
    
    return {
      statusBreakdown: result.byStatus, // theo trạng thái (Pending, Delivering, ...)
      totalRevenue: result.revenue[0]?.total || 0 // doanh thu từ các đơn completed
    };
  }
}

module.exports = new AdminOrderService();