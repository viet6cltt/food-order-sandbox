const TokenRepository = require('../repositories/token.repository');
const authHelper = require('../utils/authHelper');
const tokenConfig = require('../config/token.config');

class TokenService {
  async createVerifyPhoneToken(userId, phone) {
    // tạo otp 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TTL: 2 phút
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await TokenRepository.createToken({
      userId,
      type: 'verify_phone',
      deliveryMethod: 'sms',
      code: otp,
      expiresAt
    });

    return otp;
  }

  async createEmailVerificationToken(userId, email) {
    const token = authHelper.generateEmailVerificationToken(userId, email);

    await TokenRepository.createToken({ 
      userId,
      type: 'verify_email',
      tokenHash: token,
      expiresAt: tokenConfig.calculateExpiresAt(tokenConfig.getTokenConfig().EMAIL_VERIFY.expiry)
    });

    return token;
  }

  async verifyEmailVerificationToken(userId) {
    const record = await TokenRepository.findActiveToken(userId, 'verify_email');
    if (!record) throw new Error('Token not found or already used');

    await TokenRepository.consumeToken(userId, 'verify_email');

    return true;
  }

  async createResetPasswordToken(userId) {
    const token = authHelper.generateResetPasswordToken(userId);

    await TokenRepository.createToken({
      userId,
      type: 'reset_password',
      tokenHash: token,
      expiresAt: tokenConfig.calculateExpiresAt(tokenConfig.getTokenConfig().RESET_PASSWORD.expiry),
    });

    return token;
  }

  async verifyResetPasswordToken(userId) {
    const record = await TokenRepository.findActiveToken(userId, 'reset_password');
    if (!record) throw new Error('Token not found or already used');

    await TokenRepository.consumeToken(userId, 'reset_password');

    return true;
  }
}




module.exports = new TokenService();