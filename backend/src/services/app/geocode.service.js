const axios = require('axios');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');

function requireApiKey() {
  const key = process.env.OPENCAGE_API_KEY;
  if (!key) {
    throw new ERR_RESPONSE.InternalServerError(
      'OPENCAGE_API_KEY is not configured',
      ERR.INTERNAL_SERVER_ERROR
    );
  }
  return key;
}

function normalizeQuery(input) {
  if (typeof input !== 'string') return '';
  return input.trim();
}

class GeocodeService {
  /**
   * Geocode a human-readable address into coordinates.
   * Returns: { lat, lng, formatted }
   */
  async geocodeAddress(query) {
    const q = normalizeQuery(query);
    if (!q) {
      throw new ERR_RESPONSE.BadRequestError('Address query is required', ERR.INVALID_INPUT);
    }

    const key = requireApiKey();

    const params = {
      q,
      key,
      limit: 1,
      no_annotations: 1,
    };

    // Optional narrowing
    if (process.env.OPENCAGE_COUNTRYCODE) {
      params.countrycode = String(process.env.OPENCAGE_COUNTRYCODE).trim();
    }
    if (process.env.OPENCAGE_LANGUAGE) {
      params.language = String(process.env.OPENCAGE_LANGUAGE).trim();
    }

    let res;
    try {
      res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params,
        timeout: 10_000,
      });
    } catch (err) {
      throw new ERR_RESPONSE.BadGatewayError('Failed to reach geocoding provider');
    }

    const results = res?.data?.results;
    if (!Array.isArray(results) || results.length === 0) {
      throw new ERR_RESPONSE.NotFoundError('Address not found', ERR.NOT_FOUND);
    }

    const best = results[0];
    const lat = best?.geometry?.lat;
    const lng = best?.geometry?.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new ERR_RESPONSE.UnprocessableEntityError('Invalid geocoding result', ERR.INVALID_INPUT);
    }

    return {
      lat,
      lng,
      formatted: best?.formatted || q,
    };
  }

//   /**
//    * Ensure a MongoDB Point is present on an address object.
//    * Mutates and returns the address.
//    */
//   async ensureAddressGeo(address) {
//     if (!address || typeof address !== 'object') return address;

//     const full = typeof address.full === 'string' ? address.full.trim() : '';
//     const coords = address?.geo?.coordinates;

//     const hasValidCoords =
//       Array.isArray(coords) &&
//       coords.length === 2 &&
//       typeof coords[0] === 'number' &&
//       typeof coords[1] === 'number' &&
//       Number.isFinite(coords[0]) &&
//       Number.isFinite(coords[1]);

//     if (hasValidCoords) return address;

//     if (!full) {
//       return address;
//     }

//     const { lat, lng } = await this.geocodeAddress(full);

//     address.geo = {
//       ...(address.geo || {}),
//       type: 'Point',
//       coordinates: [lng, lat],
//     };

//     return address;
//   }
// }
}

module.exports = new GeocodeService();
