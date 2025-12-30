const router = require('express').Router();
const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin} = require('@/middlewares/admin.middleware');

const adminReviewReportController = require("../controllers/admin/adminReviewReport.controller");

router.use(requireAuth, requireAdmin);

router.get('/review-reports', adminReviewReportController.getAllReports);
router.patch('/review-reports/:reportId', adminReviewReportController.handleReport);

module.exports = router;