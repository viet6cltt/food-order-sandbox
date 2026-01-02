const HTTP_ERROR = require('@/utils/httpErrors');
const ERR = require('../constants/errorCodes');
const { UserStatus } = require('@/constants/user.constants');
const userRepository = require('@/repositories/user.repository');
/**
 * Middlewares kiểm tra trạng thái tài khoản
 * Đảm bảo user không bị 'banned' trước khi thực hiện hành động
 */

const checkUserStatus = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new HTTP_ERROR.UnauthorizedError('Unauthorized', ERR.AUTH_INVALID_TOKEN);
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    }

    // Check status
    if (user.status === UserStatus.BANNED) {
      throw new HTTP_ERROR.ForbiddenError(
        'Your account is banned. You can not access this page',
        ERR.USER_BANNED
      );
    }

    // cho đi tiếp
    next();
  } catch (err) { 
    next(err);
  }
}

module.exports = { checkUserStatus };