const repoRestaurantRequest = require('@/repositories/restaurantRequest.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');

class RestaurantRequestService {
  
  async submitRequest(userId, data) {
    const exists = await repoRestaurantRequest.getPendingRequestsByUserId(userId);
    if (exists) {
      throw new ERR_RESPONSE.UnprocessableEntityError("This user already has a pending request");
    }

    const payload = { ...(data || {}) };

    // If requester only provides address text, derive coordinates.
    if (payload.address && typeof payload.address === 'object') {
      const coords = payload.address?.geo?.coordinates;
      const hasValidCoords =
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number' &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]);

      const isDefaultPlaceholder = hasValidCoords && coords[0] === 10 && coords[1] === 10;

      if (!hasValidCoords || isDefaultPlaceholder) {
        const full = typeof payload.address.full === 'string' ? payload.address.full.trim() : '';
        if (full) {
          const { lat, lng, formatted } = await geocodeService.geocodeAddress(full);
          payload.address.geo = {
            ...(payload.address.geo || {}),
            type: 'Point',
            coordinates: [lng, lat],
          };
          payload.address.full = formatted || full;
        }
      }
    }

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

    return await repoRestaurantRequest.createRequest({ ...data, userId });
  }

  async getMyRequest(userId) {
    return await repoRestaurantRequest.getPendingByUserId(userId);
  }
  
}

module.exports = new RestaurantRequestService();