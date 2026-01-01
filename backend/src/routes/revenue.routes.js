const router = require('express').Router();
const revenueController = require('../controllers/revenue.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get("/:restaurantId/day", requireAuth, revenueController.getDayRevenue);
router.get("/:restaurantId/week", requireAuth, revenueController.getWeekRevenue);
router.get("/:restaurantId/total", requireAuth, revenueController.getTotal);

module.exports = router;