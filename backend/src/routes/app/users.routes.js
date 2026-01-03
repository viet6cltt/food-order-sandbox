const express = require('express');
const router = express.Router();
const UserController = require('@/controllers/app/user.controller.js');
const restaurantRequestController = require("@/controllers/app/restaurantRequest.controller.js");
const restaurantController = require('@/controllers/app/restaurant.controller');
const { requireAuth } = require('@/middlewares/auth.middleware.js');
const { checkUserStatus } = require('@/middlewares/userStatus.middleware.js');
const upload = require('@/middlewares/upload.middleware');
const { requireRestaurantOwnerRole } = require('@/middlewares/role.middleware');
const { requireRestaurantOwner } = require('@/middlewares/restaurantOwner.middleware');

const reportController = require('@/controllers/app/report.controller.js');

router.get('/', UserController.index);
router.get('/me', requireAuth, UserController.getMe); // dùng khi người dùng lấy thông tin của chính bản thân
router.put('/me', requireAuth, UserController.updateMe); // dùng khi người dùng muốn thay đổi thông tin bản thân

// request restaurant - định nghĩa trước route /:userId để tránh bị match sai
router.post("/restaurant-requests",requireAuth, upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]) ,restaurantRequestController.submit);

router.get("/restaurant-requests/me", requireAuth, restaurantRequestController.getMyRequest);

// get restaurant
router.get("/me/restaurants", requireAuth, requireRestaurantOwnerRole, restaurantController.getMyRestaurants);
router.get("/me/restaurants/:restaurantId", requireAuth, restaurantController.getInfo);
router.patch("/me/restaurants/:restaurantId", requireAuth, requireRestaurantOwner, restaurantController.updateMyRestaurant);
router.patch('/me/restaurant/:restaurantId/payment-qr', requireAuth, requireRestaurantOwner, upload.single('file'), restaurantController.uploadMyPaymentQr);

router.get('/:userId', UserController.getUser); // dùng khi admin lấy thông tin người khác

// dùng để report người dùng
router.post('/:userId', requireAuth, checkUserStatus, reportController.sendReport);

module.exports = router;