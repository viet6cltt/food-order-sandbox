const mongoose = require('mongoose');

const ProviderEnum = ['local', 'google', 'firebase'];

const providerSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ProviderEnum, required: true },
    providerId: { type: String, trim: true }, // ID duy nhất mà provider cung cấp
    emailAtProvider: { type: String, trim: true, lowercase: true }, // email mà provider trả về
    avatarUrl: { type: String, trim: true },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    phoneVerifiedAt: {
      type: Date,
      default: null, // null khi chưa verify
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    providers: {
      type: [providerSchema],
      default: [{ provider: 'local' }],
    },
    role: {
      type: String,
      enum: ['admin', 'customer', 'restaurant_owner', 'brand_admin'],
      default: 'customer'
    },
    status: {
      type: String,
      enum: ['active', 'banned'],
      default: 'active',
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      geo: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/** Indexes */
// Index cho Geo location
userSchema.index({ 'address.geo': '2dsphere' }, { name: 'geo_Idx' });

// Unique index
userSchema.index({ username: 1 }, { unique: true });
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string' } } }
);
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

// (provider, providerId) is unique
userSchema.index(
  { 'providers.provider': 1, 'providers.providerId': 1 },
  {
    unique: true,
    partialFilterExpression: {
      paritalFilterExpression: {
        'providers.provider': { $exists: true },
        'providers.providerId': { $exists: true },
      },
    },
  }
);

// (role, status) -> tối ưu truy vấn người dùng theo vai trò
userSchema.index({ roleId: 1, status: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
