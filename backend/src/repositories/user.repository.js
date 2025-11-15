const User = require('../models/User');

class UserRepository {
  async findByUsernameOrPhone(username, phone) {
    const query = { $or: [] };
    if (username) query.$or.push({ username });
    if (phone) query.$or.push({ phone });
    if (query.$or.length === 0) return null;

    return await User.findOne(query);
  }

  async findByPhone(phone) {
    return await User.findOne({ phone }).select('+passwordHash');
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async findByProviderId(provider, providerId) {
    return await User.findOne({
      'providers.provider': provider,
      'providers.providerId': providerId,
    });
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async updateUser(userId, updateFields) {
    return await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true });
  }

  async updateEmail(userId, email) {
    return await User.findByIdAndUpdate(
      userId,
      { email, emailVerifiedAt: null },
      { new: true }
    );
  }

  async verifyEmail(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { emailVerifiedAt: new Date() },
      { new: true }
    );
  }

  async verifyPhone(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { phoneVerifiedAt: new Date() },
      { new: true }
    );
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async updateProviderById(userId, providerObject) {
    const { provider, providerId, emailAtProvider, avatarUrl } = providerObject;

    const user = await User.findOne(
      { _id: userId, 'providers.provider': provider},
      { 'providers.$': 1}
    );
    
    if (user) {
      return await User.findOneAndUpdate(
        { _id: userId, 'providers.provider': provider },
        {
          $set: {
            'providers.$.providerId': providerId,
            'providers.$.emailAtProvider': emailAtProvider,
            'providers.$.avatarUrl': avatarUrl,
          },
        },
        { new: true }
      )
    }

    // nếu chưa có -> push
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          providers: providerObject,
        },
      },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
