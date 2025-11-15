
const TokenRepository = require('../repositories/token.repository');
const UserRepository = require('../repositories/user.repository');
const authHelper = require('../utils/authHelper');

const HTTP_ERROR = require('../utils/httpErrors');
const ERR = require('../constants/errorCodes');

class UserService {
  async createUser(data) {
    return await UserRepository.createUser(data);
  }

  async findByUsernameOrPhone(username, phone) {
    return await UserRepository.findByUsernameOrPhone(username, phone);
  }

  async findByPhone(phone) {
    return await UserRepository.findByPhone(phone);
  }

  async findByEmail(email) {
    return await UserRepository.findByEmail(email);
  }

  async findByProviderId(provider, providerId) {
    return await UserRepository.findByProviderId(provider, providerId);
  }

  async findById(userId) {
    return await UserRepository.findById(userId);
  }

  async updateUserProfile(userId, updates) {
    if (!updates || typeof updates !== "object") {
      throw new HTTP_ERROR.BadRequestError('Invalid request body', ERR.USER_INVALID_UPDATE_FIELDS);
    }

    const allowedFields = [
      "firstname",
      "lastname",
      "avatarUrl",
      "dateOfBirth",
      "address",
    ];

    const cleanUpdates = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    }

    // Validate address.geo (cập nhật sau)

    const updatedUser = await UserRepository.updateUser(userId, cleanUpdates);

    if (!updatedUser) {
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    }

    return updatedUser;

  }
  async updateUser(userId, data) {
    const updatedUser = await UserRepository.updateUser(userId, data);
    if (!updatedUser)
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    return updatedUser;
  }

  async markPhoneVerified(userId) {
    const updatedUser = await UserRepository.updateUser(userId, {
      phoneVerifiedAt: new Date()
    });
    if (!updatedUser)
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    return updatedUser;
  }

  async markEmailVerified(userId, email) {
    const user = await UserRepository.findById(userId);
    if (!user)
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);

    if (user.email !== email) {
      throw new HTTP_ERROR.ConflictError(
        'Email mismatch - cannot verify this email',
        ERR.USER_EMAIL_MISMATCH
      );
    }

    // nếu đã verify rồi thì bỏ qua
    if (user.emailVerifiedAt) return user;

    const verifiedUser = await UserRepository.verifyEmail(userId);
    if (!verifiedUser)
      throw new HTTP_ERROR.NotFoundError('User not found after update', ERR.USER_NOT_FOUND);

    return verifiedUser;
  }

  

  async resetPassword(userId, newPassword) {
    if (!newPassword) {
      throw new HTTP_ERROR.BadRequestError(
        'Password is missing',
        ERR.AUTH_MISSING_FIELDS
      );
    }

    const passwordHash = await authHelper.hashPassword(newPassword);
    const updatedUser = await UserRepository.updateUser(userId, { passwordHash });

    if (!updatedUser)
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);

    return updatedUser;
  }

  

  async updateProviderById(userId, providerObject) {
    const updatedUser = await UserRepository.updateProviderById(userId, providerObject);
    if (!updatedUser)
      throw new HTTP_ERROR.NotFoundError('User not found', ERR.USER_NOT_FOUND);
    return updatedUser;
  }
}


module.exports = new UserService();