const ERR = require('../../constants/errorCodes');
const ERR_RESPONSE = require('../../utils/httpErrors');
const SUCCESS_RESPONSE = require('../../utils/successResponse'); 

const adminUserService = require('../../services/admin/adminUser.service');

class AdminUserController {
  async listUsers(req, res, next) {
    try {
      const { role, status } = req.query;
      const users = await adminUserService.listUsers({ role, status });

      return SUCCESS_RESPONSE.success(res, "Get users successfully", users);
    } catch (err) {
      next(err);
    }
  }

  async getUserDetail(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.getUserDetail(userId);
      
      return SUCCESS_RESPONSE.success(res, "Get user detail succesfully", user);
    } catch (err) {
      next(err);
    }
  }

  async blockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.blockUser(userId);
      return SUCCESS_RESPONSE.success(res, "Block this user is successful", user);
    } catch (err) {
      next(err);
    }
  }

  async unlockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.unlockUser(userId);
      return SUCCESS_RESPONSE.success(res, "Unlock this user is successful", user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminUserController();