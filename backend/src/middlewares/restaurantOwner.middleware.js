const RestaurantRepository = require('@/repositories/restaurant.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
const { UserRole } = require('@/constants/user.constants');

const loadRestaurantAndCheckAuth = async(req) => {
  if (!req.userId) {
    throw new ERR_RESPONSE.UnauthorizedError(
      'Authentication required',
      ERR.AUTH_UNAUTHORIZED
    );
  }

  const { restaurantId } = req.params;
  const restaurant = await RestaurantRepository.getById(restaurantId);

  if (!restaurant) {
    throw new ERR_RESPONSE.NotFoundError(
      'Restaurant not found',
      ERR.RESTAURANT_NOT_FOUND
    );
  }

  return restaurant;
}

/**
 * Check user có phải chủ restaurant không
 * - Phải là restaurant_owner
 * - Restaurant phải tồn tại
 * - Attach restaurant vào req để dùng lại
 */
const requireRestaurantOwner = async (req, res, next) => {
  try {
    const restaurant = await loadRestaurantAndCheckAuth(req);
    
    const isOwner = restaurant.ownerId?.toString() === req.userId.toString();

    if (!isOwner) {
      throw new ERR_RESPONSE.ForbiddenError(
        'Only restaurant owner is allowed',
        ERR.RESTAURANT_NOT_OWNER
      );
    }

    req.restaurant = restaurant;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Check user có phải chủ restaurant hoặc admin không
 * - Phải là restaurant_owner or admin
 * - Restaurant phải tồn tại
 * - Attach restaurant vào req để dùng lại
 */
const requireRestaurantOwnerOrAdmin = async (req, res, next) => {
  try {
    const restaurant = await loadRestaurantAndCheckAuth(req);

    const isOwner = restaurant.ownerId?.toString() === req.userId.toString();
    const isAdmin = req.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ERR_RESPONSE.ForbiddenError(
        'You must be restaurant owner or admin',
        ERR.AUTH_PERMISSION_DENIED
      );
    }

    req.restaurant = restaurant;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireRestaurantOwner, requireRestaurantOwnerOrAdmin };