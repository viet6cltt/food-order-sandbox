const router = require('express').Router();
const adminOrderController = require('@/controllers/admin/adminOrder.controller');

const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin } = require('@/middlewares/role.middleware');

router.use(requireAuth, requireAdmin);

// for dashboard
router.get('/dashboard-stats', adminOrderController.getDashboardStats);

// for statistics
router.get('/statistics', adminOrderController.getOrderStatistics);

module.exports = router;