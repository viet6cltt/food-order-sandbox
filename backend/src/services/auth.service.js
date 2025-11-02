const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseConfig');
const UserService = require('./user.service');
const AuthRepository = require('../repositories/auth.repository');
const authHelper = require('../utils/authHelper');
const tokenConfig = require('../config/token.config');


class AuthService {
  /**
 * Xử lý đăng ký người dùng sau khi xác minh Firebase OTP thành công
 * @param {string} username 
 * @param {string} password 
 * @param {string} idToken  (Firebase ID Token từ frontend)
 */
  async registerWithFirebase({ username, password, idToken }) {
    //  Xác minh ID token do Firebase gửi về 
    const decoded = await admin.auth().verifyIdToken(idToken);
    const phone = decoded.phone_number;

    if (!phone) {
      throw new Error('Phone number not found in Firebase token');
    }

    // Kiểm tra trùng username / phone
    const existingUser = await UserService.findByUsernameOrPhone(username, phone);
    if (existingUser) {
      throw new Error('Username or phone already exists');
    }

    // Hash password
    const passwordHash = await authHelper.hashPassword(password);

    // Tạo user mới (đã verify sẵn số điện thoại)
    const newUser = await UserService.createUser({
      username,
      passwordHash,
      phone,
      phoneVerifiedAt: new Date(),
      providers: [{ provider: 'firebase' }],
    });

    // 5️⃣ Trả response
    return {
      success: true,
      message: 'User registered & verified via Firebase',
      data: {
        username,
        phone,
      },
    };
  }

  async login(phone, password, deviceInfo) {
    // Kiem tra tai khoan
    const user = await UserService.findByPhone(phone);
    if (!user) {
      throw new Error('The phone number does not exist');
    }

    // Kiem tra mat khau
    const isMatch = authHelper.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Wrong password');
    }

    // Create token
    const accessToken = authHelper.generateAccessToken(user._id);

    const refreshToken = authHelper.generateRefreshToken(user._id);
    await AuthRepository.createAuthSession({
      userId: user._id,
      refreshTokenHash: refreshToken,
      device: deviceInfo,
      expiresAt: tokenConfig.calculateExpiresAt(tokenConfig.getRefreshTokenExpiry())
    });


    return {
      user,
      accessToken,
      refreshToken
    }

  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = authHelper.verifyRefreshToken(refreshToken);

      const session = await AuthRepository.findValidSessionByUserId(decoded.userId);
      if (!session) {
        throw new Error('Session expired or revoked');
      }

      // tạo access token mới
      const newAccessToken = authHelper.generateAccessToken(decoded.userId);

      return newAccessToken;
    } catch (err) {
      console.error('Refresh token failed:', err.message);
      throw new Error('Invalid or expired refresh token');
    }
  }
}


module.exports = new AuthService();