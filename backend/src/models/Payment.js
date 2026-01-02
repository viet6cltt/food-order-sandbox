const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    method: {
      type: String,
      enum: ["COD", "BANK_TRANSFER"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    bankInfo: {
      type: String, 
      default: null,
    },

    transferProofImage: {
      type: String,
      default: null,
    },

    note: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Payment", PaymentSchema);