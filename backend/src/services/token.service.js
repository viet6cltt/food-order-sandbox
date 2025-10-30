const tokenRepository = require('../repositories/token.repository');

async function createVerifyPhoneToken(userId, phone) {
  // tạo otp 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // TTL: 2 phút
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await tokenRepository.createToken({
    userId,
    type: 'verify_phone',
    deliveryMethod: 'sms',
    code: otp,
    expiresAt
  });

  return otp;
}

async function verifyPhoneOTP(userId, otp) {
  const token = await tokenRepository.consumeToken(userId, otp);
  if (!token) throw new Error('Invalid or expired OTP!');
  return token;
}

module.exports = { createVerifyPhoneToken, verifyPhoneOTP };