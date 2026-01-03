
const SUCCESS_RESPONSE = require('@/utils/successResponse');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const UserService = require('@/services/app/user.service');
const cloudinary = require('@/config/cloudinary.config');
const fs = require('fs');

class UserController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Check API status
   *     description: Verify that the User API is working
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: API is working
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
   *                   example: User API are working well!!!
   */
  index(req, res, next) {
    return SUCCESS_RESPONSE.success(res, 'User API are working well!!!');
  }

  /**
   * @swagger
   * /users/me:
   *   get:
   *     summary: Get current user profile
   *     description: Retrieve the authenticated user's profile information
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
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
   *                   example: Get your Info successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439012
   *                         phone:
   *                           type: string
   *                         email:
   *                           type: string
   *                         name:
   *                           type: string
   *                         avatarUrl:
   *                           type: string
   *                           nullable: true
   *                         status:
   *                           type: string
   *                           enum: [active, inactive, suspended]
   *                         providers:
   *                           type: array
   *                           items:
   *                             type: object
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async getMe(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError('Access Token are missing or invalid', ERR.AUTH_INVALID_TOKEN);
      }

      const user = await UserService.findById(userId);

      // user.avatarUrl = user.avatarUrl || user.providers[0]?.avatarUrl || null;

      return SUCCESS_RESPONSE.success(res, 'Get your Info successfully', { user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /users/{userId}:
   *   get:
   *     summary: Get user profile
   *     description: Retrieve a user's profile information by user ID
   *     tags:
   *       - Users
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
   *         description: User profile retrieved successfully
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
   *                   example: Get user Info successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         phone:
   *                           type: string
   *                         email:
   *                           type: string
   *                         name:
   *                           type: string
   *                         avatarUrl:
   *                           type: string
   *                           nullable: true
   *                         status:
   *                           type: string
   *       400:
   *         description: Bad request - Missing user ID
   *       404:
   *         description: Not found - User not found
   */
  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError('UserId is required!', ERR.VALIDATION_FAILED);

      const user = await UserService.findById(userId);

      return SUCCESS_RESPONSE.success(res, 'Get user Info successfully', { user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /users/me:
   *   put:
   *     summary: Update current user profile
   *     description: Update the authenticated user's profile information
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john@example.com
   *               phone:
   *                 type: string
   *                 example: "+84912345678"
   *               address:
   *                 type: string
   *                 example: "123 Main St, City"
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *                 example: "1990-01-15"
   *               gender:
   *                 type: string
   *                 enum: [male, female, other]
   *     responses:
   *       200:
   *         description: User profile updated successfully
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
   *                   example: Update your Info successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     updatedUser:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         name:
   *                           type: string
   *                         email:
   *                           type: string
   *                         phone:
   *                           type: string
   *                         address:
   *                           type: string
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Invalid input data
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async updateMe(req, res, next) {
    try {
      const userId = req.userId;
      const data = req.body;

      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError('Access Token are missing or invalid', ERR.AUTH_INVALID_TOKEN);
      }

      const updatedUser = await UserService.updateUser(userId, data);

      return SUCCESS_RESPONSE.success(res, 'Update your Info successfully', { updatedUser });
    } catch (err) {
      next(err);
    }
  }

  // [PATCH] /users/me/avatar
  async uploadMyAvatar(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError('Access Token are missing or invalid', ERR.AUTH_INVALID_TOKEN);
      }

      if (!req.file || !req.file.path) {
        throw new ERR_RESPONSE.BadRequestError('Please upload an avatar image');
      }

      const filePath = req.file.path;

      const result = await cloudinary.uploader.upload(filePath, {
        folder: `food-order/users/${userId}`,
        public_id: `avatar-${Date.now()}`,
        overwrite: true,
      });

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      const updatedUser = await UserService.updateUser(userId, { avatarUrl: result.secure_url });

      return SUCCESS_RESPONSE.success(res, 'Upload avatar successfully', { updatedUser });
    } catch (err) {
      try {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore cleanup errors
      }
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new ERR_RESPONSE.BadRequestError('Missing password');
      }

      const updatedUser = await UserService.changePassword(userId, oldPassword, newPassword);
      return SUCCESS_RESPONSE.success(res, 'Change your password successfully', { updatedUser });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();