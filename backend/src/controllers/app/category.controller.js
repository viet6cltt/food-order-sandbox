const categoryService = require('@/services/category.service');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse'); 


class CategoryController {
  /**
   * @swagger
   * /categories:
   *   get:
   *     summary: Get all categories
   *     description: Retrieve all food categories with pagination support
   *     tags:
   *       - Categories
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Page number for pagination (starts from 1)
   *         schema:
   *           type: number
   *           example: 1
   *       - name: limit
   *         in: query
   *         description: Number of categories per page
   *         schema:
   *           type: number
   *           example: 10
   *     responses:
   *       200:
   *         description: Categories retrieved successfully
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
   *                   example: Get successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     categories:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           _id:
   *                             type: string
   *                             example: 507f1f77bcf86cd799439011
   *                           name:
   *                             type: string
   *                             example: Pizza
   *                           description:
   *                             type: string
   *                             example: Delicious Italian pizzas
   *                           image:
   *                             type: string
   *                             example: https://cdn.example.com/pizza.jpg
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                           updatedAt:
   *                             type: string
   *                             format: date-time
   *                     page:
   *                       type: number
   *                       example: 1
   *                     limit:
   *                       type: number
   *                       example: 10
   *                     total:
   *                       type: number
   *                       example: 25
   */
  async getAllCategories(req, res, next) {
    try {
      const { page, limit } = req.query;

      const categories = await categoryService.getAllCategories({ page, limit });

      return SUCCESS_RESPONSE.success(res, "Get successfully", categories);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /categories/{categoryId}:
   *   get:
   *     summary: Get category by ID
   *     description: Retrieve a specific category by its ID
   *     tags:
   *       - Categories
   *     parameters:
   *       - name: categoryId
   *         in: path
   *         required: true
   *         description: Category ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Category retrieved successfully
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
   *                   example: Get successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     category:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439011
   *                         name:
   *                           type: string
   *                           example: Pizza
   *                         description:
   *                           type: string
   *                           example: Delicious Italian pizzas
   *                         image:
   *                           type: string
   *                           example: https://cdn.example.com/pizza.jpg
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing category ID
   *       404:
   *         description: Not found - Category not found
   */
  async getById(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const category = await categoryService.getById(categoryId);

      return SUCCESS_RESPONSE.success(res, "Get successfully", category);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();