const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'Order must contain at least one item'],
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' },
    },
    billingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' },
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card'],
      required: true,
    },
    paymentDetails: {
      upiId: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      cardBrand: { type: String, default: '' },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered'],
      default: 'Confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
