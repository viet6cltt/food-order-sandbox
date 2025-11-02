const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    refreshTokenHash: {
      type: String,
      required: true,
      trim: true,
    },
    device: {
      userAgent: { type: String, trim: true },
      ipAddress: { type: String, trim: true },
      platform: { type: String, enum: ['web'], default: 'web', required: true }, //hiện tại chỉ có web, sau có thể mở rộng
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: false }
);

/**Indexes */
// Tự động xáo session khi hết hạn
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index theo user đang active
authSessionSchema.index({ userId: 1, revokedAt: 1 }, { name: 'idx_userId_revokedAt' });

// Index với web session, hiện tại không cần lắm nhưng cần cho sau khi có thêm mobile
authSessionSchema.index(
  { userId: 1, 'device.platform': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'device.platform': 'web',
      revokedAt: null,
    },
    name: 'idx_userId_device',
  }
);

const AuthSession = mongoose.model('AuthSession', authSessionSchema);

module.exports = AuthSession;
