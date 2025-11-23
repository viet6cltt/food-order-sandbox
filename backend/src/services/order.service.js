const orderRepository = require('../repositories/order.repository');
const geolib = require('geolib');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const menuItemService = require('./menuItem.service');
const restaurantService = require('./restaurant.service');
const paymentService = require('./payment.service');

const { orderStatusObject ,allowedTransitions } = require('../constants/orderStatus');


class OrderService {

  /**For users */
  async createOrder(cart) {
    const userId = cart.userId;
    const restaurantId = cart.restaurantId;

    // Validate restaurant
    const restaurant = await restaurantService.getRestaurantInfo(restaurantId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError(
        "Restaurant not found",
        ERR.RESTAURANT_NOT_FOUND
      );
    }
  
    if (!restaurant.isAcceptingOrders) {
      throw new ERR_RESPONSE.UnprocessableEntityError(
        "Restaurant is not accepting orders at the moment",
        ERR.RESTAURANT_NOT_ACCEPTING_ORDERS
      );
    }

    if (!restaurantService.checkOpenTime(restaurant)) {
      throw new ERR_RESPONSE.UnprocessableEntityError(
        "Restaurant is currently closed (outside business hours)",
        ERR.RESTAURANT_OUTSIDE_BUSINESS_HOURS,
      )
    }

    // Validate menu price changed
    const priceErrors = [];
    for (const item of cart.items) {
      const freshMenuItem = await menuItemService.getMenuItemInfo(item.menuItemId);

      if (!freshMenuItem) {
        priceErrors.push({
          menuItemId: item.menuItemId,
          reason: 'Item not found'
        });
        continue;
      }

      if (freshMenuItem.price !== item.basePrice) {
        priceErrors.push({
          menuItemId: item.menuItemId,
          name: item.name,
          oldPrice: item.basePrice,
          newPrice: freshMenuItem.price,
        });
      }
    }

    if (priceErrors.length > 0) {
      throw new ERR_RESPONSE.ConflictError(
        "Price has been updated for some items",
        ERR.MENUITEM_PRICE_CHANGED,
        { items: priceErrors }
      );
    }

    // Calculate total price
    const totalFoodPrice = cart.items.reduce(
      (acc, item) => acc + item.finalPrice,
      0
    );

    const shippingFee = 0
    // Build order items
    const orderItems = cart.items.map((item)=> ({
      menuItemId: item.menuItemId,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: item.qty,
      finalPrice: item.finalPrice,
      selectedOptions: item.selectedOptions,
    }));

    // Create order 
    const order = await orderRepository.create({
      userId,
      restaurantId,
      items: orderItems,
      totalFoodPrice,
      status: "draft",
      note: "",
    });

    return order;
  }

  async updateOrderInfo({ userId, orderId, deliveryAddress, paymentMethod }) {
    // get order
    const order = await orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order not found");
    }

    if (order.userId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError("You do not have permission to access this order", ERR.ORDER_NOT_OWNER);
    }

    // dont allow if confirmed
    if (order.status !== "draft") {
      throw new ERR_RESPONSE.BadRequestError(
        "You can only update order info while the order is pending"
      );
    }

    // Get restaurant info to cal shipping fee
    const restaurant = await restaurantService.getRestaurantInfo(order.restaurantId);
    if (!restaurant || !restaurant.address || !restaurant.address.geo) {
      throw new ERR_RESPONSE.BadRequestError("Restaurant geo location is invalid");
    }

    const distanceMeters = geolib.getDistance(
      {
        latitude: restaurant.address.geo.coordinates[1],
        longitude: restaurant.address.geo.coordinates[0],
      },
      {
        latitude: deliveryAddress.lat,
        longitude: deliveryAddress.lng,
      }
    );

    const distanceKm = distanceMeters / 1000;

    const shippingFee = restaurant.baseShippingFee + distanceKm * restaurant.shippingPerKm;

    // update fields

    // now, dont handle discountAmount, note
    order.status = "pending";
    order.deliveryAddress = deliveryAddress;
    order.paymentMethod = paymentMethod;
    order.shippingFee = Math.round(shippingFee);

    await order.save();

    return order;
  }

  async getOrdersOfUser(userId) {
    const orders = await orderRepository.findByUserId(userId);

    return orders;
  }

  async getOrderById(orderId) {
    return await orderRepository.findByOrderId(orderId);
  }

  async getOrder(userId, orderId) {
    const order = await orderRepository.findByOrderId(orderId);

    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order not found", ERR.ORDER_NOT_FOUND);
    }
    if (order.userId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError("You do not have permission to access this order", ERR.ORDER_NOT_OWNER);
    }

    return order;
  }

  async cancelOrder(userId, orderId) {
    const order = await orderRepository.findByOrderId(orderId);

    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order not found", ERR.ORDER_NOT_FOUND);
    }

    if (order.userId.toString() !== userId) {
      throw new ERR_RESPONSE.ForbiddenError("You do not have permission to cancel this order", ERR.ORDER_NOT_OWNER);
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new ERR_RESPONSE.UnprocessableEntityError(
        "Order cannot be cancelled in current state",
        ERR.ORDER_CANNOT_CANCEL
      );
    }
    
    // update
    order.status = "cancelled";
    await order.save();

    return order;
  }

  /**
   * For Restarant Owner
   */

  async getOrdersOfRestaurant({ userId, restaurantId, page, status, limit, from, to }) {
    // logic xử lí phần check đã ở bên restaurant service rồi
    await restaurantService.checkOwner(restaurantId, userId);

    const filter = { restaurantId };

    if (status) filter.status = status;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    return await orderRepository.getOrdersOfRestaurant(filter, { page, limit });
  }

  async getOrderByRestaurant(userId, restaurantId, orderId) {
    await restaurantService.checkOwner(restaurantId, userId);

    return await orderRepository.findByOrderId(orderId);
  }

  async updateOrderStatusByRestaurant({ orderId, restaurantId, userId, status }) {
    await restaurantService.checkOwner(restaurantId, userId);

    // Get order
    const order = await orderRepository.findByOrderId(orderId);

    if (!order) {
      throw new ERR_RESPONSE.NotFoundError("Order not found");
    }

    // Only allow restaurant owner of this order
    if (order.restaurantId.toString() !== restaurantId.toString()) {
      throw new ERR_RESPONSE.ForbiddenError("Order does not belong to your restaurant", ERR.ORDER_NOT_RESTAURANT);
    }

    const currentStatus = order.status;
    const nextStatus = status;
    
    // Check status 
    const allowedNextStatus = allowedTransitions[currentStatus];

    if (!allowedNextStatus.includes(nextStatus)) {
      throw new ERR_RESPONSE.BadRequestError(`Cannot change order from ${currentStatus} to ${nextStatus}`, ERR.ORDER_CANNOT_CHANGE_STATUS);
    }

    // Update
    return await orderRepository.updateOrderStatus(orderId, status);
  }

  async updateOrderStatusByRestaurantToCompleted({ orderId, restaurantId, userId}) {
    const order = await this.updateOrderStatusByRestaurant({ orderId, restaurantId, userId, status: orderStatusObject.completed });

    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    const payment = await paymentService.createPaymentCOD(order);
    return { order, payment };
  }

}

module.exports = new OrderService();