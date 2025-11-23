const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// For user
router.post('/', requireAuth, paymentController.createPayment); // chỉ gọi khi method là BANK_TRANSFER
router.get('/my', requireAuth, paymentController.getMyPayments);
router.get('/order/:orderId', paymentController.getPaymentByOrder);
router.get('/:paymentId', paymentController.getPaymentByPaymentId);

// For Restaurant
router.patch('/:paymentId/fail', requireAuth, paymentController.failPayment);
router.patch('/:paymentId/confirm', requireAuth, paymentController.confirmPayment); // chỉ gọi khi method là BANK_TRANSFER


module.exports = router;