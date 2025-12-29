const UserRepo = require("../../repositories/user.repository");
const ERR_RESPONSE = require('../../utils/httpErrors.js');
const ERR = require('../constants/errorCodes');

class AdminUserService {
  async listUsers({ role, status }) {
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    return await UserRepo.findAll(filter);
  }

  async getUserDetail(userId) {
    const user = await UserRepo.findById(userId);

    if (!user) throw new ERR_RESPONSE.NotFoundError("User Not Found");

    return user;
  }

  async blockUser(userId) {
    const user = await UserRepo.updateUser(userId, { status: 'banned' });

    if (!user) throw new ERR_RESPONSE.NotFoundError("User Not Found");

    return user;
  }

  async unlockUser(userId) {
    const user = await UserRepo.updateUser(userId, { status: 'active' });

    if (!user) throw new ERR_RESPONSE.NotFoundError("User Not Found");

    return user;
  }
}

module.exports = new AdminUserService();