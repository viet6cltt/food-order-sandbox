const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const tokenConfig = require('../config/token.config');

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
 * @description Hàm chung để tạo JWT cho mọi mục đích (Access, Refresh, Verify Email, etc.)
 * @param {string} userId - ID của người dùng
 * @param {object} tokenTypeConfig - Cấu hình token (type, secret, expiry)
 * @param {object} [additionalPayload={}] - Các trường bổ sung cần thêm vào payload
 * @returns {string | {token: string, identifier: string}} - Trả về token hoặc object (nếu là Refresh)
 */
function generateToken(userId, tokenTypeConfig, additionalPayload = {}) {
  const payload = {
    userId: userId,
    type: tokenTypeConfig.type,
    ...additionalPayload,
  };

  const token = jwt.sign(payload, tokenTypeConfig.secret, { expiresIn: tokenTypeConfig.expiry });

  // Xử lí đặc biệt cho Refresh Token
  if (tokenTypeConfig.type === 'refresh' && additionalPayload.refreshTokenId) {
    return { refreshToken: token, refreshTokenId: additionalPayload.refreshTokenId };
  }

  return token;
}

/**
 * @description Hàm chung để xác minh JWT cho mọi mục đích
 * @param {string} token
 * @param {object} tokenTypeConfig - Cấu hình token (type, secret)
 * @returns {object | null} - Payload đã giải mã nếu hợp lệ, ngược lại là null
 */
function verifyToken(token, tokenTypeConfig) {
  const decoded = jwt.verify(token, tokenTypeConfig.secret);

  if (decoded.type !== tokenTypeConfig.type) {
    throw new Error(`Invalid token type`);
  }

  return decoded;
}

function generateRefreshToken(userId) {
    const refreshTokenId = uuidv4(); 
    const config = tokenConfig.getTokenConfig().REFRESH;

    return generateToken(userId, config, { refreshTokenId });
}

function generateAccessToken(userId) {
    const config = tokenConfig.getTokenConfig().ACCESS;
    return generateToken(userId, config);
}

function verifyRefreshToken(token) {
    const config = tokenConfig.getTokenConfig().REFRESH;
    return verifyToken(token, config);
}

function verifyAccessToken(token) {
    const config = tokenConfig.getTokenConfig().ACCESS;
    return verifyToken(token, config);
}

function generateEmailVerificationToken(userId, email) {
    const config = tokenConfig.getTokenConfig().EMAIL_VERIFY;
    return generateToken(userId, config, { email });
}

function verifyEmailVerificationToken(token) {
    const config = tokenConfig.getTokenConfig().EMAIL_VERIFY;
    return verifyToken(token, config);
}

function generateResetPasswordToken(userId) {
  const config = tokenConfig.getTokenConfig().RESET_PASSWORD;
  return generateToken(userId, config);
}

function verifyResetPasswordToken(token) {
  const config = tokenConfig.getTokenConfig().RESET_PASSWORD;
  return verifyToken(token, config);
}

function generateOauthToken(payloadData) {
    const config = tokenConfig.getTokenConfig().OAUTH_LINK;
    
    const payload = {
        type: config.type,
        ...payloadData, 
    };

    const token = jwt.sign(payload, config.secret, { expiresIn: config.expiry });
    
    return token;
}

function verifyOauthToken(token) {
    const config = tokenConfig.getTokenConfig().OAUTH_LINK;
    return verifyToken(token, config);
}

module.exports = { 
  hashPassword,
  comparePassword, 
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
  generateOauthToken, 
  verifyOauthToken,
};
