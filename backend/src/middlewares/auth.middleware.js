const authHelper = require('../utils/authHelper');

const authMiddleware = (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Xác thực token
    const decoded = authHelper.verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      //other
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }

}

module.exports = authMiddleware;