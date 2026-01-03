const ERR = require('../../constants/errorCodes');
const ERR_RESPONSE = require('../../utils/httpErrors');
const SUCCESS_RESPONSE = require('../../utils/successResponse'); 

const adminUserService = require('../../services/admin/adminUser.service');

class AdminUserController {
  /**
   * @swagger
   * /admin/users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve list of all users with optional filtering by role and status
   *     tags:
   *       - Admin Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: role
   *         in: query
   *         description: Filter by user role
   *         schema:
   *           type: string
   *           enum: [CUSTOMER, RESTAURANT_OWNER, ADMIN]
   *           example: CUSTOMER
   *       - name: status
   *         in: query
   *         description: Filter by user status
   *         schema:
   *           type: string
   *           enum: [active, inactive, banned, suspended]
   *           example: active
   *     responses:
   *       200:
   *         description: Users retrieved successfully
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
   *                   example: Get users successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         example: 507f1f77bcf86cd799439012
   *                       phone:
   *                         type: string
   *                       email:
   *                         type: string
   *                       name:
   *                         type: string
   *                       role:
   *                         type: string
   *                         enum: [CUSTOMER, RESTAURANT_OWNER, ADMIN]
   *                       status:
   *                         type: string
   *                         enum: [active, inactive, banned, suspended]
   *                       avatarUrl:
   *                         type: string
   *                         nullable: true
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async listUsers(req, res, next) {
    try {
      const { role, status } = req.query;

      const pagination = req.pagination;
      const users = await adminUserService.listUsers({ role, status }, pagination);

      return SUCCESS_RESPONSE.success(res, "Get users successfully", users);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/users/{userId}:
   *   get:
   *     summary: Get user details
   *     description: Retrieve detailed information about a specific user
   *     tags:
   *       - Admin Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439012
   *     responses:
   *       200:
   *         description: User details retrieved successfully
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
   *                   example: Get user detail succesfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     phone:
   *                       type: string
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                     role:
   *                       type: string
   *                       enum: [CUSTOMER, RESTAURANT_OWNER, ADMIN]
   *                     status:
   *                       type: string
   *                       enum: [active, inactive, banned, suspended]
   *                     avatarUrl:
   *                       type: string
   *                       nullable: true
   *                     providers:
   *                       type: array
   *                       items:
   *                         type: object
   *                     emailVerified:
   *                       type: boolean
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing user ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - User not found
   */
  async getUserDetail(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.getUserDetail(userId);
      
      return SUCCESS_RESPONSE.success(res, "Get user detail succesfully", user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/users/{userId}/block:
   *   patch:
   *     summary: Block a user account
   *     description: Block (ban) a user account to prevent them from using the platform
   *     tags:
   *       - Admin Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439012
   *     responses:
   *       200:
   *         description: User blocked successfully
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
   *                   example: Block this user is successful
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     phone:
   *                       type: string
   *                     name:
   *                       type: string
   *                     role:
   *                       type: string
   *                     status:
   *                       type: string
   *                       enum: [banned]
   *                       example: banned
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing user ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - User not found
   */
  async blockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.blockUser(userId);
      return SUCCESS_RESPONSE.success(res, "Block this user is successful", user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/users/{userId}/unlock:
   *   patch:
   *     summary: Unlock a user account
   *     description: Unlock (activate) a previously blocked user account
   *     tags:
   *       - Admin Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439012
   *     responses:
   *       200:
   *         description: User unlocked successfully
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
   *                   example: Unlock this user is successful
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     phone:
   *                       type: string
   *                     name:
   *                       type: string
   *                     role:
   *                       type: string
   *                     status:
   *                       type: string
   *                       enum: [active]
   *                       example: active
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing user ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - User not found
   */
  async unlockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.unlockUser(userId);
      return SUCCESS_RESPONSE.success(res, "Unlock this user is successful", user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminUserController();