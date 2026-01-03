const SUCCESS_RESPONSE = require('@/utils/successResponse');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
const GeocodeService = require('@/services/app/geocode.service');

class GeocodeController {
  // [POST] /api/geocode
  async geocode(req, res, next) {
    try {
      const address = req.body?.address ?? req.body?.query ?? req.body?.q;
      if (typeof address !== 'string' || !address.trim()) {
        throw new ERR_RESPONSE.BadRequestError('address is required', ERR.INVALID_INPUT);
      }

      const result = await GeocodeService.geocodeAddress(address);
      return SUCCESS_RESPONSE.success(res, 'Geocode successfully', result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GeocodeController();
