const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseConfig');
const UserService = require('./user.service');
const AuthRepository = require('../repositories/auth.repository');
const authHelper = require('../utils/authHelper');

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

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
    const isMatch = await authHelper.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Wrong password');
    }

    // Create token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = authHelper.hashRefreshToken(authHelper.generateRefreshToken());
    await AuthRepository.createAuthSession({
      userId: user._id,
      refreshTokenHash: refreshToken,
      device: deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });


    return {
      user,
      accessToken,
      refreshToken
    }

  }
}


module.exports = new AuthService();