const express = require('express');
const router = express.Router();
const RestaurantsController = require('../controllers/restaurant.controller.js');
const MenuItemController = require('../controllers/menuItem.controller.js');
const { optinalAuth, requireAuth } = require('../middlewares/auth.middleware');

router.get('/:restaurantId', optinalAuth, RestaurantsController.getInfo);
router.get('/:restaurantId/menu-items', optinalAuth, MenuItemController.getMenuItems);
router.post('/:restaurantId/menu-item', requireAuth, MenuItemController.createMenuItem);


module.exports = router;
