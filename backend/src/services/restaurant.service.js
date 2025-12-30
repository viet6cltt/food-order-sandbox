const RestaurantRepository = require('../repositories/restaurant.repository');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const restaurantRepository = require('../repositories/restaurant.repository');
const cloudinary = require("@/config/cloudinary.config");
const fs = require('fs');

function isWithinBusinessHours(current, open, close) {
  // current, open, close đều dạng "HH:MM"

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const cur = toMinutes(current);
  const op = toMinutes(open);
  const cl = toMinutes(close);

  // Trường hợp quán mở qua đêm (ví dụ 20:00 → 02:00)
  if (cl < op) {
    return cur >= op || cur < cl;
  }

  return cur >= op && cur < cl;
}

class RestaurantService {
  
  // get restaurant info 
  async getRestaurantInfo(restaurantId) {
    return await RestaurantRepository.getById(restaurantId);
  }

  // create restaurant
  async createRestaurant(data) {
    return await RestaurantRepository.create(data);
  }

  // check owner 
  async checkOwner(restaurantId, userId) {
    console.log(restaurantId);
    const restaurant = await this.getRestaurantInfo(restaurantId);

    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError("Restaurant is not found", ERR.RESTAURANT_NOT_FOUND)
    }
    if (restaurant.ownerId.toString() !== userId.toString()) {
      throw new ERR_RESPONSE.ForbiddenError("You are not the owner of this restaurant", ERR.RESTAURANT_NOT_OWNER);
    }

    return restaurant;
  }

  async checkOpenTime(restaurant) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    return isWithinBusinessHours(currentTime, restaurant.opening_time, restaurant.closing_time);
  }

  async searchRestaurants({ keyword, lat, lng, limit, skip }) {
    return restaurantRepository.search({
      keyword,
      lat: Number(lat),
      lng: Number(lng),
      skip: Number(skip),
      limit: Number(limit)
    });
  }

  async uploadBanner(id, file) {
    const restaurant = await restaurantRepository.getById(id);
    if (!restaurant) throw new ERR_RESPONSE.NotFoundError("Restaurant not found");

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `food-order/restaurants/${id}`,
      public_id: `banner-${Date.now()}`,
      overwrite: true,
    });

    // delete temp file
    fs.unlinkSync(file.path);

    // update DB
    const updated = await restaurantRepository.updateBannerUrl(id, result.secure_url);

    return updated;
  }
}

module.exports = new RestaurantService();