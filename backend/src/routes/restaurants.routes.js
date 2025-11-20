const express = require('express');
const router = express.Router();
const RestaurantsController = require('../controllers/restaurant.controller.js');
const OrderController = require('../controllers/order.controller.js');
const MenuItemController = require('../controllers/menuItem.controller.js');
const { optinalAuth, requireAuth } = require('../middlewares/auth.middleware');

router.get('/:restaurantId', optinalAuth, RestaurantsController.getInfo);
router.get('/:restaurantId/menu-items', optinalAuth, MenuItemController.getMenuItems);
router.post('/:restaurantId/menu-item', requireAuth, MenuItemController.createMenuItem);

// order
router.get('/:restaurantId/orders', requireAuth, OrderController.getOrdersOfRestaurant); // get all orders of a restaurant
router.get('/:restaurantId/orders/:orderId', requireAuth, OrderController.getOrderOfRestaurant);
router.patch("/:restaurantId/orders/:orderId/confirm", requireAuth, OrderController.confirmOrderStatus);
router.patch("/:restaurantId/orders/:orderId/prepare", requireAuth, OrderController.prepareOrderStatus);
router.patch("/:restaurantId/orders/:orderId/deliver", requireAuth, OrderController.deliverOrderStatus);
router.patch("/:restaurantId/orders/:orderId/cancel", requireAuth, OrderController.cancelOrderStatus);

router.patch('/:restaurantId/orders/:orderId/complete', requireAuth, OrderController.completeOrderStatus);


module.exports = router;
