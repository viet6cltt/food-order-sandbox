const orderRepository = require("@/repositories/order.repository");

class AdminOrderService {
  
  async getOrderAnalysisReport({ startDate, endDate }) {
    // Chuẩn hóa ngày (đầu ngày và cuối ngày)
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [distributionData, trendData] = await Promise.all([
        orderRepository.getStatusDistributionSummary({ startDate: start, endDate: end }),
        orderRepository.getOrderTrend(start, end)
    ]);

    const result = distributionData[0] || { byStatus: [], revenue: [] };

    return {
        statusBreakdown: result.byStatus, // Dùng cho các ô Summary
        totalRevenue: result.revenue[0]?.total || 0, // Dùng cho ô Doanh thu
        trend: trendData // Dùng cho biểu đồ AreaChart
    };
  }

  async getTopCategoriesReport() {
    const data = await orderRepository.getTopCategoriesTotalSales();

    return data.map(item => ({
      name: item.categoryName,
      value: item.totalQuantity
    }));
  }
}

module.exports = new AdminOrderService();