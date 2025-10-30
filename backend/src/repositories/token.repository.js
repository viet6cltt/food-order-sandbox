const VerificationToken = require('../models/VerificationToken');

// Tạo mới token (email hoặc sms)
async function createToken(data) {
  return await VerificationToken.create(data);
}

// Tìm token đang hoạt động
async function findActiveToken(userId, type) {
  return await VerificationToken.findOne({
    userId,
    type,
    consumedAt: null,
    expiresAt: { $gt: new Date() }
  });
}

// Tiêu thụ token khi đã xác minh
async function consumeToken(userId, codeOrTokenHash, type) {
  const query =
    type === 'verify_phone'
      ? { userId, code: codeOrTokenHash, consumedAt: null }
      : { userId, tokenHash: codeOrTokenHash, consumedAt: null };

  return await VerificationToken.findOneAndUpdate(
    query,
    { consumedAt: new Date() },
    { new: true }
  )
}

module.exports = {
  createToken,
  findActiveToken,
  consumeToken,
};