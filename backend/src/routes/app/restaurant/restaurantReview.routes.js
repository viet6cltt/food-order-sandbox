const router = require('express').Router();
const reviewController = require("../../../controllers/app/review.controller");

const { pagination } = require("@/middlewares/pagination.middleware");

router.get("/", pagination);

module.exports = router;