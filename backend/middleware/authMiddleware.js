const jwt = require('jsonwebtoken');
require('dotenv').config();

const protectAdmin = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lazydition_fallback_secret');
      req.admin = decoded;
      return next();
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protectAdmin };
