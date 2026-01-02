const router = require('express').Router();
const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin } = require('@/middlewares/role.middleware');

const adminReportController = require("@/controllers/admin/adminReviewReport.controller");
const pagination = require('@/middlewares/pagination.middleware');

router.use(requireAuth, requireAdmin);

// Lấy danh sách báo cáo (?targetType=RESTAURANT&status=PENDING)
router.get('/', pagination(10, 50), adminReportController.getAllReports);

// Lấy chi tiết 1 báo cáo (để xem description và thông tin của đối tượng bị báo cáo)
router.get('/:reportId', adminReportController.getReportDetail);

// Handle report
router.patch('/:reportId/handle', adminReportController.resolveReport);

module.exports = router;