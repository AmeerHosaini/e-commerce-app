const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // Individual review rating
    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
    // we assocaited a user to check if a user already has a review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema({
  // We want to know which admin created which product since only admins can create products
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // We need to reference a specific model for this objectID
    // This adds a relationship between the products and the user
    ref: "User",
  },

  name: {
    type: String,
    required: true,
  },

  // for Farsi
  name_fa: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
  },

  brand_fa: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  category_fa: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  description_fa: {
    type: String,
    required: true,
  },

  reviews: [ReviewSchema],

  // Average Raiting
  rating: {
    type: Number,
    required: true,
    default: 0,
  },

  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },

  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
