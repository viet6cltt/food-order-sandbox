

const RestaurantRepository = require('@/repositories/restaurant.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
const restaurantRepository = require('@/repositories/restaurant.repository');
const cloudinary = require("@/config/cloudinary.config");
const fs = require('fs');
const { RestaurantStatus } = require('@/constants/restaurant.constants');

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

  // trả về restaurant nếu đúng là owner
  async checkOwner(restaurantId, userId) {
    const restaurant = await restaurantRepository.getById(restaurantId);

    if (!restaurant) return null;

    if (restaurant.ownerId.toString() !== userId.toString()) {
      return null;
    }

    return restaurant;
  }

  // get restaurants by categoryId
  async getRestaurants({ categoryId, pagination, sortBy, lat, lng }) {
    const { skip, limit, page } = pagination;

    const filter = {
      status: RestaurantStatus.ACTIVE
    };

    if (categoryId) filter.categoriesId = categoryId;

    // sort khi không có tọa độ
    // nếu sortBy là newest thì k quan tâm đến rating
    let sortOptions = { rating: -1, createdAt: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const { items, total } = await restaurantRepository.findAllWithScore({
      filter,
      sort: sortOptions,
      skip, limit,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
    });

    // Xử lí giờ đóng cửa 
    const currentTime = new Date().toTimeString().slice(0, 5);

    const processedItems = items.map(item => ({
      ...item,
      isOpen: isWithinBusinessHours(currentTime, item.opening_time, item.closing_time),
    }));

    return {
      items: processedItems,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // get restaurant info 
  async getRestaurantInfo(restaurantId) {
    return await RestaurantRepository.getById(restaurantId);
  }

  // create restaurant
  async createRestaurant(data) {
    return await RestaurantRepository.create(data);
  }

  async isOperational(restaurant) {
    // check status (by admin)
    if (restaurant.status !== RestaurantStatus.ACTIVE) {
      return false;
    }

    // check isActive (by owner)
    if (!restaurant.isActive) {
      return false;
    } 

    // check Opening/Closed Time
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

  async getRecommend() {
    const data = await restaurantRepository.getRecommend();

    return data;
  }

  async updateRatingAndCount(id, { newRating, newCount }) {
    return restaurantRepository.updateRatingAndCount(id, { newRating, newCount });
  }
}

module.exports = new RestaurantService();