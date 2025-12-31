const router = require('express').Router();
const { requireAuth } = require('@/middlewares/auth.middleware');
const { requireAdmin} = require('@/middlewares/admin.middleware');
const adminReviewController = require('@/controllers/admin/adminReview.controller');

router.use(requireAuth, requireAdmin);

router.get('/reviews', adminReviewController.getAllReviews);
router.patch("/reviews/:reviewId/hide", adminReviewController.hideReview);
router.delete("/reviews/:reviewId", adminReviewController.deleteReview);

module.exports = router;