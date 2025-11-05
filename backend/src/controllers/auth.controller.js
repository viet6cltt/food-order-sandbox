const AuthService = require('../services/auth.service');

class AuthController {
  // [GET] /
  async index(req, res, next) {

  }
  // [POST] /register
  async register(req, res, next) {
    const { username, password, idToken } = req.body;

    if (!username || !password || !idToken) {
      return res.status(400).json({ error: 'username, password, and idToken are required' });
    }

    try {
      const result = await AuthService.registerWithFirebase({ username, password, idToken });
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
    
  }

  // [POST] /login
  async login(req, res, next) {
    try{
      const { phone, password } = req.body;

      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      };

      const { user, accessToken, refreshToken } = await AuthService.login(phone, password, deviceInfo);

      return res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
          message: 'Login successfully',
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone
          }
        });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /refresh 
  async refreshAccessToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Missing refresh token' });
      }

      const newAccessToken = await AuthService.refreshAccessToken(refreshToken);

      return res.status(200).json({ accessToken: newAccessToken});
    } catch (err) {
      return res.status(403).json({ message: err.message });
    }
  }

  // [POST] /logout
  async logout(req, res, next) {
    const  refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No token provided' });
    }

    await AuthService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // [POST] /verification-email
  async sendEmailVerification(req, res, next) {
    try {
      const { email } = req.body;
      const userId = req.user?.userId;
      console.log('req.body:', req.body);

      if (!email || !userId) {
        return res.status(400).json({ error: 'Missing email or userId' });
      }

      await AuthService.sendEmailVerification(userId, email);
      return res.status(200).json({ message: 'If the email exists, we have sent a verification email.' });
    } catch (err) {
      next(err);
    }
  } 

  // [GET] /verify-email
  async verifyEmailToken(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Missing token' });
      }

      await AuthService.verifyEmailToken(token);
      return res.status(200).json({ success: true, message: 'Email verified successfully!' });
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
        return res.status(400).json({ error: 'No email was sended'});
      }

      await AuthService.sendPasswordResetRequest(email);

      res.status(200).json({
        message: 'Password reset email sent successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // [POST] password-reset
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Missing token or new password' });
      }

      await AuthService.resetPassword(token, newPassword);

      return res.status(200).json({ message: 'Password has been reset successfully' });
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
      return res.status(200).json({ message: 'Get Oauth Url successfully', url: url });
    } catch (err) {
      next(err);
    }
  }
}


module.exports = new AuthController();