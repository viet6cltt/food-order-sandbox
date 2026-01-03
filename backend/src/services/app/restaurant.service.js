

const RestaurantRepository = require('@/repositories/restaurant.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
const restaurantRepository = require('@/repositories/restaurant.repository');
const cloudinary = require("@/config/cloudinary.config");
const fs = require('fs');
const { RestaurantStatus } = require('@/constants/restaurant.constants');
const mongoose = require('mongoose');

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

function normalizeTimeString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  // Basic HH:MM validation
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) return fallback;
  return trimmed;
}

function normalizeOpeningHours(input) {
  if (!Array.isArray(input)) return undefined;

  const normalized = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;

    const day = Number(raw.day);
    if (!Number.isInteger(day) || day < 0 || day > 6) continue;

    const open = normalizeTimeString(raw.open, "08:00");
    const close = normalizeTimeString(raw.close, "22:00");
    const isClosed = Boolean(raw.isClosed);

    normalized.push({ day, open, close, isClosed });
  }

  // Ensure unique per-day entries; last one wins
  const byDay = new Map();
  for (const item of normalized) byDay.set(item.day, item);

  return Array.from(byDay.values()).sort((a, b) => a.day - b.day);
}

function getScheduleForToday(restaurant) {
  const schedule = restaurant?.openingHours;
  if (!Array.isArray(schedule) || schedule.length === 0) return null;

  // JS: 0=Sunday..6=Saturday. Convert to 0=Monday..6=Sunday
  const todayJs = new Date().getDay();
  const today = (todayJs + 6) % 7;
  return schedule.find((s) => Number(s?.day) === today) || null;
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

  async getRestaurantsByOwnerId(userId) {
    return await restaurantRepository.findByOwnerId(userId);
  }

  async updateMyRestaurant(restaurantId, updateData) {
    return await restaurantRepository.update(restaurantId, updateData);
  }

  async uploadPaymentQr(restaurantId, filePath) {
    try {
      // Upload ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `food-order/restaurants/${restaurantId}/payments`,
        public_id: `qr-${Date.now()}`,
      });

      // Cập nhật URL vào DB
      const updated = await restaurantRepository.update(restaurantId, { qrImageUrl: result.secure_url });
      
      // Xóa file tạm ở backend
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      return updated;
    } catch (err) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw err;
    }
  }

  // get restaurants by categoryId
  async getRestaurants({ categoryId, pagination, sortBy, lat, lng }) {
    const { skip, limit, page } = pagination;

    const filter = {
      status: RestaurantStatus.ACTIVE
    };

    if (categoryId) filter.categoriesId = new mongoose.Types.ObjectId(categoryId);

    // sort khi không có tọa độ
    // nếu sortBy là newest thì k quan tâm đến rating
    let sortOptions = { rating: -1, createdAt: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const hasLocation =
      lat !== null &&
      lng !== null &&
      !isNaN(lat) &&
      !isNaN(lng);

    console.log(filter, sortOptions, lat, lng)

    const { items, total } = await restaurantRepository.findAllWithScore({
      filter,
      sort: sortOptions,
      skip, limit,
      lat: hasLocation ? lat : null,
      lng: hasLocation ? lng : null,
    });


    console.log(items);

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
    const result = await restaurantRepository.search({
      keyword,
      lat: Number(lat),
      lng: Number(lng),
      skip: Number(skip),
      limit: Number(limit)
    });

    console.log(result)
    return result;
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

  async getRestaurantByOwnerId(userId) {
    return await RestaurantRepository.findByOwnerId(userId);
  }

  async updateRestaurantByOwnerId(userId, updates = {}) {
    const restaurant = await RestaurantRepository.findByOwnerId(userId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError("Restaurant not found for this owner", ERR.RESTAURANT_NOT_FOUND);
    }

    // Allowlist only editable fields from the owner settings screen
    const allowed = [
      'name',
      'description',
      'address',
      'phone',
      'categoriesId',
      'opening_time',
      'closing_time',
      'openingHours',
      'paymentInfo',
    ];
    const safeUpdate = {};

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        safeUpdate[key] = updates[key];
      }
    }

    // Basic shape normalization
    if (safeUpdate.address && typeof safeUpdate.address === 'object') {
      safeUpdate.address = {
        ...restaurant.address?.toObject?.() ,
        ...safeUpdate.address,
      };

      // If owner edits address text but doesn't send coordinates, derive them
      const coords = safeUpdate.address?.geo?.coordinates;
      const hasValidCoords =
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number' &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]);

      if (!hasValidCoords) {
        await geocodeService.ensureAddressGeo(safeUpdate.address);
      }
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'opening_time')) {
      safeUpdate.opening_time = normalizeTimeString(safeUpdate.opening_time, restaurant.opening_time || '08:00');
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'closing_time')) {
      safeUpdate.closing_time = normalizeTimeString(safeUpdate.closing_time, restaurant.closing_time || '22:00');
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'openingHours')) {
      const normalized = normalizeOpeningHours(safeUpdate.openingHours);
      if (normalized) {
        safeUpdate.openingHours = normalized;
      } else {
        delete safeUpdate.openingHours;
      }
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'paymentInfo')) {
      const raw = safeUpdate.paymentInfo;
      if (raw && typeof raw === 'object') {
        const nextPaymentInfo = {};

        if (Object.prototype.hasOwnProperty.call(raw, 'bankName')) {
          nextPaymentInfo.bankName = typeof raw.bankName === 'string' ? raw.bankName.trim() : null;
        }

        if (Object.prototype.hasOwnProperty.call(raw, 'bankAccountNumber')) {
          nextPaymentInfo.bankAccountNumber = typeof raw.bankAccountNumber === 'string' ? raw.bankAccountNumber.trim() : null;
        }

        if (Object.prototype.hasOwnProperty.call(raw, 'bankAccountName')) {
          nextPaymentInfo.bankAccountName = typeof raw.bankAccountName === 'string' ? raw.bankAccountName.trim() : null;
        }

        if (Object.prototype.hasOwnProperty.call(raw, 'qrImageUrl')) {
          nextPaymentInfo.qrImageUrl = typeof raw.qrImageUrl === 'string' ? raw.qrImageUrl.trim() : null;
        }

        safeUpdate.paymentInfo = {
          ...(restaurant.paymentInfo?.toObject?.() || restaurant.paymentInfo || {}),
          ...nextPaymentInfo,
        };
      } else {
        delete safeUpdate.paymentInfo;
      }
    }

    return await RestaurantRepository.updateById(restaurant._id, safeUpdate);
  }

  async uploadPaymentQrByOwnerId(ownerId, file) {
    const restaurant = await RestaurantRepository.findByOwnerId(ownerId);
    if (!restaurant) {
      throw new ERR_RESPONSE.NotFoundError("Restaurant not found for this owner", ERR.RESTAURANT_NOT_FOUND);
    }

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `food-order/restaurants/${restaurant._id}/payment`,
      public_id: `payment-qr-${Date.now()}`,
      overwrite: true,
    });

    // delete temp file
    fs.unlinkSync(file.path);

    return await RestaurantRepository.updateById(restaurant._id, {
      'paymentInfo.qrImageUrl': result.secure_url,
    });
  }

  async getRecommend() {
    const data = await restaurantRepository.getRecommend();

    return data;
  }

  async updateRatingAndCount(id, { newRating, newCount }) {
    return await restaurantRepository.updateRatingAndCount(id, { newRating, newCount });
  }
}

module.exports = new RestaurantService();