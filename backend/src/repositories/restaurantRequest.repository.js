const RestaurantRequest = require('../models/RestaurantRequest');

class RestaurantRequestRepository {
  async createRequest(data) {
    return await RestaurantRequest.create(data);
  }

  async getPendingRequests() {
    return await RestaurantRequest.find({ status: "pending" });
  }

  async getById(requestId) {
    return await RestaurantRequest.findById(requestId);
  }

  async getPendingRequestsByUserId(userId) {
    return await RestaurantRequest.exists({
      userId: userId,
      status: "pending"
    });
  }

  async approve(requestId) {
    return await RestaurantRequest.findByIdAndUpdate(
      requestId, 
      { status: "approved", reviewedAt: new Date() },
      { new: true }
    );
  }

  async reject(requestId, reason) {
    return await RestaurantRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected", rejectReason: reason, reviewedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new RestaurantRequestRepository();