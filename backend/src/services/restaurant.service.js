

const RestaurantRepository = require('../repositories/restaurant.repository');
const ERR_RESPONSE = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const restaurantRepository = require('../repositories/restaurant.repository');
const cloudinary = require("../config/cloudinary.config");
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

    const todaySchedule = getScheduleForToday(restaurant);
    if (todaySchedule) {
      if (todaySchedule.isClosed) return false;
      return isWithinBusinessHours(currentTime, todaySchedule.open, todaySchedule.close);
    }

    return isWithinBusinessHours(currentTime, restaurant.opening_time, restaurant.closing_time);
  }

  async getList({ page = 1, limit = 16 } = {}) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 16);
    const skip = (p - 1) * l;

    const { items, total } = await RestaurantRepository.getAll({ limit: l, skip });

    return {
      items,
      meta: {
        page: p,
        limit: l,
        total: total,
      },
    };
  }

  async getRecommend({ limit = 5 } = {}) {
    const l = Math.max(1, Math.min(50, parseInt(limit, 10) || 5));
    return await RestaurantRepository.getRecommend({ limit: l });
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
}

module.exports = new RestaurantService();