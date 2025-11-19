const MenuItemRepository = require('../repositories/menuItem.repository');
const RestaurantService = require('./restaurant.service');
const ERR_RESPONSE = require('../utils/httpErrors.js');
const ERR = require('../constants/errorCodes');

class MenuItemService {
  // get menu items by restaurantId
  async getMenuItems(restaurantId) {
    return await MenuItemRepository.getByRestaurant(restaurantId);
  }

  // get menu item info 
  async getMenuItemInfo(menuItemId) {
    return await MenuItemRepository.getById(menuItemId);
  }

  // create menu item
  async createMenuItem(restaurantId, userId, data) {
    // Validate restaurant
    const restaurant = await RestaurantService.getRestaurantInfo(restaurantId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError('Restaurant not found', ERR.RESTAURANT_NOT_FOUND);
    }

    // Permission check
    if (restaurant.ownerId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError('You are not allowed to create menu items for this restaurant', ERR.RESTAURANT_UNAUTHORIZED_ACTION);
    }

    // Create
    const newItem = await MenuItemRepository.create({
      ...data,
      restaurantId
    });

    return newItem;
  }

  async updateMenuItem(menuItemId, userId, data) {
    // Validate restaurant
    const restaurant = await RestaurantService.getRestaurantInfo(menuItemId.restaurantId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError('Restaurant not found', ERR.RESTAURANT_NOT_FOUND);
    }

    // Permission check
    if (restaurant.ownerId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError('You are not allowed to update this menu item', ERR.RESTAURANT_UNAUTHORIZED_ACTION);
    }

    // update
    const updatedItem = await MenuItemRepository.updateById(menuItemId, data);

    return updatedItem;
  }

  async deleteMenuItem(menuItemId, userId) {
    const menuItem = await MenuItemRepository.getById(menuItemId);
    if (!menuItem) {
      throw new ERR_RESPONSE.NotFoundError(
        'Menu item not found',
        ERR.MENUITEM_NOT_FOUND
      );
    }
    // Validate restaurant
    const restaurant = await RestaurantService.getRestaurantInfo(menuItem.restaurantId);
    console.log(menuItemId.restaurantId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError('Restaurant not found', ERR.RESTAURANT_NOT_FOUND);
    }

    // Permission check
    if (restaurant.ownerId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError('You are not allowed to delete this menu item', ERR.RESTAURANT_UNAUTHORIZED_ACTION);
    }

    // delete
    await MenuItemRepository.deleteById(menuItemId);

    return true;
  }

  async checkAvailable(menuItemId) {
    const menuItem = await MenuItemRepository.getById(menuItemId);
    if (!menuItem) {
      throw new ERR_RESPONSE.NotFoundError("Menu Item is not found", ERR.MENUITEM_NOT_FOUND);
    }

    return menuItem.isAvailable;
  }
}

module.exports = new MenuItemService();