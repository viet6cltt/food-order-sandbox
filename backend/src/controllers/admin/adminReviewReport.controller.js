const adminReportService = require('@/services/admin/adminReport.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');

class AdminReportController {
  /**
   * @swagger
   * /admin/reports:
   *   get:
   *     summary: Get all reports
   *     description: Retrieve list of reports with pagination and filtering by targetType and status
   *     tags:
   *       - Admin Reports
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Page number
   *         schema:
   *           type: number
   *           example: 1
   *       - name: limit
   *         in: query
   *         description: Records per page (10-50)
   *         schema:
   *           type: number
   *           example: 10
   *       - name: targetType
   *         in: query
   *         description: Type of reported target
   *         schema:
   *           type: string
   *           enum: [restaurant, order, menu_item, user, review]
   *           example: restaurant
   *       - name: status
   *         in: query
   *         description: Report status
   *         schema:
   *           type: string
   *           enum: [PENDING, RESOLVED, REJECTED]
   *           example: PENDING
   *     responses:
   *       200:
   *         description: Reports retrieved successfully
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
   *                   example: Get all reports successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     items:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           _id:
   *                             type: string
   *                           reportedBy:
   *                             type: string
   *                           targetType:
   *                             type: string
   *                           targetId:
   *                             type: string
   *                           reason:
   *                             type: string
   *                           status:
   *                             type: string
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                     meta:
   *                       type: object
   *                       properties:
   *                         total:
   *                           type: number
   *                         page:
   *                           type: number
   *                         limit:
   *                           type: number
   *                         totalPages:
   *                           type: number
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async getAllReports(req, res, next) {
    try {
      const pagination = req.pagination;
      const { targetType, status } = req.query; 
      const result = await adminReportService.getAllReports(pagination, { targetType, status });

      console.log(result);

      return SUCCESS.success(res, 'Get all reports successfully', result);
    } catch (err) { next(err); }
  }

  /**
   * @swagger
   * /admin/reports/{reportId}:
   *   get:
   *     summary: Get report details
   *     description: Retrieve detailed information about a specific report including description and target object details
   *     tags:
   *       - Admin Reports
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: reportId
   *         in: path
   *         required: true
   *         description: Report ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Report details retrieved successfully
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
   *                   example: Get report detail successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     report:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         reportedBy:
   *                           type: string
   *                         targetType:
   *                           type: string
   *                           enum: [restaurant, order, menu_item, user, review]
   *                         targetId:
   *                           type: string
   *                         reason:
   *                           type: string
   *                         description:
   *                           type: string
   *                         status:
   *                           type: string
   *                           enum: [PENDING, RESOLVED, REJECTED]
   *                         adminNote:
   *                           type: string
   *                           nullable: true
   *                         resolvedAction:
   *                           type: string
   *                           enum: [NONE, HIDE_REVIEW, BLOCK_RESTAURANT, BLOCK_USER]
   *                         resolvedBy:
   *                           type: string
   *                           nullable: true
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing report ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Report not found
   */
  async getReportDetail(req, res, next) {
    try {
      const { reportId } = req.params;

      if (!reportId) throw new ERR_RESPONSE.BadRequestError("Missing reportId");

      const result = await adminReportService.getReportDetail(reportId);

      return SUCCESS.success(res, "Get report detail successfully", result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/reports/{reportId}/handle:
   *   patch:
   *     summary: Resolve or reject report
   *     description: Handle a pending report by resolving (with action) or rejecting it. Resolving executes the specified penalty action.
   *     tags:
   *       - Admin Reports
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: reportId
   *         in: path
   *         required: true
   *         description: Report ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [RESOLVED, REJECTED]
   *                 description: Report status after handling
   *                 example: RESOLVED
   *               adminNote:
   *                 type: string
   *                 description: Admin's note about the resolution
   *                 example: "Violation confirmed. Restaurant blocking for 30 days."
   *               resolvedAction:
   *                 type: string
   *                 enum: [NONE, HIDE_REVIEW, BLOCK_RESTAURANT, BLOCK_USER]
   *                 description: Action to execute (only for RESOLVED status)
   *                 example: BLOCK_RESTAURANT
   *     responses:
   *       200:
   *         description: Report resolved successfully
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
   *                   example: Report resolved successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     report:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         status:
   *                           type: string
   *                           example: RESOLVED
   *                         adminNote:
   *                           type: string
   *                         resolvedAction:
   *                           type: string
   *                         resolvedBy:
   *                           type: string
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Invalid status or missing reportId
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Report not found
   *       409:
   *         description: Conflict - Report already processed
   */
  async resolveReport(req, res, next) {
    try {
      const { reportId } = req.params;
      const { status, adminNote, resolvedAction } = req.body;

      if (!status || !["RESOLVED", "REJECTED"].includes(status)) {
        throw new ERR_RESPONSE.BadRequestError("Report Status is not valid");
      }

      const result = await adminReportService.resolve(reportId, {
        status,
        adminNote,
        resolvedAction: resolvedAction || 'NONE',
        resolvedBy: req.userId,
      });

      return SUCCESS.success(res, "Report resolved successfully", result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminReportController();
