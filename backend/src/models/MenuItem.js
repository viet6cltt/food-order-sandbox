const mongoose = require('mongoose');

const optionGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true},
    isRequired: { type: Boolean, default: false },
    maxSelect: { type: Number, default: 1 },

    options: [
      {
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
      }
    ]
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },

  name: { type: String, required: true, trim: true },

  description: { type: String, default: null },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  imageUrl: { type: String, trim: true },

  isAvailable: { type: Boolean, default: true },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  optionGroups: {
    type: [optionGroupSchema],
    default: []
  },

  totalBuy: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurantId: 1, categoryId: 1 });


module.exports = mongoose.model("MenuItem", menuItemSchema);

