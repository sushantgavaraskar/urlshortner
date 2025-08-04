/**
 * Authentication Middleware
 * Handles user authentication and session management
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthenticationError, AuthorizationError } from './errorHandler.js';
import { asyncHandler } from './errorHandler.js';
import logger from '../utils/logger.js';

// Extract token from request
const extractToken = (req) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check query parameter
  else if (req.query.token) {
    token = req.query.token;
  }
  // Check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Main authentication middleware
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    // For API routes, require authentication
    if (req.path.startsWith('/api/')) {
      throw new AuthenticationError('Access token required');
    }
    // For public routes, continue without user
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Add user to request
    req.user = user;
    req.token = token;

    logger.info('User authenticated', {
      userId: user._id,
      email: user.email,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    next(error);
  }
});

// Require authentication middleware
export const requireAuth = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }
  next();
});

// Optional authentication middleware
export const optionalAuth = asyncHandler(async (req, res, next) => {
  // If no user, continue without authentication
  if (!req.user) {
    return next();
  }
  next();
});

// Role-based authorization middleware
export const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(`Role ${req.user.role} is not authorized to access this resource`);
    }

    next();
  });
};

// User ownership middleware
export const requireOwnership = (resourceModel, resourceIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const resourceId = req.params[resourceIdParam];
    
    if (!resourceId) {
      throw new AuthenticationError('Resource ID required');
    }

    // Get resource and check ownership
    const resource = await resourceModel.findById(resourceId);
    
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check if user owns the resource or is admin
    if (resource.userId && resource.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AuthorizationError('Access denied. You can only access your own resources.');
    }

    // Add resource to request for controllers
    req.resource = resource;
    next();
  });
};

// Rate limiting per user
export const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const userRequests = requests.get(userId) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add current request
    validRequests.push(now);
    requests.set(userId, validRequests);

    next();
  });
};

// Session validation middleware
export const validateSession = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Check if user session is still valid
  const user = await User.findById(req.user._id).select('isActive lastLoginAt');
  
  if (!user || !user.isActive) {
    throw new AuthenticationError('Session expired. Please sign in again.');
  }

  // Update last activity
  user.lastLoginAt = new Date();
  await user.save();

  next();
});

// API key authentication (for external services)
export const authenticateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    throw new AuthenticationError('API key required');
  }

  // Validate API key (you can implement your own logic)
  if (apiKey !== process.env.API_KEY) {
    throw new AuthenticationError('Invalid API key');
  }

  next();
}); 