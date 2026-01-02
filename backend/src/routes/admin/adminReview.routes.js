const router = require('express').Router();
const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin } = require('@/middlewares/role.middleware');
const adminReviewController = require('@/controllers/admin/adminReview.controller');

router.use(requireAuth, requireAdmin);

router.patch("/reviews/:reviewId/hide", adminReviewController.hideReview);
router.delete("/reviews/:reviewId", adminReviewController.deleteReview);

module.exports = router;