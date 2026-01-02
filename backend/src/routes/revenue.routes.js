const router = require('express').Router();
const revenueController = require('../controllers/revenue.controller');

router.get("/:restaurantId/day", revenueController.getDayRevenue);
router.get("/:restaurantId/week", revenueController.getWeekRevenue);
router.get("/:restaurantId/total", revenueController.getTotal);

module.exports = router;