const express = require('express');
const router = express.Router();
const MenuItemController = require('../controllers/menuItem.controller');

const { optionalAuth, requireAuth } = require('../middlewares/auth.middleware');

// [GET] /api/menu-items/:menuItemId - Get menu item by ID (public, optional auth)
router.get('/:menuItemId', optionalAuth, MenuItemController.getMenuItemInfo);

// [PUT] /api/menu-items/:menuItemId - Update menu item (requires auth)
router.put('/:menuItemId', requireAuth, MenuItemController.updateMenuItem);

// [DELETE] /api/menu-items/:menuItemId - Delete menu item (requires auth)
router.delete('/:menuItemId', requireAuth, MenuItemController.deleteMenuItem);

module.exports = router;
