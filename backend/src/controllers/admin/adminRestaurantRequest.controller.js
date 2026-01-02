const adminResReqService = require('@/services/admin/adminRestaurantRequest.service');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse');

class RestaurantRequestController {
  
  /**
   * @swagger
   * /admin/restaurant-requests:
   *   get:
   *     summary: Get all pending restaurant requests
   *     description: Retrieve list of all pending restaurant owner requests awaiting admin approval
   *     tags:
   *       - Admin Restaurant Requests
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Pending requests retrieved successfully
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
   *                   example: Get pending request successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         example: 507f1f77bcf86cd799439011
   *                       userId:
   *                         type: string
   *                       restaurantName:
   *                         type: string
   *                         example: Pizza Hut
   *                       phone:
   *                         type: string
   *                       address:
   *                         type: string
   *                       description:
   *                         type: string
   *                       status:
   *                         type: string
   *                         enum: [pending, approved, rejected]
   *                         example: pending
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async listPending(req, res, next) {
    try {
      const data = await adminResReqService.getPendingRequests();
      
      return SUCCESS_RESPONSE.success(res, "Get pending request successfully", data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/restaurant-requests/{requestId}:
   *   get:
   *     summary: Get restaurant request details
   *     description: Retrieve detailed information about a specific restaurant request
   *     tags:
   *       - Admin Restaurant Requests
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: requestId
   *         in: path
   *         required: true
   *         description: Restaurant request ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Request details retrieved successfully
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
   *                   example: Get Request Successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     userId:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         name:
   *                           type: string
   *                         phone:
   *                           type: string
   *                         email:
   *                           type: string
   *                     restaurantName:
   *                       type: string
   *                     phone:
   *                       type: string
   *                     address:
   *                       type: string
   *                     description:
   *                       type: string
   *                     cuisineType:
   *                       type: array
   *                       items:
   *                         type: string
   *                     status:
   *                       type: string
   *                       enum: [pending, approved, rejected]
   *                     rejectionReason:
   *                       type: string
   *                       nullable: true
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing request ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Request not found
   */
  async getById(req, res, next) {
    try {
      const { requestId } = req.params;
      if (!requestId) throw new ERR_RESPONSE.BadRequestError("Missing request id");

      const request = await adminResReqService.getById(requestId);

      return SUCCESS_RESPONSE.success(res, "Get Request Successfully", request);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/restaurant-requests/{requestId}/approve:
   *   patch:
   *     summary: Approve restaurant request
   *     description: Approve a pending restaurant request. Upgrades user role to RESTAURANT_OWNER and creates restaurant profile.
   *     tags:
   *       - Admin Restaurant Requests
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: requestId
   *         in: path
   *         required: true
   *         description: Restaurant request ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Request approved successfully
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
   *                   example: Approve this request successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     approveReq:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         status:
   *                           type: string
   *                           enum: [approved]
   *                           example: approved
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *                     restaurant:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         name:
   *                           type: string
   *                         ownerId:
   *                           type: string
   *                         phone:
   *                           type: string
   *                         address:
   *                           type: string
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing request ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Request not found
   *       422:
   *         description: Unprocessable entity - Request already handled
   */
  async approve(req, res, next) {
    try {
      const { requestId } = req.params;
      if (!requestId) throw new ERR_RESPONSE.BadRequestError("Missing request id");

      const result = await adminResReqService.approveRequest(requestId);

      return SUCCESS_RESPONSE.success(res, "Approve this request successfully", result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/restaurant-requests/{requestId}/reject:
   *   patch:
   *     summary: Reject restaurant request
   *     description: Reject a pending restaurant owner request with a reason
   *     tags:
   *       - Admin Restaurant Requests
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: requestId
   *         in: path
   *         required: true
   *         description: Restaurant request ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reason:
   *                 type: string
   *                 description: Reason for rejection
   *                 example: "Insufficient business documentation"
   *     responses:
   *       200:
   *         description: Request rejected successfully
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
   *                   example: Reject this request successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     status:
   *                       type: string
   *                       enum: [rejected]
   *                       example: rejected
   *                     rejectionReason:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing request ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Request not found
   *       422:
   *         description: Unprocessable entity - Request already handled
   */
  async reject(req, res, next) {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;
      if (!requestId) throw new ERR_RESPONSE.BadRequestError("Missing request id");

      const result = await adminResReqService.rejectRequest(requestId, reason);
      return SUCCESS_RESPONSE.success(res, "Reject this request successfully", result);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new RestaurantRequestController();