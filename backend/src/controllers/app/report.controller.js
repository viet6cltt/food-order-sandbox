
const reportService = require('@/services/app/report.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');


class ReportController {
  /**
   * @swagger
   * /restaurants/{restaurantId}/report:
   *   post:
   *     summary: Send a report about restaurant
   *     description: User reports a problem or issue with a restaurant
   *     tags:
   *       - Report
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Target ID (restaurant/order ID)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - targetType
   *               - reason
   *             properties:
   *               targetType:
   *                 type: string
   *                 enum: [restaurant, order, menu_item]
   *                 example: "restaurant"
   *               reason:
   *                 type: string
   *                 example: "Poor food quality"
   *               description:
   *                 type: string
   *                 example: "The food was not fresh and taste bad"
   *     responses:
   *       201:
   *         description: Report sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Missing required fields
   *       401:
   *         description: Unauthorized - Missing or invalid token
   */
  async sendReport(req, res, next) {
    try {
      const { targetId } = req.params;
      const { targetType, reason, description } = req.body;

      const report = await reportService.createReport({
        reportedBy: req.userId,
        targetId,
        targetType,
        reason,
        description,
      });

      return SUCCESS.created(res, "Send report successfully. Please wait admin handle", report);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new ReportController();