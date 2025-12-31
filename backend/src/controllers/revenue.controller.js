const revenueService = require('../services/revenue.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');

class RevenueController {
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