const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @description Hashing password 
 * @param {string} password 
 * @param {Int} saltRounds 
 * @returns 
 */
async function hashPassword(password, saltRounds = 10) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

/**
 * @description So sánh mật khẩu 
 * @param {string} password
 * @param {string} hashedPassword 
 * @returns {boolean}
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * @description Tạo 1 refresh token mạnh, ngẫu nhiên
 * @returns {string} Refresh token chưa băm
 */
function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { hashPassword, comparePassword, generateRefreshToken, hashRefreshToken };