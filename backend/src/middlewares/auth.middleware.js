const authHelper = require('../utils/authHelper');
const HTTP_ERROR = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HTTP_ERROR.UnauthorizedError('Missing access Token', ERR.AUTH_MISSING_ACCESS_TOKEN));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authHelper.verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch(err) {
    return next(new HTTP_ERROR.UnauthorizedError('Invalid or expired token', ERR.AUTH_INVALID_TOKEN));
  }
}

const optinalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = authHelper.verifyAccessToken(token);
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return next();
  }
}

module.exports = { requireAuth, optinalAuth };