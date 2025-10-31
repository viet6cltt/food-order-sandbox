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
      const { phone, password, platform = 'web', deviceId = null } = req.body;

      const deviceInfo = {
        deviceId,
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        platform,
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
}


module.exports = new AuthController();