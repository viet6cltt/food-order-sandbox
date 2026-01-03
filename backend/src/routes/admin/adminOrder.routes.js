const router = require('express').Router();
const adminOrderController = require('@/controllers/admin/adminOrder.controller');

const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin } = require('@/middlewares/role.middleware');

router.use(requireAuth, requireAdmin);

// for dashboard
router.get('/statistics', adminOrderController.getOrderTrends);

// for statistics
// router.get('/statistics', adminOrderController.getOrderStatistics);

router.get('/categories/top', adminOrderController.getTopCategoriesStats);

module.exports = router;