const CartService = require("@/services/cart.service");
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse'); 

class CartController {
  /**
   * @swagger
   * /cart:
   *   get:
   *     summary: Get user's cart
   *     description: Retrieve the current user's shopping cart with all items
   *     tags:
   *       - Cart
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Cart retrieved successfully
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
   *                   example: Get cart info successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     cart:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439011
   *                         userId:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439012
   *                         items:
   *                           type: array
   *                           items:
   *                             type: object
   *                             properties:
   *                               _id:
   *                                 type: string
   *                               menuItemId:
   *                                 type: string
   *                               quantity:
   *                                 type: number
   *                                 example: 2
   *                               selectedOptions:
   *                                 type: object
   *                         restaurantId:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439013
   *                         totalPrice:
   *                           type: number
   *                           example: 150000
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async getCart(req, res, next) {
    try {
      const userId = req.userId;

      const cart = await CartService.getCart(userId);
      return SUCCESS_RESPONSE.success(res, 'Get cart info successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /cart/items:
   *   post:
   *     summary: Add item to cart
   *     description: Add a new item with options to the user's cart. If cart doesn't exist, create it first.
   *     tags:
   *       - Cart
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - restaurantId
   *               - menuItemId
   *               - quantity
   *             properties:
   *               restaurantId:
   *                 type: string
   *                 example: 507f1f77bcf86cd799439013
   *               menuItemId:
   *                 type: string
   *                 example: 507f1f77bcf86cd799439014
   *               quantity:
   *                 type: number
   *                 example: 2
   *               selectedOptions:
   *                 type: object
   *                 example: { size: "large", topping: ["cheese", "bacon"] }
   *               note:
   *                 type: string
   *                 example: No onions please
   *     responses:
   *       200:
   *         description: Item added to cart successfully
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
   *                   example: post cart item successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     cart:
   *                       type: object
   *       400:
   *         description: Bad request - Missing restaurantId or invalid input
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async addItem(req, res, next) {
    try {
      const userId = req.userId;
      const restaurantId = req.body.restaurantId;
      const itemData = req.body;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const cart = await CartService.addItem(userId, restaurantId, itemData);

      return SUCCESS_RESPONSE.success(res, 'post cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /cart/items/{itemId}:
   *   put:
   *     summary: Update cart item
   *     description: Update quantity or options of an existing cart item
   *     tags:
   *       - Cart
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: itemId
   *         in: path
   *         required: true
   *         description: Cart item ID (not menu item ID)
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439015
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantity:
   *                 type: number
   *                 example: 3
   *               selectedOptions:
   *                 type: object
   *                 example: { size: "medium", topping: ["bacon"] }
   *               note:
   *                 type: string
   *                 example: Extra sauce
   *     responses:
   *       200:
   *         description: Cart item updated successfully
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
   *                   example: Update cart item successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     cart:
   *                       type: object
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: Not found - Cart item not found
   */
  async updateItem(req, res, next) {
    try {
      const userId = req.userId;
      const { itemId } = req.params;
      const updateData = req.body;

      const cart = await CartService.updateItem(userId, itemId, updateData);
      return SUCCESS_RESPONSE.success(res, 'Update cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /cart/items/{itemId}:
   *   delete:
   *     summary: Remove item from cart
   *     description: Remove a specific item from the user's cart
   *     tags:
   *       - Cart
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: itemId
   *         in: path
   *         required: true
   *         description: Cart item ID (not menu item ID)
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439015
   *     responses:
   *       200:
   *         description: Cart item deleted successfully
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
   *                   example: Delete cart item successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     cart:
   *                       type: object
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: Not found - Cart item not found
   */
  async deleteItem(req, res, next) {
    try {
      const userId = req.userId;
      const { itemId } = req.params;

      const cart = await CartService.deleteItem(userId, itemId);
      return SUCCESS_RESPONSE.success(res, 'Delete cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /cart/checkout:
   *   post:
   *     summary: Checkout cart
   *     description: Convert cart items into an order. Clears the cart after successful checkout.
   *     tags:
   *       - Cart
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Checkout completed successfully
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
   *                   example: Check out successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     order:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439016
   *                         userId:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439012
   *                         restaurantId:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439013
   *                         items:
   *                           type: array
   *                           items:
   *                             type: object
   *                         totalPrice:
   *                           type: number
   *                           example: 150000
   *                         status:
   *                           type: string
   *                           example: pending
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Cart is empty or invalid
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async checkout(req, res, next) {
    try {
      const userId = req.userId;
      
      const order = await CartService.checkout(userId);

      return SUCCESS_RESPONSE.success(res, 'Check out successfully', { order });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();

