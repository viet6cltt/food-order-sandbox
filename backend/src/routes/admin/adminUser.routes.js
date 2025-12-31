const express = require('express');

const router = express.Router();

const adminUserController = require('../../controllers/admin/adminUser.controller');

const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');

// manage users 
router.use(requireAuth, requireAdmin);

router.get('/', adminUserController.listUsers); // view all users

router.patch('/:userId/block', adminUserController.blockUser); // block user account
 
router.patch('/:userId/block', adminUserController.unlockUser); // unlock user account

router.get('/:userId', adminUserController.getUserDetail); // view detail user

module.exports = router;