const User = require('../models/User');

class UserRepository {

  // ==========================================
  // NHÓM TÌM KIẾM (READ)
  // ==========================================

  async findAll(filter = {}, { limit = 10, skip = 0 }) {
    const [users, total] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);
    return { users, total };
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async findByUsernameOrPhone(username, phone) {
    const query = { $or: [] };
    if (username) query.$or.push({ username });
    if (phone) query.$or.push({ phone });
    if (query.$or.length === 0) return null;

    return await User.findOne(query);
  }

  async findByPhone(phone) {
    if (!phone) return null;
    
    // Tìm với số điện thoại chính xác
    let user = await User.findOne({ phone }).select('+passwordHash');
    if (user) return user;
    
    // Nếu không tìm thấy, thử format khác (hỗ trợ cả +84 và 0)
    const normalized = phone.trim();
    if (normalized.startsWith('+84')) {
      const altFormat = normalized.replace('+84', '0');
      user = await User.findOne({ phone: altFormat }).select('+passwordHash');
    } else if (normalized.startsWith('0')) {
      const altFormat = `+84${normalized.substring(1)}`;
      user = await User.findOne({ phone: altFormat }).select('+passwordHash');
    }
    
    return user;
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByProviderId(provider, providerId) {
    return await User.findOne({
      'providers.provider': provider,
      'providers.providerId': providerId,
    });
  }

  // ==========================================
  // NHÓM CẬP NHẬT (WRITE/UPDATE)
  // ==========================================

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(userId, updateFields) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  async updateStatus(userId, status) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { status } },
      { new: true }
    );
  }

  async verifyEmail(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { emailVerifiedAt: new Date() } },
      { new: true }
    );
  }

  async verifyPhone(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { phoneVerifiedAt: new Date() } },
      { new: true }
    );
  }

  async updateProviderById(userId, providerObject) {
    const { provider } = providerObject;

    // Cập nhật nếu đã có provider
    const user = await User.findOneAndUpdate(
      { _id: userId, 'providers.provider': provider },
      { $set: { 'providers.$': providerObject } },
      { new: true }
    );

    if (user) return user;

    // Nếu chưa có provider thì push mới
    return await User.findByIdAndUpdate(
      userId,
      { $push: { providers: providerObject } },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
