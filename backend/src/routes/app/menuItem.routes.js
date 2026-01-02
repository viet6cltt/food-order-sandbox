const express = require('express');
const router = express.Router();
const MenuItemController = require('@/controllers/app/menuItem.controller');

const { optionalAuth, requireAuth } = require('@/middlewares/auth.middleware');
const reviewController = require('@/controllers/app/review.controller');
const { checkUserStatus } = require('@/middlewares/userStatus.middleware');

// [GET] /api/menu-items/:menuItemId - Get menu item by ID (public, optional auth)
router.get('/:menuItemId', optionalAuth, MenuItemController.getMenuItemInfo);

// [GET] /api/menu-items/:menuItemId/reviews
router.get("/:menuItemId/reviews", optionalAuth, reviewController.getByMenuItem);

// --- THAO TÁC THAY ĐỔI DỮ LIỆU
router.use(requireAuth);
router.use(checkUserStatus);
// [PUT] /api/menu-items/:menuItemId - Update menu item (requires auth)
router.put('/:menuItemId', MenuItemController.updateMenuItem);

// [DELETE] /api/menu-items/:menuItemId - Delete menu item (requires auth)
router.delete('/:menuItemId', MenuItemController.deleteMenuItem);

module.exports = router;
