const authHelper = require("../utils/authHelper");
const HTTP_ERROR = require("../utils/httpErrors");
const ERR = require('../constants/errorCodes');

const requireAdmin = (req, res, next) => {
  // yêu cầu requireAuth đã chạy
  if (!req.role) {
    return next(new HTTP_ERROR.ForbiddenError(
      'Role information missing',
      ERR.AUTH_PERMISSON_DENIED
    ));
  }

  if (req.role !== 'admin') {
    return next(new HTTP_ERROR.ForbiddenError(
      'Admin permission required',
      ERR.AUTH_PERMISSON_DENIED
    ));
  }

  return next();
}

module.exports = { requireAdmin };
