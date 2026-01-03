const restaurantRequestService = require('@/services/app/restaurantRequest.service');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse');

class RestaurantRequestController {
  /**
   * @swagger
   * /users/restaurant-requests:
   *   post:
   *     summary: Submit restaurant request
   *     description: Submit a request to become a restaurant owner
   *     tags:
   *       - Restaurant Requests
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - restaurantName
   *               - phone
   *               - address
   *             properties:
   *               restaurantName:
   *                 type: string
   *                 example: "Pizza Hut"
   *               phone:
   *                 type: string
   *                 example: "+84912345678"
   *               address:
   *                 type: string
   *                 example: "123 Main St, City"
   *               description:
   *                 type: string
   *                 example: "Delicious Italian pizza"
   *               cuisineType:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Italian", "Pizza"]
   *               estimatedRevenue:
   *                 type: number
   *                 example: 50000000
   *     responses:
   *       200:
   *         description: Restaurant request submitted successfully
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
   *                   example: Send Request Successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     request:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         userId:
   *                           type: string
   *                         restaurantName:
   *                           type: string
   *                         status:
   *                           type: string
   *                           enum: [pending, approved, rejected]
   *                           example: pending
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing required data
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async submit(req, res, next) {
    try {
      const userId = req.userId;
      const data = req.body;

      if (!data) {
        throw new ERR_RESPONSE.BadRequestError("Missing Required Data");
      }

      const result = await restaurantRequestService.submitRequest(userId, data);
      return SUCCESS_RESPONSE.success(res, "Send Request Successfully", result); 
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /users/restaurant-requests/me:
   * get:
   *   summary: Get my restaurant request
   *    description: Retrieve the restaurant request submitted by the authenticated user
   *    tags:
   *      - Restaurant Requests
   *    security:
   *      - bearerAuth: []
   *   responses:
   *    200:
   *      description: Restaurant request retrieved successfully
   *    content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *        success:
   *          type: boolean
   *     example: true
   *      message:
   *      type: string
   *      example: Get request successfully
   *      data:
   *        type: object
   *        properties:
   *          request:
   *            type: object
   *            properties:
   *              _id:
   *                type: string
   *    userId:
   *   type: string
   *  restaurantName:
   *  type: string
   * status:
   *  type: string
   * enum: [pending, approved, rejected]
   * example: pending
   * createdAt:
   * type: string
   * format: date-time
   *  400:
   *   description: Bad request - Missing required data
   *  401:
   *  description: Unauthorized - Invalid or missing token
   */
  async getMyRequest(req, res, next) {
    try {
      const userId = req.userId;
      const request = await restaurantRequestService.getMyRequest(userId);
      
      if (!request) {
        return SUCCESS_RESPONSE.success(res, "No pending request found", null);
      }

      return SUCCESS_RESPONSE.success(res, "Get request successfully", request);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RestaurantRequestController();