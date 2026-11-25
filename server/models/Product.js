const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: {
      type: String,
      enum: ['furniture', 'appliance'],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    style: {
      type: String,
      enum: ['Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    dimensions: { type: String, default: '' },
    material: { type: String, default: '' },
    specs: {
      wattage: { type: String, default: '' },
      kelvin: { type: String, default: '' },
      lumens: { type: String, default: '' },
      smartSupport: { type: String, default: '' },
    },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
