const AuthSession = require('../models/AuthSession');

class AuthSessionRepository {
  async createAuthSession(data) {
    const authSession = new AuthSession(data);
    return await authSession.save();
  }

  async findValidSessionByTokenId(refreshTokenId) {
    return await AuthSession.findOne({
      refreshTokenId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  async revokeSession(refreshTokenId) {
    return await AuthSession.findOneAndUpdate(
      { refreshTokenId },
      { revokedAt: new Date() }
    );
  }

  async revokeSessionByUserId(userId) {
    return await AuthSession.findOneAndUpdate(
      { userId: userId },
      { revokedAt: new Date() }
    );
  }

  async revokeAllSessionsForUser(userId) {
    return await AuthSession.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  async updateLastUsed(refreshTokenId) {
    return await AuthSession.findOneAndUpdate(
      { refreshTokenId },
      { lastUsedAt: new Date() }
    );
  }

  async findActiveSessionsByUser(userId) {
    return await AuthSession.find({
      userId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }
}

module.exports = new AuthSessionRepository();
