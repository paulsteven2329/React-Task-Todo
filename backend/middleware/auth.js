// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('AuthMiddleware: Token received:', token); // Debug

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user ID to req.user
    console.log('AuthMiddleware: Token decoded:', decoded); // Debug
    next();
  } catch (err) {
    console.error('AuthMiddleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;