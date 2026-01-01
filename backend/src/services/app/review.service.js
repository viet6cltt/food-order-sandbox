const reviewRepo = require("@/repositories/review.repository");
const orderRepo = require("@/repositories/order.repository");
const ERR = require("@/utils/httpErrors");

class ReviewService {
  async create(payload) {
    // check order belongs to user + completed
    const order = await orderRepo.findById(payload.orderId);
    if (!order) {
      throw new ERR.NotFoundError("Order not found");
    }

    if (String(order.userId) !== String(payload.userId)) {
      throw new ERR.ForbiddenError("You have no permission to create review");
    }

    if (order.status !== "completed") {
      throw new ERR.BadRequestError("Order not completed, cannot review");
    }

    return await reviewRepo.create(payload);
  }

  async listByRestaurant(restaurantId, pagination) {
    return await reviewRepo.findPublishedByRestaurant(restaurantId, pagination);
  }

  async getDetail(id) {
    return await reviewRepo.findDetail(id);
  }
}

module.exports = new ReviewService();