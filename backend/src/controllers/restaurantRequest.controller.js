const restaurantRequestService = require('../services/restaurantRequest.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse');

class RestaurantRequestController {
  async submit(req, res, next) {
    try {
      const userId = req.userId;
      let data = req.body;

      // Support multipart/form-data where payload is sent as JSON string in field `data`
      if (req.body && typeof req.body.data === 'string') {
        try {
          data = JSON.parse(req.body.data);
        } catch (e) {
          throw new ERR_RESPONSE.BadRequestError('Invalid JSON in field `data`');
        }
      }

      if (!data) {
        throw new ERR_RESPONSE.BadRequestError("Missing Required Data");
      }

      const result = await restaurantRequestService.submitRequest(userId, data, req.file);
      return SUCCESS_RESPONSE.success(res, "Send Request Successfully", result); 
    } catch (err) {
      next(err);
    }
  }

  async getMyRequest(req, res, next) {
    try {
      const userId = req.userId;
      const request = await restaurantRequestService.getMyRequest(userId);
      
      if (!request) {
        return SUCCESS_RESPONSE.success(res, "No pending request found", null);
      }

      return SUCCESS_RESPONSE.success(res, "Get request successfully", request);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RestaurantRequestController();