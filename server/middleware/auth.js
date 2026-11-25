const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'shinehome_dev_jwt_secret_change_in_production';
}

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, missing token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
}

async function optionalProtect(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch {
    // Proceed as guest if token is invalid/expired
  }
  next();
}

module.exports = { protect, optionalProtect, getJwtSecret };
