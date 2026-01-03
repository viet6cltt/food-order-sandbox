const express = require('express');
const router = express.Router();
const UserController = require('@/controllers/app/user.controller.js');
const restaurantRequestController = require("@/controllers/app/restaurantRequest.controller.js");
const RestaurantController = require('@/controllers/app/restaurant.controller.js');
const upload = require('@/middlewares/upload.middleware.js');

const { requireAuth } = require('@/middlewares/auth.middleware.js');
const { checkUserStatus } = require('@/middlewares/userStatus.middleware.js');
const reportController = require('@/controllers/app/report.controller.js');

router.get('/', UserController.index);
router.get('/me', requireAuth, UserController.getMe); // dùng khi người dùng lấy thông tin của chính bản thân
router.get('/:userId', UserController.getUser); // dùng khi admin lấy thông tin người khác
router.put('/me', requireAuth, UserController.updateMe); // dùng khi người dùng muốn thay đổi thông tin bản thân

// dùng để report người dùng
router.post('/:userId', requireAuth, checkUserStatus, reportController.sendReport);

// request restaurant
router.get("/restaurant-requests/me", requireAuth, restaurantRequestController.getMyRequest);
router.post("/restaurant-requests", requireAuth, upload.single('file'), restaurantRequestController.submit);

// owner restaurant
router.get("/owner/restaurant", requireAuth, RestaurantController.getMyRestaurant);
router.patch("/owner/restaurant", requireAuth, RestaurantController.updateMyRestaurant);
router.patch('/owner/restaurant/payment-qr', requireAuth, upload.single('file'), RestaurantController.uploadMyPaymentQr);

module.exports = router;