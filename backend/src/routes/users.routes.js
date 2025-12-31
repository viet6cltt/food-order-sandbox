const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const restaurantRequestController = require("../controllers/restaurantRequest.controller.js");
const RestaurantController = require('../controllers/restaurant.controller.js');
const upload = require('../middlewares/upload.middleware.js');

const { requireAuth } = require('../middlewares/auth.middleware.js');

router.get('/', UserController.index);
router.get('/me', requireAuth, UserController.getMe); // dùng khi người dùng lấy thông tin của chính bản thân
router.get('/:userId', UserController.getUser); // dùng khi admin lấy thông tin người khác
router.put('/me', requireAuth, UserController.updateMe); // dùng khi người dùng muốn thay đổi thông tin bản thân


// request restaurant
router.get("/restaurant-requests/me", requireAuth, restaurantRequestController.getMyRequest);
router.post("/restaurant-requests",requireAuth, restaurantRequestController.submit);

// owner restaurant
router.get("/owner/restaurant", requireAuth, RestaurantController.getMyRestaurant);
router.patch("/owner/restaurant", requireAuth, RestaurantController.updateMyRestaurant);
router.patch('/owner/restaurant/payment-qr', requireAuth, upload.single('file'), RestaurantController.uploadMyPaymentQr);

module.exports = router;