const mongoose = require('mongoose');

const RestaurantRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  restaurantName: { type: String, required: true, trim: true },
  description: { type: String, default: null },
  
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

  phone: { type: String, trim: true },
  categoriesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }
  ],

  documents: [String],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  rejectReason: {
    type: String,
    default: null
  },

  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date, default: null },
});




module.exports = mongoose.model('RestaurantRequest', RestaurantRequestSchema);