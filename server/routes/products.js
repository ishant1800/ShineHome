const express = require('express');
const Product = require('../models/Product');
const { optionalProtect } = require('../middleware/auth');

const router = express.Router();

// GET /api/products?department=&category=&style=&minPrice=&maxPrice=&search=
router.get('/', async (req, res, next) => {
  try {
    const { department, category, style, minPrice, maxPrice, search } = req.query;
    const query = {};

    if (department && ['furniture', 'appliance'].includes(department)) {
      query.department = department;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (style && style !== 'All') {
      query.style = style;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { style: regex },
        { material: regex },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: 1 });
    const categoryQuery = department ? { department } : {};
    const categories = await Product.distinct('category', categoryQuery);

    res.json({ products, categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', optionalProtect, async (req, res, next) => {
  try {
    const { userName, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!comment || !comment.trim() || Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Valid rating (1-5) and comment are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviewerName = req.user?.name || (userName && userName.trim()) || 'Verified Buyer';
    product.reviews.unshift({
      userName: reviewerName,
      rating: numericRating,
      comment: comment.trim(),
    });
    product.numReviews = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));

    await product.save();
    res.status(201).json({ product, review: product.reviews[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
