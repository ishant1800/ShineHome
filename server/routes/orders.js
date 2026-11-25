const express = require('express');
const Order = require('../models/Order');
const { protect, optionalProtect } = require('../middleware/auth');

const router = express.Router();

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SH-2026-${rand}`;
}

// POST /api/orders
router.post('/', optionalProtect, async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({ message: 'Complete shipping address details are required' });
    }

    if (!['UPI', 'Credit Card', 'Debit Card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method selected' });
    }

    const sanitizedItems = items.map((item) => ({
      product: item.product || item._id || undefined,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const subtotal = Number(
      sanitizedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    );
    const shippingCost = subtotal >= 1000 ? 0 : 45;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + shippingCost + tax).toFixed(2));

    const effectiveBilling = billingAddress && billingAddress.address
      ? billingAddress
      : {
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'United States',
        };

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user ? req.user._id : null,
      items: sanitizedItems,
      shippingAddress,
      billingAddress: effectiveBilling,
      paymentMethod,
      paymentDetails: {
        upiId: paymentDetails?.upiId || '',
        cardLast4: paymentDetails?.cardLast4 || '',
        cardBrand: paymentDetails?.cardBrand || '',
      },
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      status: 'Confirmed',
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
