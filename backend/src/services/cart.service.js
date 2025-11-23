const CartRepository = require('../repositories/cart.repository');
const ERR_RESPONSE = require('../utils/httpErrors.js');
const ERR = require('../constants/errorCodes');
const cartRepository = require('../repositories/cart.repository');

const orderService = require('./order.service.js');
const menuItemService = require('./menuItem.service.js');

class CartService {
  /** get Cart Info */
  async getCart(userId) {
    return await CartRepository.findByUserId(userId);
  }

  /** Add item to cart */
  async addItem(userId, restaurantId, itemData) {
    let cart = await CartRepository.findByUserId(userId);

    // Nếu cart tồn tại nhưng restaurant thay đổi -> clear cart cũ
    if (cart && cart.restaurantId.toString() !== restaurantId) {
      await CartRepository.deleteByUserId(userId);
      cart = null;
    }

    // Cart chưa tồn tại -> tạo mới
    if (!cart) {
      cart = await CartRepository.create({
        userId,
        restaurantId,
        item: [],
        totalItems: 0,
        totalPrice: 0
      });
    }

    const normalize = (opts) => JSON.stringify([...opts].sort((a, b) => a.groupName.localeCompare(b.groupName)));

    const newItemKey = normalize(itemData.selectedOptions || []);

    // check
    let existingItem = cart.items.find(
      (item) => 
        item.menuItemId.toString() === itemData.menuItemId &&
        normalize(item.selectedOptions) === newItemKey
    );
    
    if (existingItem) {
      existingItem.qty += itemData.qty;
      existingItem.finalPrice = existingItem.qty * (existingItem.basePrice + this._calcOptionPrice(existingItem.selectedOptions));
    } else {
      const totalExtras = this._calcOptionPrice(itemData.selectedOptions);

      cart.items.push({
        menuItemId: itemData.menuItemId,
        name: itemData.name,
        imageUrl: itemData.imageUrl || null,
        basePrice: itemData.basePrice,
        qty: itemData.qty,
        selectedOptions: itemData.selectedOptions || [],
        finalPrice: (itemData.basePrice + totalExtras) * itemData.qty,
      });
    }

    this._recalculate(cart);

    return await CartRepository.save(cart);
  }

  // PUT cart (update qty hay replace options)
  async updateItem(userId, itemId, updateData) {
    let cart = await CartRepository.findByUserId(userId);
    if (!cart) {
      throw new ERR_RESPONSE.NotFoundError('Cart is not exists', ERR.CART_NOT_FOUND);
    }

    const item = cart.items.id(itemId);
    if (!item) throw new ERR_RESPONSE.NotFoundError('Cart Item is not exists', ERR.CART_ITEM_NOT_FOUND);

    // Update quantity
    if (updateData.qty !== undefined) {
      item.qty = updateData.qty;
    }

    // Update selected options if provided
    if (updateData.selectedOptions) {
      item.selectedOptions = updateData.selectedOptions;
    }

    // Recalculate finalPrice
    const extras = this._calcOptionPrice(item.selectedOptions);
    item.finalPrice = (item.basePrice + extras) * item.qty;

    this._recalculate(cart);

    return await CartRepository.save(cart);
  }

  async deleteItem(userId, itemId) {
    const cart = await CartRepository.findByUserId(userId);
    if (!cart) {
      throw new ERR_RESPONSE.NotFoundError('Cart is not exists', ERR.CART_NOT_FOUND);
    }

    const item = cart.items.id(itemId);
    if (!item) throw new ERR_RESPONSE.NotFoundError('Cart Item is not exists', ERR.CART_ITEM_NOT_FOUND);

    const newCart = await CartRepository.deleteItem(cart._id, item._id);

    return newCart;
  }

  async checkout(userId) {
    const cart = await CartRepository.findByUserId(userId);

    if (!cart) {
      throw new ERR_RESPONSE.NotFoundError('Cart is not exists', ERR.CART_NOT_FOUND);
    }

    if (!cart.items || cart.items.length === 0) {
      throw new ERR_RESPONSE.NotFoundError('Cart is empty', ERR.CART_EMPTY);
    }

    const invalidItems = [];

    for (const item of cart.items) {
      const isAvailable  = await menuItemService.checkAvailable(item.menuItemId);
      if (!isAvailable ) {
        invalidItems.push({
          menuItemId: item.menuItemId,
          name: item.name
        });
      }
    }

    // handle invalid items
    if (invalidItems.length > 0) {
      throw new ERR_RESPONSE.UnprocessableEntityError(
        'Some items are unavailable',
        ERR.MENUITEM_UNAVAILABLE,
        { items: invalidItems }
      );
    }

    // if all items is ok
    const newOrder = await orderService.createOrder(cart);

    const newCart = await this.clearCart(userId);

    console.log(newCart);

    return newOrder;
  }

  async clearCart(userId) {
    const newCart = await cartRepository.clearCart(userId);
    return newCart;
  }

  // helper: recalculate totalItems + totalPrice
  _recalculate(cart) {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.finalPrice, 0);
  }

  _calcOptionPrice(options) {
    return options.reduce((sum, opt) => sum + opt.price, 0);
  }
}

module.exports = new CartService();