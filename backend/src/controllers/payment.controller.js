const paymentService = require("../services/payment.service");
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse'); 


class PaymentController {
  
  // [POST] /
  async createPayment(req, res, next) {
    try {
      const userId = req.userId;
      const { orderId } = req.body;

      if (!orderId) {
        throw new ERR_RESPONSE.BadRequestError("Order Id is missing", ERR.INVALID_INPUT);
      }

      const payment = await paymentService.createPaymentBANK(
        {
          orderId,
          userId,
          status: "BANK_TRANSFER",
        }
      );

      return SUCCESS_RESPONSE.success(res, "Create Payment Successfully", { payment });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /my
  async getMyPayments(req, res, next) {
    try {
      const userId = req.userId;
      
      const payments = await paymentService.getPaymentsByUserId(userId);

      return SUCCESS_RESPONSE.success(res, "Get your payments successfully", { payments });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /order/:orderId
  async getPaymentByOrder(req, res, next) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        throw new ERR_RESPONSE.BadRequestError("Order Id is missing", ERR.INVALID_INPUT);
      } 
      const payment = await paymentService.getPaymentByOrderId(orderId);

      return SUCCESS_RESPONSE.success(res, "Get Payment info by orderId successfully", { payment });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /:paymentId
  async getPaymentByPaymentId(req, res, next) {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        throw new ERR_RESPONSE.BadRequestError("Payment Id is missing", ERR.INVALID_INPUT);
      } 

      const payment = await paymentService.getPaymentByPaymentId(paymentId);

      return SUCCESS_RESPONSE.success(res, "Get Payment info by paymentId successfully", { payment });
    } catch (err) {
      next(err);
    }
  }

  // [PATCH] /:paymentId/confirm 
  async confirmPayment(req, res, next) {
    try {
      const userId = req.userId;
      const { paymentId } = req.params;
      
      const payment = await paymentService.confirmPaymentBANK(paymentId, userId);
      return SUCCESS_RESPONSE.success(res, "Confirm Payment Successfully", { payment });
    } catch (err) {
      next(err);
    }
  }

  // [PATCH] /:paymentId/fail
  async failPayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const userId = req.userId;

      const payment = await paymentService.failPayment(paymentId, userId);

      return SUCCESS_RESPONSE.success(
        res,
        "Payment marked as failed",
        { payment },
      )
    } catch (err) {
      next(err);
    }
  }
} 

module.exports = new PaymentController();