const MenuItem = require('../models/MenuItem');

class MenuItemRepository {
  /** Create a new menu item */
  async create (data) {
    return await MenuItem.create(data);
  }

  /** Get menu item by id */
  async getById(id) {
    return await MenuItem.findById(id);
  }

  /** Get all menu items of a restaurant */
  async getByRestaurant(restaurantId, { limit = 50, skip = 0 } = {}) {
    return await MenuItem.find({ restaurantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /** Update menu item */
  async updateById(id, data) {
    return await MenuItem.findByIdAndUpdate(id, data, {
      new: true
    });
  }

  /** Delete menu item */
  async deleteById(id) {
    return await MenuItem.findByIdAndDelete(id);
  }

  /** Increase totalBuy (when order placed) */
  async increaseTotalBuy(menuItemId, qty) {
    return await MenuItem.findByIdAndUpdate(
      menuItemId,
      { $inc: { totalBuy: qty } },
      { new: true }
    );
  }

  /** Toggle isAvailable */
  async setAvailability(menuItemId, isAvailable) {
    return await MenuItem.findByIdAndUpdate(
      menuItemId,
      { isAvailable },
      { new: true }
    );
  }
}

module.exports = new MenuItemRepository();