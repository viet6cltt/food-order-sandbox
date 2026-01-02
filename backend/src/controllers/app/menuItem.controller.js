const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse');
const MenuItemService = require('@/services/app/menuItem.service');

class MenuItemController {
  /**
   * @swagger
   * /restaurants/{restaurantId}/menu-items:
   *   get:
   *     summary: Get menu items by restaurant
   *     description: Retrieve all menu items for a specific restaurant
   *     tags:
   *       - Menu Items
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Restaurant ID
   *         example: "695766bc800adc19a9b60145"
   *     responses:
   *       200:
   *         description: Menu items retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     menuItems:
   *                       type: array
   *       400:
   *         description: Missing restaurant ID
   *       404:
   *         description: Restaurant not found
   */
  async getMenuItems(req, res, next) {
    try {
      const { restaurantId } = req.params;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const menuItems = await MenuItemService.getMenuItems(restaurantId);

      return SUCCESS_RESPONSE.success(res, 'Get menu items by restaurantId successfully', { menuItems } );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /menu-items/{menuItemId}:
   *   get:
   *     summary: Get menu item details
   *     description: Retrieve detailed information about a specific menu item
   *     tags:
   *       - Menu Items
   *     parameters:
   *       - in: path
   *         name: menuItemId
   *         required: true
   *         schema:
   *           type: string
   *         description: Menu Item ID
   *     responses:
   *       200:
   *         description: Menu item retrieved successfully
   *       400:
   *         description: Missing menu item ID
   *       404:
   *         description: Menu item not found
   */
  async getMenuItemInfo(req, res, next) {
    try {
      const { menuItemId } = req.params;
      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.getMenuItemInfo(menuItemId);

      return SUCCESS_RESPONSE.success(res, 'Get menu item successfully', { menuItem } );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/menu-item:
   *   post:
   *     summary: Create a new menu item
   *     description: Create a new menu item for a restaurant (owner only)
   *     tags:
   *       - Menu Items
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - categoryId
   *               - name
   *               - price
   *               - imageUrl
   *             properties:
   *               categoryId:
   *                 type: string
   *               name:
   *                 type: string
   *                 example: "Cơm Tấm Sườn Bì"
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               imageUrl:
   *                 type: string
   *               isAvailable:
   *                 type: boolean
   *               optionGroups:
   *                 type: array
   *     responses:
   *       201:
   *         description: Menu item created successfully
   *       400:
   *         description: Invalid or missing required fields
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async createMenuItem(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const userId = req.userId;

      const data = req.body;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.createMenuItem(restaurantId, userId, data);

      return SUCCESS_RESPONSE.success(res, 'Create new Menu Item successfully', { menuItem });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /menu-items/{menuItemId}:
   *   put:
   *     summary: Update a menu item
   *     description: Update menu item details (owner only)
   *     tags:
   *       - Menu Items
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: menuItemId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               imageUrl:
   *                 type: string
   *               isAvailable:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Menu item updated successfully
   *       400:
   *         description: Missing menu item ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   *       404:
   *         description: Menu item not found
   */
  async updateMenuItem(req, res, next) {
    try {
      const { menuItemId } = req.params;
      const data = req.body;
      const userId = req.userId;

      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.updateMenuItem(menuItemId, userId, data);

      return SUCCESS_RESPONSE.success(res, 'Update menu item successfully', { menuItem } );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /menu-items/{menuItemId}:
   *   delete:
   *     summary: Delete a menu item
   *     description: Remove a menu item from restaurant (owner only)
   *     tags:
   *       - Menu Items
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: menuItemId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Menu item deleted successfully
   *       400:
   *         description: Missing menu item ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   *       404:
   *         description: Menu item not found
   */
  async deleteMenuItem(req, res, next) {
    try {
      const { menuItemId } = req.params;
      const userId = req.userId;

      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      await MenuItemService.deleteMenuItem(menuItemId, userId);

      return SUCCESS_RESPONSE.success(res, 'Delete menu item successfully' );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MenuItemController();