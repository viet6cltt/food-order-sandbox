const express = require('express')
const router = express.Router()
const RestaurantController = require('../controllers/restaurant.controller')

// GET /api/restaurants
router.get('/', (req, res, next) => RestaurantController.list(req, res, next))

module.exports = router
