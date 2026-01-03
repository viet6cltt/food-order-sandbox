const orderService = require("@/services/app/order.service");
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse'); 
const { orderStatusObject } = require('@/constants/orderStatus');

class OrderController {
  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Get user's orders
   *     description: Retrieve all orders of the current user
   *     tags:
   *       - Orders (User)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
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
   *                     orders:
   *                       type: array
   *       401:
   *         description: Unauthorized
   */
  async getOrdersOfUser(req, res, next) {
    try {
      const userId = req.userId;

      const orders = await orderService.getOrdersOfUser(userId);

      return SUCCESS_RESPONSE.success(res, "Get Orders Successfully", { orders });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /orders/{orderId}:
   *   get:
   *     summary: Get order details
   *     description: Retrieve details of a specific order
   *     tags:
   *       - Orders (User)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order retrieved successfully
   *       400:
   *         description: Missing order ID
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   */
  async getOrder(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.params;

      if (!orderId) {
        throw new ERR_RESPONSE.BadRequestError("OrderId is missing", ERR.INVALID_INPUT);
      }

      const order = await orderService.getOrder(userId, orderId);

      return SUCCESS_RESPONSE.success(res, "Get Order Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /orders/{orderId}/cancel:
   *   post:
   *     summary: Cancel user's order
   *     description: Cancel a pending order
   *     tags:
   *       - Orders (User)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order cancelled successfully
   *       400:
   *         description: Missing order ID
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   */
  async cancelOrder(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.params;

      if (!orderId) {
        throw new ERR_RESPONSE.BadRequestError("OrderId is missing", ERR.INVALID_INPUT);
      }

      const order = await orderService.cancelOrder(userId, orderId);
      return SUCCESS_RESPONSE.success(res, "Cancel Order Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders:
   *   get:
   *     summary: Get restaurant's orders
   *     description: Get all orders for a restaurant (owner/admin only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, confirmed, preparing, delivering, completed, cancelled]
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Restaurant orders retrieved successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async getOrdersOfRestaurant(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId } = req.params;

      let { page = 1, limit = 10, status, from, to } = req.query;
      
      page = parseInt(page);
      limit = parseInt(limit);

      const orders = await orderService.getOrdersOfRestaurant({
        userId, 
        restaurantId, 
        page,
        status,
        limit,
        from,
        to,
      });

      return SUCCESS_RESPONSE.success(res, "Get Orders Of Restaurant Successfully", { orders });
    } catch(err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}:
   *   get:
   *     summary: Get specific restaurant order
   *     description: Get details of a specific order (owner/admin only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order retrieved successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async getOrderOfRestaurant(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;
      
      const order = await orderService.getOrderByRestaurant(userId, restaurantId, orderId);

      return SUCCESS_RESPONSE.success(res, "Get Orders Of Restaurant Successfully", { order });
    } catch(err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}/confirm:
   *   patch:
   *     summary: Confirm order
   *     description: Restaurant confirms the order (owner only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order confirmed successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async confirmOrderStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;

      const order = await orderService.updateOrderStatusByRestaurant({
        orderId,
        restaurantId, 
        userId,
        status: orderStatusObject.confirmed
      });

      return SUCCESS_RESPONSE.success(res, "Confirm Order Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}/prepare:
   *   patch:
   *     summary: Mark order as preparing
   *     description: Update order status to preparing (owner only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order status updated to preparing
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async prepareOrderStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;

      const order = await orderService.updateOrderStatusByRestaurant({
        orderId,
        restaurantId, 
        userId,
        status: orderStatusObject.preparing
      });

      return SUCCESS_RESPONSE.success(res, "Update Order Status To Prepared Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}/deliver:
   *   patch:
   *     summary: Mark order as delivering
   *     description: Update order status to delivering (owner only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order status updated to delivering
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async deliverOrderStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;

      const order = await orderService.updateOrderStatusByRestaurant({
        orderId,
        restaurantId, 
        userId,
        status: orderStatusObject.delivering
      });

      return SUCCESS_RESPONSE.success(res, "Update Order Status To Delivering Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}/cancel:
   *   patch:
   *     summary: Cancel order
   *     description: Restaurant cancels the order (owner only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order cancelled successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async cancelOrderStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;

      const order = await orderService.updateOrderStatusByRestaurant({
        orderId,
        restaurantId, 
        userId,
        status: orderStatusObject.cancelled
      });

      return SUCCESS_RESPONSE.success(res, "Update Order Status To Cancelled Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/orders/{orderId}/complete:
   *   patch:
   *     summary: Complete order
   *     description: Mark order as completed and create COD payment (owner only)
   *     tags:
   *       - Orders (Restaurant)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order completed successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async completeOrderStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { restaurantId, orderId } = req.params;

      const order = await orderService.updateOrderStatusByRestaurantToCompleted({
        orderId,
        restaurantId, 
        userId
      });

      return SUCCESS_RESPONSE.success(res, "Update Order Status To Completed Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /orders/{orderId}:
   *   patch:
   *     summary: Update order info
   *     description: Update delivery address and payment method
   *     tags:
   *       - Orders (User)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
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
   *               - deliveryAddress
   *               - paymentMethod
   *             properties:
   *               deliveryAddress:
   *                 type: object
   *                 required:
   *                   - full
   *                   - lat
   *                   - lng
   *                 properties:
   *                   full:
   *                     type: string
   *                     example: "123 Nguyễn Huệ, Q1, HCM"
   *                   lat:
   *                     type: number
   *                     example: 10.7626
   *                   lng:
   *                     type: number
   *                     example: 106.6822
   *               paymentMethod:
   *                 type: string
   *                 enum: [COD, BANK_TRANSFER]
   *     responses:
   *       200:
   *         description: Order info updated successfully
   *       400:
   *         description: Missing or invalid fields
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   */
  async updateOrderInfo(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.params;
      const { deliveryAddress, paymentMethod } = req.body;

      if (!deliveryAddress || typeof deliveryAddress.full !== 'string' || !deliveryAddress.full.trim()) {
        throw new ERR_RESPONSE.BadRequestError("Delivery address is missing", ERR.INVALID_INPUT);
      }

      // Allow lat/lng to be missing or 0. The service will geocode if coordinates are invalid.
      if (deliveryAddress.lat !== undefined && deliveryAddress.lat !== null) {
        const latNum = Number(deliveryAddress.lat);
        if (!Number.isFinite(latNum)) {
          throw new ERR_RESPONSE.BadRequestError("Invalid delivery address latitude", ERR.INVALID_INPUT);
        }
      }
      if (deliveryAddress.lng !== undefined && deliveryAddress.lng !== null) {
        const lngNum = Number(deliveryAddress.lng);
        if (!Number.isFinite(lngNum)) {
          throw new ERR_RESPONSE.BadRequestError("Invalid delivery address longitude", ERR.INVALID_INPUT);
        }
      }

      if (!paymentMethod || !["COD", "BANK_TRANSFER"].includes(paymentMethod)) {
        throw new ERR_RESPONSE.BadRequestError("Invalid payment method", ERR.INVALID_INPUT);
      }

      const order = await orderService.updateOrderInfo({
        userId, 
        orderId,
        deliveryAddress,
        paymentMethod,
      });

      return SUCCESS_RESPONSE.success(res, "Update Order Info successfully", { order });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new OrderController();