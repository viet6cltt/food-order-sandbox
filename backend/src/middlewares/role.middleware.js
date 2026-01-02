const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
/**
 * cho phép các role được chỉ định
 * @param  {...any} allowedRoles 
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userId) {
      return next(
        new ERR_RESPONSE.UnauthorizedError(
          'Authentication required',
          ERR.AUTH_UNAUTHORIZED
        )
      );
    }

    if (!allowedRoles.includes(req.role)) {
      return next(
        new ERR_RESPONSE.ForbiddenError(
          "You do not have permission",
          ERR.AUTH_PERMISSION_DENIED
        )
      );
    }

    next();
  };
};

const requireAdmin = requireRole('admin');
const requireRestaurantOwnerRole = requireRole('restaurant_owner');

module.exports = {
  requireRole,
  requireAdmin,
  requireRestaurantOwnerRole,
};