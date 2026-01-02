const express = require('express');
const router = express.Router();
const RestaurantsController = require('../controllers/restaurant.controller.js');
const OrderController = require('../controllers/order.controller.js');
const MenuItemController = require('../controllers/menuItem.controller.js');
const revenueController = require('../controllers/revenue.controller');
const { optionalAuth, requireAuth } = require('../middlewares/auth.middleware');
const pagination = require('@/middlewares/pagination.middleware.js');
const upload = require('@/middlewares/upload.middleware.js');

router.get('/', pagination(20, 50), RestaurantsController.getAll);
router.get('/search', pagination(20, 50), RestaurantsController.search);
router.get('/recommend', RestaurantsController.getRecommend);
router.get('/:restaurantId', optionalAuth, RestaurantsController.getInfo);
router.get('/:restaurantId/menu-items', optionalAuth, MenuItemController.getMenuItems);
router.post('/:restaurantId/menu-item', requireAuth, MenuItemController.createMenuItem);

// update
router.patch("/:restaurantId/banner", upload.single("file"), RestaurantsController.uploadBanner);

// order
router.get('/:restaurantId/orders', requireAuth, OrderController.getOrdersOfRestaurant); // get all orders of a restaurant
router.get('/:restaurantId/orders/:orderId', requireAuth, OrderController.getOrderOfRestaurant);
router.patch("/:restaurantId/orders/:orderId/confirm", requireAuth, OrderController.confirmOrderStatus);
router.patch("/:restaurantId/orders/:orderId/prepare", requireAuth, OrderController.prepareOrderStatus);
router.patch("/:restaurantId/orders/:orderId/deliver", requireAuth, OrderController.deliverOrderStatus);
router.patch("/:restaurantId/orders/:orderId/cancel", requireAuth, OrderController.cancelOrderStatus);

router.patch('/:restaurantId/orders/:orderId/complete', requireAuth, OrderController.completeOrderStatus);

// revenue
router.get('/:restaurantId/revenue/day', revenueController.getDayRevenue);
router.get('/:restaurantId/revenue/week', revenueController.getWeekRevenue);
router.get('/:restaurantId/revenue/total', revenueController.getTotal);


module.exports = router;
