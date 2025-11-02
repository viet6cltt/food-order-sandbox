const AuthRepository = require('../repositories/auth.repository');
const TokenRepository = require('../repositories/token.repository');

class UserService {
  async createUser(data) {
    return await AuthRepository.createUser(data);
  }

  async findByUsernameOrPhone(username, phone) {
    return await AuthRepository.findByUsernameOrPhone(username, phone);
  }

  async findByPhone(phone) {
    return await AuthRepository.findByPhone(phone);
  }

  async markPhoneVerified(userId) {
    return await AuthRepository.updateUser(userId, {
      phoneVerifiedAt: new Date()
    });
  }

  async markEmailVerified(userId) {
    return await AuthRepository.updateUser(userId, {
      emailVerifiedAt: new Date()
    });
  }

  async getById(userId) {
    return await AuthRepository.findById(userId);
  }
}


module.exports = new UserService();