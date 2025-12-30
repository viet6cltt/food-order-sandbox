const mongoose = require('mongoose');

const ReviewStatus = ["PUBLISHED", "HIDDEN"];

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String, 
      trim: true
    },

    images: [
      {
        type: String,
        trim: true,
      }
    ],

    status: {
      type: String,
      enum: ReviewStatus,
      default: "PUBLISHED",
      index: true
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  { userId: 1, orderId: 1 },
  { unique: true, name: "unique_review_per_order" }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;