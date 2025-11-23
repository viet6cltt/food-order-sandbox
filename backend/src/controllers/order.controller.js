const orderService = require("../services/order.service");
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse'); 
const { orderStatusObject } = require('../constants/orderStatus');

class OrderController {
  // [GET] /
  async getOrdersOfUser(req, res, next) {
    try {
      const userId = req.userId;

      const orders = await orderService.getOrdersOfUser(userId);

      return SUCCESS_RESPONSE.success(res, "Get Orders Successfully", { orders });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /:orderId
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

  // [POST] /:orderId/cancel
  async cancelOrder(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.params;

      if (!orderId) {
        throw new ERR_RESPONSE.BadRequestError("OrderId is missing", ERR.INVALID_INPUT);
      }

      const order = await orderService.cancelOrder(userId, orderId);
      return SUCCESS_RESPONSE.success(req, "Cancel Order Successfully", { order });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /restaurants/:restaurantId/orders
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

  // [GET] /restaurants/:restaurantId/orders/:orderId
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

  // [PATCH] /restaurants/:restaurantId/orders/:orderId/confirm
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

  // [PATCH] /restaurants/:restaurantId/orders/:orderId/prepare
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

  // [PATCH] /restaurants/:restaurantId/orders/:orderId/deliver
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

  // [PATCH] /restaurants/:restaurantId/orders/:orderId/cancel
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

  // [PATCH] /restaurants
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

  // [PATCH] /:orderId
  async updateOrderInfo(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.params;
      const { deliveryAddress, paymentMethod } = req.body;

      if (!deliveryAddress || !deliveryAddress.full || !deliveryAddress.lat || !deliveryAddress.lng) {
        throw new ERR_RESPONSE.BadRequestError("Delivery address is missing", ERR.INVALID_INPUT);
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