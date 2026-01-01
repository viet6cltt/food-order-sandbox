const repoRestaurantRequest = require('../repositories/restaurantRequest.repository');
const serviceRestaurant = require('./restaurant.service');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const cloudinary = require('../config/cloudinary.config');
const fs = require('fs');

class RestaurantRequestService {
  
  async submitRequest(userId, data, file) {
    const exists = await repoRestaurantRequest.getPendingRequestsByUserId(userId);
    if (exists) {
      throw new ERR_RESPONSE.UnprocessableEntityError("This user already has a pending request");
    }

    const payload = { ...(data || {}) };

    if (file && file.path) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `food-order/restaurant-requests/${userId}`,
          public_id: `banner-${Date.now()}`,
          overwrite: true,
        });

        payload.bannerUrl = result.secure_url;
      } finally {
        try {
          fs.unlinkSync(file.path);
        } catch {
          // ignore
        }
      }
    }

    return await repoRestaurantRequest.createRequest({ ...payload, userId });
  }

  async getMyRequest(userId) {
    return await repoRestaurantRequest.getPendingByUserId(userId);
  }
}

module.exports = new RestaurantRequestService();