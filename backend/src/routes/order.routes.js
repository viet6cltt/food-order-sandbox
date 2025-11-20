const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// For user
router.patch('/:orderId', requireAuth, orderController.updateOrderInfo);
router.get('/', requireAuth, orderController.getOrdersOfUser);
router.get('/:orderId', requireAuth, orderController.getOrder);
router.post('/:orderId/cancel', requireAuth, orderController.cancelOrder); // hủy đơn hàng


module.exports = router;