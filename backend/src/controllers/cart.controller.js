const CartService = require("../services/cart.service");
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse'); 

class CartController {
  // [GET] /
  async getCart(req, res, next) {
    try {
      const userId = req.userId;

      const cart = await CartService.getCart(userId);
      return SUCCESS_RESPONSE.success(res, 'Get cart info successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /items
  async addItem(req, res, next) {
    try {
      const userId = req.userId;
      const restaurantId = req.body.restaurantId;
      const itemData = req.body;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError('Missing restaurantId', ERR.INVALID_INPUT);
      }

      const cart = await CartService.addItem(userId, restaurantId, itemData);

      return SUCCESS_RESPONSE.success(res, 'post cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  // [PUT] /items/:itemId
  async updateItem(req, res, next) {
    try {
      const userId = req.userId;
      const { itemId } = req.params;
      const updateData = req.body;

      const cart = await CartService.updateItem(userId, itemId, updateData);
      return SUCCESS_RESPONSE.success(res, 'Update cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  // [DELETE] /items/:itemId
  async deleteItem(req, res, next) {
    try {
      const userId = req.userId;
      const { itemId } = req.params;

      const cart = await CartService.deleteItem(userId, itemId);
      return SUCCESS_RESPONSE.success(res, 'Delete cart item successfully', { cart });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /checkout
  async checkout(req, res, next) {
    try {
      const userId = req.userId;
      
      const order = await CartService.checkout(userId);

      return SUCCESS_RESPONSE.success(res, 'Check out successfully', { order });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();

