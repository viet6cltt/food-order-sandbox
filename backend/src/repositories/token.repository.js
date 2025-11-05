const VerificationToken = require('../models/VerificationToken');

class TokenRepository {
  /**
   * 📨 Tạo mới token (verify email / reset password / two factor)
   * @param {Object} data - gồm userId, type, tokenHash, expiresAt
   */
  async createToken(data) {
    return await VerificationToken.create(data);
  }

  /**
   * 🔍 Tìm token đang hoạt động (chưa hết hạn & chưa dùng)
   * @param {ObjectId} userId
   * @param {String} type - 'verify_email' | 'reset_password' | 'two_factor'
   */
  async findActiveToken(userId, type) {
    return await VerificationToken.findOne({
      userId,
      type,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  /**
   * ✅ Tiêu thụ token sau khi xác minh
   * @param {ObjectId} userId
   * @param {String} type
   */
  async consumeToken(userId, type) {
    return await VerificationToken.findOneAndUpdate(
      {
        userId,
        type,
        consumedAt: null,
        expiresAt: { $gt: new Date() },
      },
      { consumedAt: new Date() },
      { new: true }
    );
  }
}


module.exports = new TokenRepository();
