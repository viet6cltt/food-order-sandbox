const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.get('/', AuthController.index);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshAccessToken);
router.post('/logout', AuthController.logout);

// gửi email xác minh đến người dùng
router.post('/verification-email', authMiddleware, AuthController.sendEmailVerification);
// xác nhận email khi người dùng click vào link trong email
router.get('/verify-email', AuthController.verifyEmailToken);

// gửi token đến email đã verify
router.post('/password-reset-request', AuthController.sendPasswordResetRequest);
// cập nhật mật khẩu mới 
router.post('/password-reset', AuthController.resetPassword);

/** Oauth */
router.get('/oauth-url', AuthController.getOauthUrl);
router.get('/:provider/callback', AuthController.oauthCallback);

router.post('/complete-profile', AuthController.completeProfile);
module.exports = router;