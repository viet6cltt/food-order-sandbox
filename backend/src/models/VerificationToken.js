const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['verify_email', 'reset_password', 'two_factor'],
      required: true
    },
    tokenHash: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true
    },
    consumedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

/* 🧭 Indexes */

// TTL: xóa tự động khi hết hạn
verificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'idx_expiresAt' }
);

// 1 token active / user / type
verificationTokenSchema.index(
  { userId: 1, type: 1, consumedAt: 1 },
  {
    unique: true,
    partialFilterExpression: { consumedAt: null },
    name: 'idx_user_type_active',
  }
);

// Cho tra cứu tokenHash nhanh (email)
verificationTokenSchema.index(
  { tokenHash: 1 },
  { unique: true, sparse: true, name: 'idx_tokenHash' }
);

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;
