const reviewService = require('@/services/app/review.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');
const fs = require('fs');

class ReviewController {
  /**
   * @swagger
   * /reviews:
   *   post:
   *     summary: Create a review 
   *     description: Submit a review for a completed order with optional images
   *     tags:
   *       - Reviews
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *               - restaurantId
   *               - rating
   *             properties:
   *               orderId:
   *                 type: string
   *                 description: Completed order ID
   *                 example: 507f1f77bcf86cd799439016
   *               restaurantId:
   *                 type: string
   *                 description: Restaurant ID
   *                 example: 507f1f77bcf86cd799439013
   *               rating:
   *                 type: number
   *                 description: Rating from 1-5
   *                 example: 5
   *               comment:
   *                 type: string
   *                 description: Review comment text
   *                 example: Great food and fast delivery!
   *               files:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *                 description: Images/photos for review
   *     responses:
   *       201:
   *         description: Review created successfully
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
   *                   example: Review created
   *                 data:
   *                   type: object
   *       400:
   *         description: Bad request - Missing required fields or order not completed
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Not order owner or already reviewed
   *       404:
   *         description: Not found - Order not found
   */
  async create(req, res, next) {
    try { 
      const { orderId, restaurantId, rating, comment } = req.body;
      const files = req.files; // lấy mảng files upload
      if (!orderId || !restaurantId || !rating) {
        // nếu lỗi thì xóa file tạm
        if (files) files.forEach(f => fs.unlinkSync(f.path));
        throw new ERR_RESPONSE.BadRequestError("Missing required fields");
      }

      const review = await reviewService.create({
        userId: req.userId,
        orderId,
        restaurantId,
        rating,
        comment,
        files: files || []
      });

      return SUCCESS.created(res, 'Review created', review);
    } catch (err) {
      next (err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/reviews:
   *   get:
   *     summary: Get reviews for restaurant
   *     description: Retrieve all published reviews for a specific restaurant with pagination
   *     tags:
   *       - Reviews
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Restaurant ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           example: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           example: 10
   *         description: Reviews per page
   *     responses:
   *       200:
   *         description: Reviews retrieved successfully
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
   *                   example: Reviews fetched
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
   *                           userId:
   *                             type: string
   *                           orderId:
   *                             type: string
   *                           rating:
   *                             type: number
   *                           comment:
   *                             type: string
   *                           images:
   *                             type: array
   *                             items:
   *                               type: string
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
   *       400:
   *         description: Bad request - Missing restaurant ID
   *       404:
   *         description: Not found - Restaurant not found
   */
  async listByRestaurant(req, res, next) {
    try {
      const restaurantId = req.params.restaurantId;
      const pagination = req.pagination;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing restaurantId");
      }

      const result = await reviewService.listByRestaurant(restaurantId, pagination);
      return SUCCESS.success(res, "Reviews fetched", result);
    } catch (err) { next(err); }
  }

  /**
   * @swagger
   * /menu-items/{menuItemId}/reviews:
   *   get:
   *     summary: Get reviews for menu item
   *     description: Retrieve all published reviews for a specific menu item with pagination
   *     tags:
   *       - Reviews
   *     parameters:
   *       - in: path
   *         name: menuItemId
   *         required: true
   *         schema:
   *           type: string
   *         description: Menu Item ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           example: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           example: 10
   *         description: Reviews per page
   *     responses:
   *       200:
   *         description: Menu item reviews retrieved successfully
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
   *                   example: Menu item reviews fetched successfully
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
   *                           userId:
   *                             type: string
   *                           rating:
   *                             type: number
   *                           comment:
   *                             type: string
   *                           images:
   *                             type: array
   *                             items:
   *                               type: string
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
   *       400:
   *         description: Bad request - Missing menu item ID
   *       404:
   *         description: Not found - Menu item not found
   */
  async getByMenuItem(req, res, next) {
    try {
      const { menuItemId } = req.params;
      const pagination = req.pagination;

      if (!menuItemId) throw new ERR_RESPONSE.BadRequestError("Missing menuItemId");

      const result = await reviewService.findByMenuItem(menuItemId, pagination);
      return SUCCESS.success(res, "Menu item reviews fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }
} 

module.exports = new ReviewController();