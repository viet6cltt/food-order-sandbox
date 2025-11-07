
const SUCCESS_RESPONSE = require('../utils/successResponse');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const UserService = require('../services/user.service');

class UserController {
  index(req, res, next) {
    return SUCCESS_RESPONSE.success(res, 'User API are working well!!!');
  }

  async getMe(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError('Access Token are missing or invalid', ERR.AUTH_INVALID_TOKEN);
      }

      const user = await UserService.findById(userId);

      return SUCCESS_RESPONSE.success(res, 'Get your Info successfully', { user });
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError('UserId is required!', ERR.VALIDATION_FAILED);

      const user = await UserService.findById(userId);

      return SUCCESS_RESPONSE.success(res, 'Get user Info successfully', { user });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new UserController();