const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const { requireAuth } = require('../middlewares/auth.middleware.js');

router.get('/', UserController.index);
router.get('/me', requireAuth, UserController.getMe); // dùng khi người dùng lấy thông tin của chính bản thân
router.get('/:userId', UserController.getUser); // dùng khi admin lấy thông tin người khác
router.put('/me', requireAuth, UserController.updateMe); // dùng khi người dùng muốn thay đổi thông tin bản thân

module.exports = router;