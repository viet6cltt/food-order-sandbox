const express = require('express');
const router = express.Router();

const RestaurantsController = require('@/controllers/app/restaurant.controller.js');
const reportController = require('@/controllers/app/report.controller');
const OrderController = require('@/controllers/app/order.controller.js');
const MenuItemController = require('@/controllers/app/menuItem.controller.js');
const revenueController = require('@/controllers/app/revenue.controller.js');

const { optionalAuth, requireAuth } = require('@/middlewares/auth.middleware.js');
const { checkUserStatus } = require('@/middlewares/userStatus.middleware.js');
const { requireRestaurantOwner, requireRestaurantOwnerOrAdmin } = require('@/middlewares/restaurantOwner.middleware.js');

const pagination = require('@/middlewares/pagination.middleware.js');
const upload = require('@/middlewares/upload.middleware.js');


/* =======================
   PUBLIC
======================= */
router.get('/', pagination(20, 50), RestaurantsController.getAll);
router.get('/search', pagination(20, 50), RestaurantsController.search);
router.get('/recommend', RestaurantsController.getRecommend);

/* =======================
   OPTIONAL AUTH
======================= */
router.use(optionalAuth);
router.get('/:restaurantId', RestaurantsController.getInfo);
router.get('/:restaurantId/menu-items', MenuItemController.getMenuItems);

/* =======================
   OWNER (AUTH + STATUS + OWNER)
======================= */
router.use(
  '/:restaurantId',
  requireAuth,
  checkUserStatus,
);

// report
router.post('/:restaurantId/report', reportController.sendReport);

// update
router.patch("/:restaurantId/banner", requireRestaurantOwner, upload.single("file"), RestaurantsController.uploadBanner);

// menu
router.post('/:restaurantId/menu-item', requireRestaurantOwner, upload.single('file'), MenuItemController.createMenuItem);

// order
router.get('/:restaurantId/orders', requireRestaurantOwnerOrAdmin, OrderController.getOrdersOfRestaurant);
router.get('/:restaurantId/orders/:orderId', requireRestaurantOwnerOrAdmin, OrderController.getOrderOfRestaurant);
router.patch("/:restaurantId/orders/:orderId/confirm", requireRestaurantOwner,OrderController.confirmOrderStatus);
router.patch("/:restaurantId/orders/:orderId/prepare", requireRestaurantOwner, OrderController.prepareOrderStatus);
router.patch("/:restaurantId/orders/:orderId/deliver", requireRestaurantOwner, OrderController.deliverOrderStatus);
router.patch("/:restaurantId/orders/:orderId/cancel", requireRestaurantOwner,OrderController.cancelOrderStatus);
router.patch('/:restaurantId/orders/:orderId/complete', requireRestaurantOwner, OrderController.completeOrderStatus);

// revenue
router.get('/:restaurantId/revenue/day', requireRestaurantOwnerOrAdmin, revenueController.getDayRevenue);
router.get('/:restaurantId/revenue/week', requireRestaurantOwnerOrAdmin, revenueController.getWeekRevenue);
router.get('/:restaurantId/revenue/total', requireRestaurantOwnerOrAdmin, revenueController.getTotal);





module.exports = router;
