const authHelper = require('../utils/authHelper');
const HTTP_ERROR = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');
const redisService = require('@/services/redis.service');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HTTP_ERROR.UnauthorizedError('Missing access Token', ERR.AUTH_MISSING_ACCESS_TOKEN));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authHelper.verifyAccessToken(token);
    // 1. CHẶN ĐẦU: Kiểm tra Redis BlackList (cho logout)
    const isRevoked = await redisService.isBlacklisted(token);
    if (isRevoked) {
      return next(new HTTP_ERROR.UnauthorizedError('Token has been revoked/logged out'));
    }

    // 2. Kiểm tra THEO USER (khi đổi role)
    const isForceRefresh = await redisService.shouldForceRefresh(decoded.userId);
    if (isForceRefresh) {
      // xóa cờ để sau khi refresh thì họ vào đc
      await redisService.deleteForceRefresh(decoded.userId);

      return next(new HTTP_ERROR.UnauthorizedError('Role changed. Please refresh token'));
    }
    
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.token = token; // lưu lại token gốc
    req.tokenExp = decoded.exp; // Lưu lại thời điểm hết hạn

    console.log(req.role, req.userId);
    next();
  } catch(err) {
    return next(new HTTP_ERROR.UnauthorizedError('Invalid or expired token', ERR.AUTH_INVALID_TOKEN));
  }
}

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = authHelper.verifyAccessToken(token);
    req.userId = decoded.userId;
    req.role = decoded.role;
    return next();
  } catch (err) {
    return next();
  }
}

module.exports = { requireAuth, optionalAuth };