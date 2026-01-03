const adminCategoryService = require('../../services/admin/adminCategory.service');
const ERR = require('../../constants/errorCodes');
const ERR_RESPONSE = require('../../utils/httpErrors');
const SUCCESS_RESPONSE = require('../../utils/successResponse'); 

class AdminCategoryController {
  /**
   * @swagger
   * /admin/categories:
   *   post:
   *     summary: Create a new category
   *     description: Creates a new food category for restaurants
   *     tags:
   *       - Admin Categories
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Phở"
   *               description:
   *                 type: string
   *                 example: "Vietnamese noodle soup"
   *               imageUrl:
   *                 type: string
   *                 example: "https://example.com/pho.jpg"
   *     responses:
   *       201:
   *         description: Category created successfully
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
   *                   example: "Create new category successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       example: "60d5ec49c1234a1b8c5f6e7a"
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     imageUrl:
   *                       type: string
   *                     isActive:
   *                       type: boolean
   *       400:
   *         description: Missing required field (name)
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       403:
   *         description: Forbidden - Admin access required
   */
  async create(req, res, next) {
    try {
      const data = req.body;

      const filePath = req.file ? req.file.path : null;

      if (!data.name) {
        throw new ERR_RESPONSE.BadRequestError("Require name to create category");
      }

      const category = await adminCategoryService.create(data, filePath);

      return SUCCESS_RESPONSE.success(res, "Create new category successfully", category);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/categories/{categoryId}:
   *   put:
   *     summary: Update a category
   *     description: Updates category information (name, description, image)
   *     tags:
   *       - Admin Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID
   *         example: "60d5ec49c1234a1b8c5f6e7a"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Cơm Tấm"
   *               description:
   *                 type: string
   *                 example: "Vietnamese broken rice"
   *               imageUrl:
   *                 type: string
   *                 example: "https://example.com/com-tam.jpg"
   *     responses:
   *       200:
   *         description: Category updated successfully
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
   *                   example: "Update category successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Missing category ID or no data provided
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Category not found
   */
  async update(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        throw new ERR_RESPONSE.BadRequestError("No data provided");
      }

      const filePath = req.file ? req.file.path : null;

      const updated = await adminCategoryService.update(categoryId, data, filePath);

      return SUCCESS_RESPONSE.success(res, "Update category successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/categories/{categoryId}/deactive:
   *   patch:
   *     summary: Deactivate a category
   *     description: Disables a category so it won't appear in restaurant menus
   *     tags:
   *       - Admin Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID to deactivate
   *         example: "60d5ec49c1234a1b8c5f6e7a"
   *     responses:
   *       200:
   *         description: Category deactivated successfully
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
   *                   example: "Deactive successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Missing category ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Category not found
   */
  async deactive(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const updated = await adminCategoryService.deactive(categoryId);

      return SUCCESS_RESPONSE.success(res, "Deactive successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/categories/{categoryId}/active:
   *   patch:
   *     summary: Activate a category
   *     description: Enables a category to appear in restaurant menus
   *     tags:
   *       - Admin Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID to activate
   *         example: "60d5ec49c1234a1b8c5f6e7a"
   *     responses:
   *       200:
   *         description: Category activated successfully
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
   *                   example: "Active successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Missing category ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Category not found
   */
  async active(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const updated = await adminCategoryService.active(categoryId);

      return SUCCESS_RESPONSE.success(res, "Active successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/categories/{categoryId}:
   *   delete:
   *     summary: Delete a category
   *     description: Permanently removes a category from the system
   *     tags:
   *       - Admin Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID to delete
   *         example: "60d5ec49c1234a1b8c5f6e7a"
   *     responses:
   *       202:
   *         description: Category deleted successfully
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
   *                   example: "Delete successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Missing category ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Category not found
   */
  async delete(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      await adminCategoryService.deleteCategory(categoryId);

      return SUCCESS_RESPONSE.accepted(res, "Delete successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminCategoryController();

