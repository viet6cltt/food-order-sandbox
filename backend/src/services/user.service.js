const AuthRepository = require('../repositories/auth.repository');
const TokenRepository = require('../repositories/token.repository');

async function createUser(data) {
  return await AuthRepository.createUser(data);
}

async function findByUsernameOrPhone(username, phone) {
  return await User.findOne({ $or: [{ username }, { phone }] });
}

async function markPhoneVerified(userId) {
  return await AuthRepository.updateUser(userId, {
    phoneVerifiedAt: new Date()
  });
}

async function markEmailVerified(userId) {
  return await AuthRepository.updateUser(userId, {
    emailVerifiedAt: new Date()
  });
}


async function getById(userId) {
  return await AuthRepository.findById(userId);
}

module.exports = {
  createUser,
  findByUsernameOrPhone,
  markPhoneVerified,
  markEmailVerified,
  getById
};