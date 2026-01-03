
const TokenRepository = require('@/repositories/token.repository');
const UserRepository = require('@/repositories/user.repository');
const authHelper = require('@/utils/authHelper');

const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const geocodeService = require('./geocode.service');

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
    if (data && typeof data === 'object' && data.address && typeof data.address === 'object') {
      const coords = data.address?.geo?.coordinates;
      const hasValidCoords =
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number' &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]) &&
        !(coords[0] === 0 && coords[1] === 0);

      if (!hasValidCoords) {
        const street = typeof data.address.street === 'string' ? data.address.street.trim() : '';
        const ward = typeof data.address.ward === 'string' ? data.address.ward.trim() : '';
        const city = typeof data.address.city === 'string' ? data.address.city.trim() : '';
        const query = [street, ward, city].filter(Boolean).join(', ');
        if (query) {
          const { lat, lng, formatted } = await geocodeService.geocodeAddress(query);
          data.address.geo = {
            ...(data.address.geo || {}),
            type: 'Point',
            coordinates: [lng, lat],
          };

          if (!street && formatted) {
            data.address.street = formatted;
          }
        }
      }
    }

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