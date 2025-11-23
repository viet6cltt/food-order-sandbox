const mongoose = require('mongoose');

const selectedOptionSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    optionName: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: { type: String, required: true }, 
    imageUrl: { type: String },

    basePrice: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },

    selectedOptions: {
      type: [selectedOptionSchema],
      default: [],
    },

    finalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);






