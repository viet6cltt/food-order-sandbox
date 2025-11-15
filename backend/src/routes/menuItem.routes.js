const express = require('express');
const router = express.Router();
const MenuItemController = require('../controllers/menuItem.controller');

const { optinalAuth, requireAuth } = require('../middlewares/auth.middleware');
router.put('/:menuItemId', requireAuth, MenuItemController.updateMenuItem);
router.delete('/:menuItemId', requireAuth, MenuItemController.deleteMenuItem);

module.exports = router;
