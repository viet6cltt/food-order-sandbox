const AuthService = require('../services/auth.service');
const passport = require('passport');
const ERR = require('../constants/errorCodes');
const SUCCESS_RESPONSE = require('../utils/successResponse');
const HTTP_ERROR = require('../utils/httpErrors');


class AuthController {
  // [GET] /
  async index(req, res, next) {

  }
  // [POST] /register
  async register(req, res, next) {
    // chưa rõ logic với firebase - đợi fe
    const { username, password, idToken } = req.body;

    if (!username || !password || !idToken) {
      return res.status(400).json({});
    }

    try {
      const user = await AuthService.registerWithFirebase({ username, password, idToken });
      return {
        user
      }
    } catch (err) {
      next(err);
    }
    
  }

  // [POST] /login
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return SUCCESS_RESPONSE.success(res, 'Login successfully', {
        accessToken,
        user: { id: user._id, username: user.username, phone: user.phone },
      })
    } catch (err) {
      next(err);
    }
  }

  // [POST] /refresh 
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

  // [POST] /logout
  async logout(req, res, next) {
    const  refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HTTP_ERROR.BadRequestError('No refresh token provided', ERR.AUTH_MISSING_REFRESH_TOKEN);
    }

    await AuthService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return SUCCESS_RESPONSE.success(res, 'Logged out successfully', {});
  }

  // [POST] /verification-email
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

  // [GET] /verify-email
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

  // [POST] password-reset-request
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

  // [POST] password-reset
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token) {
        throw new HTTP_ERROR.BadRequestError('Missing token', ARR.AUTH_MISSING_TOKEN);
      }

      if (!newPassword) {
        throw new HTTP_ERROR.BadRequestError('Missing newPassword', ARR.AUTH_MISSING_FIELDS);
      }

      await AuthService.resetPassword(token, newPassword);

      return SUCCESS_RESPONSE.success(res, 'Password has been reset successfully', {});
    } catch (err) {
      next(err);
    }
  }

  // [GET] /oauth-url?provider=[provider]&returnUrl=[returnUrl]
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

  // [GET] /:provider/callback
  async oauthCallback(req, res, next) {
    try {
      const { provider } = req.params;

      return passport.authenticate(provider, { session: false }, async (err, userData, info) => {
        console.log('authenticating...');
        try {
          // lỗi từ strategy
          if (err) {
            throw new HTTP_ERROR.UnauthorizedError(
              err.message || 'OAuth authentication failed',
              ERR.AUTH_INVALID_CREDENTIALS
            );
          }

          // người dùng hủy hoặc provider trả lỗi
          if (!userData) {
            const { error, error_description } = req.query;
            throw new HTTP_ERROR.UnauthorizedError(
              error_description || error || info?.message || 'OAuth login failed',
              ERR.AUTH_INVALID_CREDENTIALS
            );
          }

          // Verify state
          const { state } = req.query;
          const st = AuthService.parseAndVerifyState(state);

          if (!st) throw new HTTP_ERROR.BadRequestError('Invalid OAuth state', ERR.BAD_OAUTH_STATE);

          if (st.provider !== provider) throw new HTTP_ERROR.BadRequestError('Provider mismatch', ERR.PROVIDER_MISMATCH);

          const { status, userId } = userData;

          // Nếu user cần bổ sung thông tin
          if (status === ERR.REQUIRE_PHONE_USERNAME_PASSWORD) {
            return SUCCESS_RESPONSE.accepted(
              res, 
              ERR.REQUIRE_PHONE_USERNAME_PASSWORD,
              'Please complete your profile to continue'
            );
          }

          // nếu đầy đủ -> cấp token
          const deviceInfo = {
            userAgent: req.headers['user-agent'] || 'unknown',
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          };

          const { user, accessToken, refreshToken } = await AuthService.generateTokensForUser(userId, deviceInfo);

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
            
          return SUCCESS_RESPONSE.success(res, 'Login successfully via OAuth', {
            accessToken,
            user: {
              id: user._id,
              username: user.username,
              phone: user.phone,
            }
          });
        } catch (innerErr) {
          next(innerErr);
        }
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  // [POST] /complete-profile
  async completeProfile(req, res, next) {
    try {
      const { userId, phone, username, password } = req.body;

      if (!userId || !phone || !username || !password) {
        throw new HTTP_ERROR.BadRequestError('Missing userId, phonem username or password', ERR.AUTH_MISSING_FIELDS);
      }

      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      };

      const { user, accessToken, refreshToken } = await AuthService.completeProfile(userId, phone, username, password, deviceInfo);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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