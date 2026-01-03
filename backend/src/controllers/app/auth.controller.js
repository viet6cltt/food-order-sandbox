const AuthService = require('@/services/app/auth.service');
const passport = require('passport');
const ERR = require('@/constants/errorCodes');
const SUCCESS_RESPONSE = require('@/utils/successResponse');
const HTTP_ERROR = require('@/utils/httpErrors');
const redisService = require('@/services/redis.service');


class AuthController {
  /**
   * @swagger
   * /auth:
   *   get:
   *     summary: Health check
   *     description: Check if auth endpoint is active
   *     tags:
   *       - Auth
   *     responses:
   *       200:
   *         description: Auth service is active
   */
  async index(req, res, next) {

  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register new user with Firebase
   *     description: Create a new user account using Firebase authentication
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *               - role
   *               - idToken
   *             properties:
   *               username:
   *                 type: string
   *                 example: "john_doe"
   *               password:
   *                 type: string
   *                 example: "SecurePass123"
   *               role:
   *                 type: string
   *                 enum: [customer, restaurant_owner]
   *                 example: "customer"
   *               idToken:
   *                 type: string
   *                 description: Firebase ID token
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Missing required fields
   *       409:
   *         description: User already exists
   */
  async register(req, res, next) {
    try {
      const { username, password, role, idToken } = req.body;

      if (!username || !password || !idToken) {
        throw new HTTP_ERROR.BadRequestError('Missing username, password, role or idToken', ERR.AUTH_MISSING_FIELDS);
      }

      const user = await AuthService.registerWithFirebase({ username, password, role, idToken });
      

      return SUCCESS_RESPONSE.created(res, 'User registered successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     description: Authenticate user with phone and password
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phone
   *               - password
   *             properties:
   *               phone:
   *                 type: string
   *                 example: "0912345678"
   *               password:
   *                 type: string
   *                 example: "SecurePass123"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       400:
   *         description: Missing phone or password
   *       401:
   *         description: Invalid credentials
   */
  async login(req, res, next) {
    try{
      const { phone, password } = req.body;

      if (!phone || !password) {
        throw new HTTP_ERROR.BadRequestError('Phone and password are required', ERR.AUTH_MISSING_FIELDS);
      }

      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      };

      const { user, accessToken, refreshToken } = await AuthService.login(phone, password, deviceInfo);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const safeUser = {
        id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl ? user.avatarUrl : user.providers?.[0]?.avatarUrl,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        role: user.role
      }

      return SUCCESS_RESPONSE.success(res, 'Login successfully', {
        accessToken,
        user: safeUser,
      })
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     description: Get a new access token using refresh token from cookies
   *     tags:
   *       - Auth
   *     responses:
   *       200:
   *         description: Access token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *       403:
   *         description: Invalid or expired refresh token
   */
  async refreshAccessToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new HTTP_ERROR.UnauthorizedError('Missing refresh token', ERR.AUTH_MISSING_REFRESH_TOKEN);
      }

      const accessToken = await AuthService.refreshAccessToken(refreshToken);

      return SUCCESS_RESPONSE.success(res, 'Refresh successful', { accessToken });
    } catch (err) {
      return res.status(403).json({ message: err.message });
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     description: Logout and invalidate tokens
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const accessToken = req.token;
      const accessTokenExp = req.tokenExp;

      // 1. Blacklist accessToken
      if (accessToken && accessTokenExp) {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = accessTokenExp - now;
        if (timeLeft > 0) {
          await redisService.setBlacklist(accessToken, timeLeft);
        }
      }

      // 2. Handle RefreshToken
      if (refreshToken) {
        await AuthService.logout(refreshToken);
        res.clearCookie('refreshToken');
      }

      return SUCCESS_RESPONSE.success(res, 'Logged out successfully', {});
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/verification-email:
   *   post:
   *     summary: Send email verification
   *     description: Send verification email to user
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *     responses:
   *       200:
   *         description: Verification email sent
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Missing email
   *       401:
   *         description: Unauthorized - Missing access token
   */
  async sendEmailVerification(req, res, next) {
    try {
      const { email } = req.body;
      const userId = req.userId;

      if (!email) {
        throw new HTTP_ERROR.BadRequestError('No email are provided', ERR.AUTH_MISSING_FIELDS);
      }

      if (!userId) {
        throw new HTTP_ERROR.UnauthorizedError('No accessToken are provided', ERR.AUTH_MISSING_ACCESS_TOKEN);
      }

      await AuthService.sendEmailVerification(userId, email);
      return SUCCESS_RESPONSE.success(res, 'If the email exists, we have sent a verification email.', {});
    } catch (err) {
      next(err);
    }
  } 

  /**
   * @swagger
   * /auth/verify-email:
   *   get:
   *     summary: Verify email token
   *     description: Verify user email with token from verification email
   *     tags:
   *       - Auth
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Verification token from email
   *     responses:
   *       200:
   *         description: Email verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Missing or invalid token
   */
  async verifyEmailToken(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        throw new HTTP_ERROR.BadRequestError('Missing token', ERR.AUTH_MISSING_TOKEN);
      }

      await AuthService.verifyEmailToken(token);
      return SUCCESS_RESPONSE.success(res, 'Email verified successfully!', {});
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/password-reset-request:
   *   post:
   *     summary: Request password reset
   *     description: Send password reset email to user
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *     responses:
   *       200:
   *         description: Password reset email sent
   *       400:
   *         description: Missing email
   *       401:
   *         description: Unauthorized
   */
  async sendPasswordResetRequest(req, res, next) {
    try {
      let { email } = req.body;
      email = email.trim();

      if (!email || email === '') {
        throw new HTTP_ERROR.BadRequestError('Email is required', ERR.AUTH_MISSING_FIELDS);
      }

      await AuthService.sendPasswordResetRequest(email);

      return SUCCESS_RESPONSE.success(res, 'Password reset email sent successfully', {});
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/password-reset:
   *   post:
   *     summary: Reset password
   *     description: Reset user password with token from reset email
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *                 description: Password reset token from email
   *               newPassword:
   *                 type: string
   *                 example: "NewSecurePass123"
   *     responses:
   *       200:
   *         description: Password reset successfully
   *       400:
   *         description: Missing token or newPassword
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token) {
        throw new HTTP_ERROR.BadRequestError('Missing token', ERR.AUTH_MISSING_TOKEN);
      }

      if (!newPassword) {
        throw new HTTP_ERROR.BadRequestError('Missing newPassword', ERR.AUTH_MISSING_FIELDS);
      }

      await AuthService.resetPassword(token, newPassword);

      return SUCCESS_RESPONSE.success(res, 'Password has been reset successfully', {});
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/oauth-url:
   *   get:
   *     summary: Get OAuth provider URL
   *     description: Get redirect URL for OAuth provider (Google, Facebook)
   *     tags:
   *       - Auth
   *     parameters:
   *       - in: query
   *         name: provider
   *         required: true
   *         schema:
   *           type: string
   *           enum: [google, facebook]
   *         description: OAuth provider name
   *       - in: query
   *         name: returnUrl
   *         schema:
   *           type: string
   *         description: URL to redirect after OAuth callback (optional)
   *     responses:
   *       200:
   *         description: OAuth URL generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     url:
   *                       type: string
   *                       example: "https://accounts.google.com/o/oauth2/v2/auth?..."
   *       400:
   *         description: Missing provider
   */
  async getOauthUrl(req, res, next) {
    try { 
      const { provider, returnUrl } = req.query;
      if (!provider) return res.status(400).json({ error: 'Missing provider' });

      const { url } = AuthService.getOauthUrl(provider, returnUrl);

      console.log(url);

      return SUCCESS_RESPONSE.success(res, 'Get Oauth Url successfully', { url: url });
      
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/{provider}/callback:
   *   get:
   *     summary: OAuth callback handler
   *     description: Handle OAuth provider callback and authenticate user
   *     tags:
   *       - Auth
   *     parameters:
   *       - in: path
   *         name: provider
   *         required: true
   *         schema:
   *           type: string
   *           enum: [google, facebook]
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         description: Authorization code from provider
   *       - in: query
   *         name: state
   *         schema:
   *           type: string
   *         description: State parameter for CSRF protection
   *       - in: query
   *         name: error
   *         schema:
   *           type: string
   *         description: Error from provider (if any)
   *     responses:
   *       200:
   *         description: OAuth login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       202:
   *         description: Profile completion required
   *       400:
   *         description: Invalid OAuth state or provider mismatch
   *       401:
   *         description: OAuth authentication failed
   */
  async oauthCallback(req, res, next) {
    try {
        const { provider } = req.params;

        return passport.authenticate(provider, { session: false }, async (err, userData, info) => {
            try {
                const { state } = req.query;
                const st = AuthService.parseAndVerifyState(state);
                
                // Chuẩn hóa frontendUrl: bỏ dấu gạch chéo ở cuối nếu có để tránh lỗi //
                const rawFrontendUrl = st?.returnUrl  || process.env.APP_URL || 'http://localhost:5173';
                const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

                // 1. Xử lý lỗi
                if (err || !userData) {
                    const errorMsg = encodeURIComponent(err?.message || info?.message || 'OAuth failed');
                    return res.redirect(`${frontendUrl}/login?error=${errorMsg}`);
                }

                if (st.provider !== provider) {
                    return res.redirect(`${frontendUrl}/login?error=provider_mismatch`);
                }

                const { status, userId } = userData;

                // 2. Nếu User cần bổ sung thông tin
                if (status === ERR.REQUIRE_PHONE_USERNAME_PASSWORD) {
                    return res.redirect(`${frontendUrl}/auth/complete-profile?userId=${userId}`);
                }

                // 3. Đăng nhập thành công -> Cấp token
                const deviceInfo = {
                    userAgent: req.headers['user-agent'] || 'unknown',
                    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
                };

                const { accessToken, refreshToken } = await AuthService.generateTokensForUser(userId, deviceInfo);

                // Gửi Refresh Token qua Cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                // 4. CHUYỂN HƯỚNG VỀ FE (SỬ DỤNG ĐỐI TƯỢNG URL ĐỂ CHUẨN HÓA)
                // Cách này tự động xử lý dấu gạch chéo và query string an toàn
                const redirectTarget = new URL('/auth/oauth-success', frontendUrl);
                redirectTarget.searchParams.append('accessToken', accessToken);

                return res.redirect(redirectTarget.toString());

            } catch (innerErr) {
                const rawFrontendUrl = 'http://localhost:5173';
                const frontendUrl = rawFrontendUrl.replace(/\/$/, "");
                res.redirect(`${frontendUrl}/login?error=server_error`);
            }
        })(req, res, next);
    } catch (err) {
        next(err);
    }
  }

  /**
   * @swagger
   * /auth/complete-profile:
   *   post:
   *     summary: Complete user profile after OAuth signup
   *     description: Complete profile for OAuth users who need to provide phone and username
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - phone
   *               - username
   *               - password
   *             properties:
   *               userId:
   *                 type: string
   *                 description: User ID from OAuth
   *               phone:
   *                 type: string
   *                 example: "0912345678"
   *               username:
   *                 type: string
   *                 example: "john_doe"
   *               password:
   *                 type: string
   *                 example: "SecurePass123"
   *     responses:
   *       200:
   *         description: Profile completed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       400:
   *         description: Missing required fields
   */
  async completeProfile(req, res, next) {
    try {
      const { userId, phone, username, password } = req.body;

      if (!userId || !phone || !username || !password) {
        throw new HTTP_ERROR.BadRequestError('Missing userId, phone, username or password', ERR.AUTH_MISSING_FIELDS);
      }

      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      };

      const { user, accessToken, refreshToken } = await AuthService.completeProfile(userId, phone, username, password, deviceInfo);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
        
      return SUCCESS_RESPONSE.success(res, 'Profile completed', {
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          phone: user.phone,
        }
      });
    } catch (err) {
      next(err);
    }
  }
}


module.exports = new AuthController();