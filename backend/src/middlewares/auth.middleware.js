const authHelper = require('../utils/authHelper');
const HTTP_ERROR = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
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
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    next();
  }

  const token = authHeader.split(' ')[1];
  try{
    const decoded = authHelper.verifyAccessToken(token);
    req.userId = decoded.userId;
  } catch (err) {
    // khi có token nhưng token không hợp lệ
    next(); // vẫn cho qua
  }
}

module.exports = { requireAuth, optinalAuth };