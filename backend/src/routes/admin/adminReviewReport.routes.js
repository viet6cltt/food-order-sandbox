const router = require('express').Router();
const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin} = require('@/middlewares/admin.middleware');

const adminReviewReportController = require("@/controllers/admin/adminReviewReport.controller");
const pagination = require('@/middlewares/pagination.middleware');

router.use(requireAuth, requireAdmin);

router.get('/', pagination(20, 50), adminReviewReportController.getAllReports);
router.patch('/:reportId', adminReviewReportController.handleReport);

module.exports = router;