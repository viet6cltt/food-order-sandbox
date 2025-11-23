
const admin = require('../config/firebaseConfig');
const UserService = require('./user.service');
const TokenService = require('./token.service');
const EmailService = require('./email.service');
const OauthService = require('./oauth.service');
const authHelper = require('../utils/authHelper');
const tokenConfig = require('../config/token.config');
const UserRepository = require('../repositories/user.repository');
const AuthRepository = require('../repositories/auth.repository');

const HTTP_ERROR = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

class AuthService {
  /**
 * Xử lý đăng ký người dùng sau khi xác minh Firebase OTP thành công
 * @param {string} username 
 * @param {string} password 
 * @param {string} idToken  (Firebase ID Token từ frontend)
 */
  /**
   * Normalize số điện thoại về format chuẩn (+84...)
   */
  normalizePhone(phone) {
    if (!phone) return phone;
    const cleaned = phone.trim();
    // Nếu đã có +84, giữ nguyên
    if (cleaned.startsWith('+84')) {
      return cleaned;
    }
    // Nếu bắt đầu bằng 0, chuyển thành +84
    if (cleaned.startsWith('0')) {
      return `+84${cleaned.substring(1)}`;
    }
    // Nếu bắt đầu bằng 84, thêm dấu +
    if (cleaned.startsWith('84')) {
      return `+${cleaned}`;
    }
    // Mặc định thêm +84
    return `+84${cleaned}`;
  }

  async registerWithFirebase({ username, password, idToken }) {
    //  Xác minh ID token do Firebase gửi về 
    const decoded = await admin.auth().verifyIdToken(idToken);
    let phone = decoded.phone_number;

    if (!phone) {
      throw new HTTP_ERROR.BadRequestError('Phone number not found in Firebase token', ERR.AUTH_MISSING_FIELDS);
    }

    // Normalize số điện thoại từ Firebase (thường đã có format +84...)
    phone = this.normalizePhone(phone);

    // Kiểm tra trùng username / phone (cần normalize phone khi check)
    const existingUser = await UserService.findByUsernameOrPhone(username, phone);
    if (existingUser) {
      throw new HTTP_ERROR.ConflictError('Username or phone already exists', ERR.USER_ALREADY_EXISTS);
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

    return newUser;
  }

  async login(phone, password, deviceInfo) {
    // Normalize số điện thoại để tìm user (hỗ trợ cả +84 và 0)
    const normalizedPhone = this.normalizePhone(phone);
    
    // Kiem tra tai khoan (repository đã xử lý tìm kiếm với cả 2 format)
    const user = await UserService.findByPhone(normalizedPhone);
    
    if (!user) {
      throw new HTTP_ERROR.UnauthorizedError('Account with this phone does not exist', ERR.AUTH_INVALID_CREDENTIALS);
    }

    // Kiem tra mat khau
    const isMatch = authHelper.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new HTTP_ERROR.UnauthorizedError('Wrong password', ERR.AUTH_INVALID_CREDENTIALS);
    }

    // Create token
    const accessToken = authHelper.generateAccessToken(user._id);

    await AuthRepository.revokeSessionByUserId(user._id);

    const { refreshToken, refreshTokenId } = authHelper.generateRefreshToken(user._id);
    await AuthRepository.createAuthSession({
      userId: user._id,
      refreshTokenId: refreshTokenId,
      device: deviceInfo,
      expiresAt: tokenConfig.calculateExpiresAt(tokenConfig.getTokenConfig().REFRESH.expiry)
    });


    return {
      user,
      accessToken,
      refreshToken
    }

  }

  // được gọi khi không login bình thường
  async generateTokensForUser(userId, deviceInfo = {}) {
    const user = await UserService.findById(userId);
    if (!user) throw new HTTP_ERROR.UnauthorizedError('Account does not exist', ERR.AUTH_INVALID_CREDENTIALS);

    const accessToken = authHelper.generateAccessToken(user._id);

    const { refreshToken, refreshTokenId } = authHelper.generateRefreshToken(user._id);

    await AuthRepository.createAuthSession({
      userId,
      refreshTokenId,
      device: deviceInfo,
      expiresAt: tokenConfig.calculateExpiresAt(tokenConfig.getTokenConfig().REFRESH.expiry)
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  async refreshAccessToken(refreshToken) {
      const decoded = authHelper.verifyRefreshToken(refreshToken);
      if (!decoded) throw new HTTP_ERROR.UnauthorizedError('Missing refresh token', ERR.AUTH_INVALID_REFRESH_TOKEN);

      const session = await AuthRepository.findValidSessionByTokenId(decoded.refreshTokenId);
      if (!session) {
        throw new HTTP_ERROR.UnauthorizedError(
          'Session expired or revoked',
          ERR.AUTH_INVALID_REFRESH_TOKEN
        );
      }

      // tạo access token mới
      const newAccessToken = authHelper.generateAccessToken(decoded.userId);

      return newAccessToken;

  }

  async logout(refreshToken) {
      const decoded = authHelper.verifyRefreshToken(refreshToken);
      if (!decoded?.refreshTokenId) {
        throw new HTTP_ERROR.UnauthorizedError(
          'Invalid Refresh Token',
          ERR.AUTH_INVALID_REFRESH_TOKEN
        );
      }

      await AuthRepository.revokeSession(decoded.refreshTokenId)
      return true;
  }

  async sendEmailVerification(userId, email) {
    // kiểm tra user
    const user = await UserRepository.findById(userId);
    if (!user) throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);

    // lưu email tạm thời chưa verify
    await UserRepository.updateEmail(userId, email);

    const token = await TokenService.createEmailVerificationToken(userId, email);
    if (!token) {
      throw new HTTP_ERROR.UnprocessableEntityError(
        'Failed to create verification token',
        ERR.TOKEN_GENERATION_FAILED
      );
    }

    // gui email
    await EmailService.sendVerifyEmail(user, token);

    return true;
  }

  async verifyEmailToken(token) {
    const decoded = authHelper.verifyEmailVerificationToken(token);
    if (!decoded) {
      throw new HTTP_ERROR.BadRequestError(
        'Invalid or expired verification token',
        ERR.AUTH_INVALID_TOKEN
      );
    }
    const { userId, email } = decoded;
    
    // kiểm tra token hợp lệ không
    await TokenService.verifyEmailVerificationToken(userId);

    // cập nhật trạng thái email
    await UserService.markEmailVerified(userId, email);

    return { userId, email, message: 'Email verified successfully' };
  }

  async sendPasswordResetRequest(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new HTTP_ERROR.NotFoundError('No account found with this email', ERR.USER_NOT_FOUND);
    if (!user.emailVerifiedAt) {
      throw new HTTP_ERROR.UnprocessableEntityError(
        'Email is not verified yet',
        ERR.AUTH_EMAIL_NOT_VERIFIED
      )
    }

    const token = await TokenService.createResetPasswordToken(user._id);

    if (!token) {
      throw new HTTP_ERROR.UnprocessableEntityError(
        'Failed to create reset password token',
        ERR.TOKEN_GENERATION_FAILED
      );
    }

    await EmailService.sendResetPasswordEmail(user, token);

    return true;
  }

  async resetPassword(token, newPassword) {
    const decoded = authHelper.verifyResetPasswordToken(token);
    if (!decoded) throw new HTTP_ERROR.BadRequestError('Invalid Token', ERR.AUTH_INVALID_TOKEN);

    const { userId } = decoded;

    await TokenService.verifyResetPasswordToken(userId);

    await UserService.resetPassword(userId, newPassword);

    // revoke authsession(refresh token)
    await AuthRepository.revokeAllSessionsForUser(userId);

    return true;
  }

  getOauthUrl(provider, returnUrl) {
    if (!provider) {
      throw new HTTP_ERROR.BadRequestError('Missing provider', ERR.AUTH_MISSING_FIELDS);
    }
    return OauthService.buildAuthUrl(provider, returnUrl);
  }

  parseAndVerifyState(state) {
    return OauthService.parseAndVerifyState(state);
  }

  async completeProfile(userId, phone, username, password, deviceInfo) {
    const user = await UserService.findById(userId);
    if (!user) {
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    }

    const existed = await UserService.findByPhone(phone);
    if (existed) {
      throw new HTTP_ERROR.ConflictError('Phone already registered', ERR.RESOURCE_CONFLICT);
    }

    const passwordHash = await authHelper.hashPassword(password);

    const updatedUser = await UserService.updateUser(userId, {
      phone,
      passwordHash,
      username: username || user.username,
      status: 'active',
      phoneVerifiedAt: new Date(),
    });

    const { accessToken, refreshToken } = await this.generateTokensForUser(userId, deviceInfo);

    return {
      user: updatedUser,
      accessToken,
      refreshToken,
    };
  }
}


module.exports = new AuthService();