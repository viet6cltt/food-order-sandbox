const paymentService = require("@/services/payment.service");
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse'); 


class PaymentController {
  
  /**
   * @swagger
   * /payments:
   *   post:
   *     summary: Create a payment
   *     description: Create a new payment record for a BANK_TRANSFER order
   *     tags:
   *       - Payments
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *             properties:
   *               orderId:
   *                 type: string
   *                 description: Order ID to create payment for
   *                 example: 507f1f77bcf86cd799439016
   *     responses:
   *       200:
   *         description: Payment created successfully
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
   *                   example: Create Payment Successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     payment:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                           example: 507f1f77bcf86cd799439017
   *                         orderId:
   *                           type: string
   *                         userId:
   *                           type: string
   *                         restaurantId:
   *                           type: string
   *                         method:
   *                           type: string
   *                           enum: [COD, BANK_TRANSFER]
   *                           example: BANK_TRANSFER
   *                         amount:
   *                           type: number
   *                           example: 150000
   *                         status:
   *                           type: string
   *                           enum: [pending, success, failed]
   *                           example: pending
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing orderId or not BANK_TRANSFER order
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: Not found - Order not found
   */
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

  /**
   * @swagger
   * /payments/my:
   *   get:
   *     summary: Get user's payments
   *     description: Retrieve all payment records for the authenticated user
   *     tags:
   *       - Payments
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Payments retrieved successfully
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
   *                   example: Get your payments successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     payments:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           _id:
   *                             type: string
   *                           orderId:
   *                             type: string
   *                           method:
   *                             type: string
   *                             enum: [COD, BANK_TRANSFER]
   *                           amount:
   *                             type: number
   *                           status:
   *                             type: string
   *                             enum: [pending, success, failed]
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  async getMyPayments(req, res, next) {
    try {
      const userId = req.userId;
      
      const payments = await paymentService.getPaymentsByUserId(userId);

      return SUCCESS_RESPONSE.success(res, "Get your payments successfully", { payments });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /payments/orders/{orderId}:
   *   get:
   *     summary: Get payment by order ID
   *     description: Retrieve payment information for a specific order
   *     tags:
   *       - Payments
   *     parameters:
   *       - name: orderId
   *         in: path
   *         required: true
   *         description: Order ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439016
   *     responses:
   *       200:
   *         description: Payment retrieved successfully
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
   *                   example: Get Payment info by orderId successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     payment:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         orderId:
   *                           type: string
   *                         userId:
   *                           type: string
   *                         restaurantId:
   *                           type: string
   *                         method:
   *                           type: string
   *                           enum: [COD, BANK_TRANSFER]
   *                         amount:
   *                           type: number
   *                         status:
   *                           type: string
   *                           enum: [pending, success, failed]
   *                         paidAt:
   *                           type: string
   *                           format: date-time
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing order ID
   *       404:
   *         description: Not found - Payment or order not found
   */
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

  /**
   * @swagger
   * /payments/{paymentId}:
   *   get:
   *     summary: Get payment by payment ID
   *     description: Retrieve detailed payment information by payment ID
   *     tags:
   *       - Payments
   *     parameters:
   *       - name: paymentId
   *         in: path
   *         required: true
   *         description: Payment ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439017
   *     responses:
   *       200:
   *         description: Payment retrieved successfully
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
   *                   example: Get Payment info by paymentId successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     payment:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         orderId:
   *                           type: string
   *                         userId:
   *                           type: string
   *                         restaurantId:
   *                           type: string
   *                         method:
   *                           type: string
   *                           enum: [COD, BANK_TRANSFER]
   *                         amount:
   *                           type: number
   *                         status:
   *                           type: string
   *                           enum: [pending, success, failed]
   *                         paidAt:
   *                           type: string
   *                           format: date-time
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Missing payment ID
   *       404:
   *         description: Not found - Payment not found
   */
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

  /**
   * @swagger
   * /payments/{paymentId}/confirm:
   *   patch:
   *     summary: Confirm payment
   *     description: Confirm a pending BANK_TRANSFER payment (restaurant owner only)
   *     tags:
   *       - Payments
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: paymentId
   *         in: path
   *         required: true
   *         description: Payment ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439017
   *     responses:
   *       200:
   *         description: Payment confirmed successfully
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
   *                   example: Confirm Payment Successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     payment:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         status:
   *                           type: string
   *                           enum: [success]
   *                           example: success
   *                         paidAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Bad request - Not BANK_TRANSFER payment
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Not restaurant owner
   *       404:
   *         description: Not found - Payment or order not found
   */
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

  /**
   * @swagger
   * /payments/{paymentId}/fail:
   *   patch:
   *     summary: Mark payment as failed
   *     description: Mark a pending BANK_TRANSFER payment as failed (restaurant owner only)
   *     tags:
   *       - Payments
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: paymentId
   *         in: path
   *         required: true
   *         description: Payment ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439017
   *     responses:
   *       200:
   *         description: Payment marked as failed successfully
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
   *                   example: Payment marked as failed
   *                 data:
   *                   type: object
   *                   properties:
   *                     payment:
   *                       type: object
   *                       properties:
   *                         _id:
   *                           type: string
   *                         status:
   *                           type: string
   *                           enum: [failed]
   *                           example: failed
   *                         paidAt:
   *                           type: string
   *                           nullable: true
   *       400:
   *         description: Bad request - Payment already succeeded or COD payment
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Not restaurant owner
   *       404:
   *         description: Not found - Payment or order not found
   */
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