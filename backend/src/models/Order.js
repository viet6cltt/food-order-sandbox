const mongoose = require('mongoose');

const { orderStatus } = require('../constants/orderStatus');

const SelectedOptionSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    optionName: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    _id: false
  }
);

const OrderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true },
    imageUrl: { type: String },

    quantity: { type: Number, required: true },
    finalPrice: { type: Number, required: true },

    selectedOptions: {
      type: [SelectedOptionSchema],
      default: []
    },
  },
  { _id: false}
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },

    items: {
      type: [OrderItemSchema],
      required: true
    },

    shippingFee: { type: Number, default: 0 },
    totalFoodPrice: { type: Number, required: true },

    // promotion (later)

    discountAmount: { type: Number, default: 0 },

    deliveryAddress: {
      full: { type: String, default: null },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "BANK_TRANSFER"],
      default: "COD",
    },

    status: {
      type: String,
      enum: orderStatus,
      default: "draft"
    },

    note: { type: String, default: "" },
  },
  {
    timestamps: true
  }
);

/** Indexes */

OrderSchema.index({ userId: 1, createdAt: -1 });

OrderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });

OrderSchema.index({ status: 1, createdAt: -1 });

OrderSchema.index({ paymentId: 1 });

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;