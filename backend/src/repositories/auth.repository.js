const User = require('../models/User');
const AuthSession = require('../models/AuthSession');
class AuthRepository {
  async findByUsernameOrPhone(username, phone) {
    const query = { $or: []};
    if (username) query.$or.push({ username});
    if (phone) query.$or.push({ phone });

    if (query.$or.length == 0) {
      return null;
    }

    return await User.findOne(query);
  }

  async findByPhone(phone) {
    return await User.findOne({ phone }).select('+passwordHash');
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async updateUser(userId, updateFields) {
    return await User.findByIdAndUpdate(userId, updateFields, { new: true });
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async createAuthSession(data) {
    const authSession = new AuthSession(data);
    return await authSession.save();
  }

  async findValidSessionByUserId(userId) {
    return await AuthSession.findOne({
      userId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  async revokeSession(sessionId) {
    return await AuthSession.findByIdAndUpdate(sessionId, {
      revokedAt: new Date(),
    });
  }
}



module.exports = new AuthRepository;