const Cart = require('../models/Cart');

class CartRepository {
  async findByUserId(userId) {
    return await Cart.findOne({ userId: userId });
  }

  async deleteByUserId(userId) {
    return Cart.deleteOne({ userId });
  }

  async create(payload) {
    return Cart.create(payload);
  }

  async save(cart) {
    return cart.save();
  }

  async deleteItem(cartId, itemId)  {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const item = cart.items.id(itemId);
    if (!item) return null;

    item.deleteOne();
    await cart.save();

    return cart;
  }

  async clearCart(userId) {
    return Cart.findOneAndUpdate(
      { userId },
      {
        items: [],
        totalItems: 0,
        totalPrice: 0
      },
      { new: true, runValidators: false }
    );
  }
}

module.exports = new CartRepository();