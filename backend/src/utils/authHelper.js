const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const tokenConfig = require('../config/token.config');

const REFRESH_TYPE = 'refresh';
const ACCESS_TYPE = 'access';

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
 * @description Tạo 1 refresh token dưới dạng JWT
 * @param {string} userId - ID của người dùng
 * @returns {string} Refresh token chưa băm đã được ký
 */
function generateRefreshToken(userId) {
  const payload = {
    userId: userId,
    type: REFRESH_TYPE
  }

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: tokenConfig.getRefreshTokenExpiry()});

  return token;
}

function generateAccessToken(userId) {
  const payload = {
    userId: userId,
    type: ACCESS_TYPE
  }

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: tokenConfig.getAccessTokenExpiry() });

  return token;
}

/**
 * 
 * @param {string} token
 * @returns {string} payload 
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== REFRESH_TYPE) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    console.error("Refresh Token Verification Failed:", error.message);
    return null;
  }
}

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.type !== ACCESS_TYPE) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (err) {
    console.error("Access Token Verification Failed:", err.message);
    return null;
  }
}

module.exports = { 
  hashPassword,
  comparePassword, 
  generateRefreshToken, 
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken
};
