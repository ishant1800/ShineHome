const express = require('express');
const Design = require('../models/Design');
const User = require('../models/User');
const { protect, optionalProtect } = require('../middleware/auth');

const router = express.Router();

// GET /api/designs?style=&search=
router.get('/', async (req, res, next) => {
  try {
    const { style, search } = req.query;
    const query = {};

    if (style && style !== 'All') {
      query.style = style;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { designerName: regex },
        { description: regex },
        { style: regex },
      ];
    }

    const designs = await Design.find(query)
      .populate('hotspots.product', 'name price department category style image specs dimensions material rating')
      .sort({ featured: -1, createdAt: 1 });

    res.json({ designs });
  } catch (err) {
    next(err);
  }
});

// GET /api/designs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id).populate('hotspots.product');
    if (!design) {
      return res.status(404).json({ message: 'Design concept not found' });
    }
    res.json({ design });
  } catch (err) {
    next(err);
  }
});

// POST /api/designs/:id/favorite
router.post('/:id/favorite', protect, async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design concept not found' });
    }

    const user = await User.findById(req.user._id);
    const designIdStr = design._id.toString();
    const existsIndex = user.favorites.findIndex((fav) => fav.toString() === designIdStr);

    let isFavorited;
    if (existsIndex >= 0) {
      user.favorites.splice(existsIndex, 1);
      isFavorited = false;
    } else {
      user.favorites.push(design._id);
      isFavorited = true;
    }

    await user.save();
    res.json({ favorites: user.favorites, isFavorited });
  } catch (err) {
    next(err);
  }
});

// POST /api/designs/:id/reviews
router.post('/:id/reviews', optionalProtect, async (req, res, next) => {
  try {
    const { userName, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!comment || !comment.trim() || Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Valid rating (1-5) and comment are required' });
    }

    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design concept not found' });
    }

    const reviewerName = req.user?.name || (userName && userName.trim()) || 'Guest Homeowner';
    const review = {
      userName: reviewerName,
      rating: numericRating,
      comment: comment.trim(),
    };

    design.reviews.unshift(review);
    design.numReviews = design.reviews.length;
    const sum = design.reviews.reduce((acc, item) => acc + item.rating, 0);
    design.rating = Number((sum / design.reviews.length).toFixed(1));

    await design.save();
    await design.populate('hotspots.product', 'name price department category style image specs dimensions material rating');

    res.status(201).json({ design, review: design.reviews[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/designs/:id/inquire
router.post('/:id/inquire', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and project message are required' });
    }

    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design concept not found' });
    }

    res.status(201).json({
      success: true,
      message: `Your inquiry has been sent to ${design.designerName} (${design.designerEmail}).`,
      designer: {
        name: design.designerName,
        email: design.designerEmail,
        phone: design.designerPhone,
      },
      inquiry: { name, email, phone: phone || '', message },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
