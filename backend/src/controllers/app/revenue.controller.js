const revenueService = require('@/services/app/revenue.service');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse');

class RevenueController {
  /**
   * @swagger
   * /restaurants/{restaurantId}/revenue/day:
   *   get:
   *     summary: Get revenue by day
   *     description: Get restaurant revenue for a specific day (owner only)
   *     tags:
   *       - Revenue
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Date to get revenue (YYYY-MM-DD)
   *         example: "2024-12-01"
   *     responses:
   *       200:
   *         description: Daily revenue retrieved successfully
   *       400:
   *         description: Missing date parameter
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async getDayRevenue(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const { date } = req.query;
      if (!Date) {
        throw new ERR_RESPONSE.BadRequestError("Missing Date", ERR.INVALID_INPUT);
      }
      const data = await revenueService.getRevenueByDay(restaurantId, date);

      return SUCCESS_RESPONSE.success(res, "Get revenue of this restaurant by day successfully", { data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/revenue/week:
   *   get:
   *     summary: Get revenue by week
   *     description: Get restaurant revenue for a specific week (owner only)
   *     tags:
   *       - Revenue
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: weekStart
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date of week (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Weekly revenue retrieved successfully
   *       400:
   *         description: Missing weekStart parameter
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async getWeekRevenue(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const { weekStart } = req.query;

      if (!weekStart) {
        throw new ERR_RESPONSE.BadRequestError("Missing Week Start Day", ERR.INVALID_INPUT);
      }
      const data = await revenueService.getRevenueByWeek(restaurantId, weekStart);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/revenue/total:
   *   get:
   *     summary: Get total revenue
   *     description: Get total revenue of restaurant (owner only)
   *     tags:
   *       - Revenue
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Restaurant ID
   *     responses:
   *       200:
   *         description: Total revenue retrieved successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async getTotal(req, res, next) {
    try {
      const { restaurantId } = req.params;

      const data = await revenueService.getTotalRevenue(restaurantId);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RevenueController();