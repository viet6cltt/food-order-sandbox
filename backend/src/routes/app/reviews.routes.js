const router = require('express').Router();
const reviewController = require("@/controllers/app/review.controller");

const { requireAuth } = require('@/middlewares/auth.middleware');

router.post("/", requireAuth, reviewController.create);
router.get("/:reviewId", reviewController.getDetail);

// User report bad review
router.post("/:reviewId/report", requireAuth);

module.exports = router;