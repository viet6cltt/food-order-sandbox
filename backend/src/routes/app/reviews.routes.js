const router = require('express').Router();
const reviewController = require("@/controllers/app/review.controller");
const reviewReportController = require("@/controllers/app/report.controller");

const { requireAuth } = require('@/middlewares/auth.middleware');
const upload = require('@/middlewares/upload.middleware');

router.post("/", requireAuth, upload.array('reviewImages', 5), reviewController.create);

// user report bad review
router.post("/:reviewId/report", requireAuth, reviewReportController.sendReport);

module.exports = router;