const User = require('../models/User');

async function findByUsernameOrPhone(username, phone) {
  const query = { $or: []};
  if (username) query.$or.push({ username});
  if (phone) query.$or.push({ phone });

  if (query.$or.length == 0) {
    return null;
  }

  return await User.findOne(query);
}

async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

async function updateUser(userId, updateFields) {
  return await User.findByIdAndUpdate(userId, updateFields, { new: true });
}

async function findById(userId) {
  return await User.findById(userId);
}

module.exports = {
  findByUsernameOrPhone,
  createUser,
  updateUser,
  findById
};