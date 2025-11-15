const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');

const MenuItemService = require('../services/menuItem.service');

class MenuItemController {
  // [GET] /restaurants/:restaurantId/menu-items
  async getMenuItems(req, res, next) {
    try {
      const { restaurantId } = req.params;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const menuItems = await MenuItemService.getMenuItems(restaurantId);

      return SUCCESS_RESPONSE.success(res, 'Get menu items by restaurantId successfully', { menuItems } );
    } catch (err) {
      next(err);
    }
  }

  // [GET] /:menuItemId
  async getMenuItemInfo(req, res, next) {
    try {
      const { menuItemId } = req.params;
      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.getMenuItemInfo(menuItemId);

      return SUCCESS_RESPONSE.success(res, 'Get menu item successfully', { menuItem } );
    } catch (err) {
      next(err);
    }
  }

  // [POST] /restaurants/:restaurantId/menu-item
  async createMenuItem(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const userId = req.userId;

      const data = req.body;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.createMenuItem(restaurantId, userId, data);

      return SUCCESS_RESPONSE.success(res, 'Create new Menu Item successfully', { menuItem });
    } catch (err) {
      next(err);
    }
  }

  // [PUT] /:menuItemId
  async updateMenuItem(req, res, next) {
    try {
      const { menuItemId } = req.params;
      const data = req.body;
      const userId = req.userId;
      

      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      const menuItem = await MenuItemService.updateMenuItem(menuItemId, userId, data);

      return SUCCESS_RESPONSE.success(res, 'Update menu item successfully', { menuItem } );
    } catch (err) {
      next(err);
    }
  }
  
  // [DELETE] /:menuItemId
  async deleteMenuItem(req, res, next) {
    try {
      const { menuItemId } = req.params;
      const userId = req.userId;
      
      if (!menuItemId) {
        throw new ERR_RESPONSE.BadRequestError('Missing menuItemId', ERR.INVALID_INPUT);
      }

      await MenuItemService.deleteMenuItem(menuItemId, userId);

      return SUCCESS_RESPONSE.success(res, 'Delete menu item successfully' );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MenuItemController();