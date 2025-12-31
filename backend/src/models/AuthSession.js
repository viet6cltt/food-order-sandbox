const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    refreshTokenId: {
      type: String,
      required: true,
      unique: true, // mỗi refresh Token Id là duy nhất
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


const AuthSession = mongoose.model('AuthSession', authSessionSchema);

module.exports = AuthSession;
