import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'mathina_secure_production_secret_key_2024_auth';
      const decoded = jwt.verify(token, secret);

      // Handle dedicated Shop Owner fallback identity
      if (decoded.id === '66f000000000000000000001') {
        req.user = {
          _id: '66f000000000000000000001',
          name: 'Shajan A.J.',
          email: 'mathinachicken@gmail.com',
          role: 'admin',
          phone: '7708032726',
        };
        return next();
      }

      // Get user from token
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        if (decoded.id === '66f000000000000000000001') {
          req.user = {
            _id: '66f000000000000000000001',
            name: 'Shajan A.J.',
            email: 'mathinachicken@gmail.com',
            role: 'admin',
            phone: '7708032726',
          };
          return next();
        }
        throw dbErr;
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};

// Customer only middleware
export const customer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as customer',
    });
  }
};
