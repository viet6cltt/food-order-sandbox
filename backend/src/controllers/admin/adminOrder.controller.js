const SUCCESS = require('@/utils/successResponse')
const adminOrderService = require('@/services/admin/adminOrder.service');

class AdminOrderController {
  /**
   * @swagger
   * /admin/orders/dashboard-stats:
   *   get:
   *     summary: Get dashboard statistics
   *     description: Retrieve weekly performance trend data for the past 7 days (orders and cancellations)
   *     tags:
   *       - Admin Orders
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Get weekly Orders trend succesfully
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       date:
   *                         type: string
   *                         format: date
   *                         example: "2024-01-02"
   *                       completed:
   *                         type: number
   *                         example: 45
   *                       cancelled:
   *                         type: number
   *                         example: 3
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async getDashboardStats(req, res, next) {
    try {
      const data = await adminOrderService.getWeeklyPerformanceTrend();
      return SUCCESS.success(res, 'Get weekly Orders trend succesfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/orders/statistics:
   *   get:
   *     summary: Get order statistics
   *     description: Retrieve detailed order analysis report with status breakdown and revenue for a date range
   *     tags:
   *       - Admin Orders
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: startDate
   *         in: query
   *         description: Start date for statistics (ISO format)
   *         schema:
   *           type: string
   *           format: date
   *           example: "2024-01-01"
   *       - name: endDate
   *         in: query
   *         description: End date for statistics (ISO format)
   *         schema:
   *           type: string
   *           format: date
   *           example: "2024-01-31"
   *     responses:
   *       200:
   *         description: Order statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Lấy thống kê chi tiết thành công
   *                 data:
   *                   type: object
   *                   properties:
   *                     statusBreakdown:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           _id:
   *                             type: string
   *                             example: pending
   *                           count:
   *                             type: number
   *                             example: 120
   *                     totalRevenue:
   *                       type: number
   *                       description: Total revenue from completed orders
   *                       example: 5250000
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async getOrderStatistics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await adminOrderService.getOrderAnalysisReport({ startDate, endDate });
      return SUCCESS.success(res, "Lấy thống kê chi tiết thành công", data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminOrderController();