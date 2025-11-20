const paymentRepository = require('../repositories/payment.repository');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const restaurantService = require('./restaurant.service');
const orderService = require('./order.service');
const { orderStatusObject } = require('../constants/orderStatus');

class PaymentService {

  // được gọi từ bên restaurant khi confirm order
  async createPaymentCOD(order) {

    const payment = {
        orderId: order._id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        method: "COD",
        amount: order.totalFoodPrice + order.shippingFee - order.discountAmount,
        status: "success",        
      };

    const newPayment = await paymentRepository.create(payment);

    // update field in order
    order.paymentId = newPayment._id;

    await order.save();

    return newPayment;
  }

  async createPaymentBANK({ orderId, userId, status }) {
    // Khi status là BANK_TRANSFER thì tạo payment khi checkout order
    const order = await orderService.getOrder(userId, orderId);

    if (order.paymentMethod !== "BANK_TRANSFER") {
      throw new ERR_RESPONSE.BadRequestError('Only BANK_TRANSFER orders need payment record');
    }

    const payment = await paymentRepository.create({
      orderId,
      userId: order.userId,
      restaurantId: order.restaurantId,
      method: "BANK_TRANSFER",
      status: "pending",
      amount: order.totalFoodPrice + order.shippingFee - order.discountAmount,
    });

    return payment;

  }
   
    

  async getPaymentsByUserId(userId) {
    return await paymentRepository.find({ userId });
  }

  async getPaymentByOrderId(orderId) {
    return await paymentRepository.find({ orderId });
  }

  async getPaymentByPaymentId(paymentId) {
    return await paymentRepository.findById(paymentId);
  }

  // chỉ gọi khi method là BANK_TRANSFER
  async confirmPaymentBANK(paymentId, restaurantOwnerId) {
    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new ERR_RESPONSE.NotFoundError("Payment id not found", ERR.PAYMENT_NOT_FOUND);
    }

    const order = await orderService.getOrder(payment.orderId);

    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order of this Payment is not found", ERR.ORDER_NOT_FOUND);
    }

    await restaurantService.checkOwner(order.restaurantId, restaurantOwnerId);

    if (payment.method !== "BANK_TRANSFER") {
      throw new ERR_RESPONSE.BadRequestError("Only BANK_TRANSFER can be confirmed");
    }

    // update fields
    payment.status = "success";
    paymentId.paidAt = new Date();

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "pending";
    order.paymentId = payment._id;

    await order.save();
    await payment.save();

    return payment;
  }

  async failPayment(paymentId, userId) {
    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new ERR_RESPONSE.NotFoundError("Payment not found", ERR.PAYMENT_NOT_FOUND);
    }

    const order = await orderService.getOrderById(payment.orderId);

    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order not found", ERR.ORDER_NOT_FOUND);
    }

    // Only restaurant owner can fail
    await restaurantService.checkOwner(order.restaurantId, userId);

    // Only BANK_TRANSFER can fail
    if (payment.method !== "BANK_TRANSFER") {
      throw new ERR_RESPONSE.BadRequestError("COD payment cannot be failed");
    }

    // If payment is success, cant fail
    if (payment.status === 'success') {
      throw new ERR_RESPONSE.BadRequestError("Cannot fail a successful payment");
    }

    // Update payment
    payment.status = "failed";
    payment.paidAt = null;

    // Update order
    order.isPaid = false;
    order.paidAt = null;
    order.paymentId = null;
    order.status = "pending";

    await payment.save();
    await order.save();

    return payment;
  }
}


module.exports = new PaymentService();