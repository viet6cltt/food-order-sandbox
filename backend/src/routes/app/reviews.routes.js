const router = require('express').Router();
const reviewController = require("@/controllers/app/review.controller");
const reviewReportController = require("@/controllers/app/reviewReport.controller");

const { requireAuth } = require('@/middlewares/auth.middleware');

router.post("/", requireAuth, reviewController.create);
router.get("/:reviewId", reviewController.getDetail);

// User report bad review
router.post("/:reviewId/report", requireAuth, reviewReportController.create);

module.exports = router;