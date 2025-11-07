const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const { requireAuth } = require('../middlewares/auth.middleware.js');

router.get('/', UserController.index);
router.get('/me', requireAuth, UserController.getMe);
router.get('/:userId', UserController.getUser);
// router.put('/me', requireAuth, UserController.updateMe);

module.exports = router;