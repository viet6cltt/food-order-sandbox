const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: { type: String, default: null },

    bannerUrl: { type: String, trim: true },

    address: {
      full: { type: String, required: true }, 
      street: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
      geo: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: '2dsphere',
        },
      },
    },

    phone: { type: String, trim: true, required: true },

    isAcceptingOrders: { type: Boolean, default: true},

    opening_time: { type: String, trim: true, default: "08:00" },
    closing_time: { type: String, trim: true, default: "22:00" },

    isActive: { type: Boolean, default: true },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    reviewCount: { type: Number, default: 0 },

    categoriesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      }
    ],

    shippingPolicy: {
      type: String,
      enum: ["SELP_SHIP", "PARTNER_SHIP", "HYBRID"],
      default: "SELF_SHIP",
    },

    baseShippingFee: { type: Number, default: 0 },
    shippingPerKm: { type: Number, default: 3000 },

    estimatedDeliveryTime: { type: Number, default: 20 },

    paymentInfo:{
      bankName: { type: String, default: null },
      bankAccountNumber: { type: String, default: null},
      bankAccountName: { type: String, default: null },
      qrImageUrl: { type: String, default: null },
    }
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ "address.geo": "2dsphere" });
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ categoriesId: 1 });

module.exports = mongoose.model("Restaurant", restaurantSchema);