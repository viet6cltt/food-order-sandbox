const router = require('express').Router();

router.use('/', require('./restaurant.routes'));
router.use('/:restaurantId/reviews', require('./restaurantReview.routes'));

module.exports = router;