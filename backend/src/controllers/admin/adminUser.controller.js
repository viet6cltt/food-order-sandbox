const ERR = require('../../constants/errorCodes');
const ERR_RESPONSE = require('../../utils/httpErrors');
const SUCCESS_RESPONSE = require('../../utils/successResponse'); 

const adminUserService = require('../../services/admin/adminUser.service');

class AdminUserController {
  async listUsers(req, res, next) {
    try {
      const { role, status } = req.query;
      const users = await adminUserService.listUsers({ role, status });

      return SUCCESS_RESPONSE.success(req, "Get users successfully", users);
    } catch (err) {
      next(err);
    }
  }

  async getUserDetail(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.getUserDetail(userId);
      
      return SUCCESS_RESPONSE.success(req, "Get user detail succesfully", user);
    } catch (err) {
      next(err);
    }
  }

  async blockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.blockUser(userId);
      return success.ok(res, user);
    } catch (err) {
      next(err);
    }
  }

  async unlockUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ERR_RESPONSE.BadRequestError("Missing userId");

      const user = await adminUserService.unlockUser(userId);
      return success.ok(res, user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminUserController();