const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    x: { type: Number, required: true, min: 0, max: 100 },
    y: { type: Number, required: true, min: 0, max: 100 },
    label: { type: String, required: true },
  },
  { _id: true }
);

const designReviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const designSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    style: {
      type: String,
      enum: ['Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial'],
      required: true,
    },
    description: { type: String, required: true },
    image: { type: String, required: true },
    designerName: { type: String, required: true, trim: true },
    designerRole: { type: String, default: 'Principal Interior Architect' },
    designerAvatar: { type: String, required: true },
    designerEmail: { type: String, required: true },
    designerPhone: { type: String, required: true },
    rating: { type: Number, default: 4.9 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hotspots: [hotspotSchema],
    reviews: [designReviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Design', designSchema);
