/**
 * Validation Middleware
 * Handles request data validation and sanitization
 */

import { ValidationError } from './errorHandler.js';
import { asyncHandler } from './errorHandler.js';

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custom validation rules
const validators = {
  // URL validation
  isValidUrl: (value) => {
    if (!value) return false;
    return URL_REGEX.test(value);
  },

  // Email validation
  isValidEmail: (value) => {
    if (!value) return false;
    return EMAIL_REGEX.test(value);
  },

  // String length validation
  isLength: (value, min, max) => {
    if (!value) return false;
    const length = value.toString().length;
    return length >= min && length <= max;
  },

  // Number range validation
  isInRange: (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Required field validation
  isRequired: (value) => {
    return value !== undefined && value !== null && value !== '';
  },

  // Boolean validation
  isBoolean: (value) => {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
  },

  // Date validation
  isValidDate: (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  // Future date validation
  isFutureDate: (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date > new Date();
  },

  // Custom alias validation (alphanumeric and hyphens only)
  isValidAlias: (value) => {
    if (!value) return false;
    return /^[a-zA-Z0-9-]+$/.test(value);
  }
};

// Sanitize input data
const sanitize = (data) => {
  if (typeof data === 'string') {
    return data.trim();
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  }
  return data;
};

// Validation middleware factory
export const validate = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const errors = [];
    const sanitizedData = {};

    // Sanitize and validate each field
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field] || req.query[field] || req.params[field];
      const sanitizedValue = sanitize(value);

      // Apply validation rules
      for (const rule of rules) {
        const { validator, message, params = [] } = rule;

        if (typeof validator === 'string' && validators[validator]) {
          const isValid = validators[validator](sanitizedValue, ...params);
          if (!isValid) {
            errors.push({
              field,
              message: message || `${field} is invalid`,
              value: sanitizedValue
            });
            break; // Stop validating this field if one rule fails
          }
        } else if (typeof validator === 'function') {
          const isValid = validator(sanitizedValue, ...params);
          if (!isValid) {
            errors.push({
              field,
              message: message || `${field} is invalid`,
              value: sanitizedValue
            });
            break;
          }
        }
      }

      // Add sanitized value to request
      if (sanitizedValue !== undefined) {
        sanitizedData[field] = sanitizedValue;
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    // Add sanitized data to request
    req.sanitizedData = sanitizedData;
    next();
  });
};

// Common validation schemas
export const validationSchemas = {
  // URL creation validation
  createUrl: {
    originalUrl: [
      { validator: 'isRequired', message: 'Original URL is required' },
      { validator: 'isValidUrl', message: 'Please provide a valid URL' }
    ],
    customAlias: [
      { validator: (value) => !value || validators.isValidAlias(value), message: 'Custom alias can only contain letters, numbers, and hyphens' },
      { validator: (value) => !value || validators.isLength(value, 3, 20), message: 'Custom alias must be between 3 and 20 characters' }
    ],
    title: [
      { validator: (value) => !value || validators.isLength(value, 1, 100), message: 'Title must be between 1 and 100 characters' }
    ],
    description: [
      { validator: (value) => !value || validators.isLength(value, 1, 500), message: 'Description must be between 1 and 500 characters' }
    ],
    expiresAt: [
      { validator: (value) => !value || validators.isValidDate(value), message: 'Please provide a valid expiration date' },
      { validator: (value) => !value || validators.isFutureDate(value), message: 'Expiration date must be in the future' }
    ]
  },

  // User registration validation
  registerUser: {
    email: [
      { validator: 'isRequired', message: 'Email is required' },
      { validator: 'isValidEmail', message: 'Please provide a valid email address' }
    ],
    password: [
      { validator: 'isRequired', message: 'Password is required' },
      { validator: 'isLength', params: [6, 50], message: 'Password must be between 6 and 50 characters' }
    ],
    name: [
      { validator: 'isRequired', message: 'Name is required' },
      { validator: 'isLength', params: [2, 50], message: 'Name must be between 2 and 50 characters' }
    ]
  },

  // User login validation
  loginUser: {
    email: [
      { validator: 'isRequired', message: 'Email is required' },
      { validator: 'isValidEmail', message: 'Please provide a valid email address' }
    ],
    password: [
      { validator: 'isRequired', message: 'Password is required' }
    ]
  },

  // Pagination validation
  pagination: {
    page: [
      { validator: (value) => !value || validators.isInRange(value, 1, 1000), message: 'Page must be between 1 and 1000' }
    ],
    limit: [
      { validator: (value) => !value || validators.isInRange(value, 1, 100), message: 'Limit must be between 1 and 100' }
    ]
  },

  // Search validation
  search: {
    q: [
      { validator: 'isRequired', message: 'Search query is required' },
      { validator: 'isLength', params: [1, 100], message: 'Search query must be between 1 and 100 characters' }
    ]
  }
};

// Rate limiting validation
export const validateRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return asyncHandler(async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const userRequests = requests.get(ip) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add current request
    validRequests.push(now);
    requests.set(ip, validRequests);

    next();
  });
};

// Content type validation
export const validateContentType = (allowedTypes = ['application/json']) => {
  return asyncHandler(async (req, res, next) => {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      throw new ValidationError(`Content-Type must be one of: ${allowedTypes.join(', ')}`);
    }

    next();
  });
};

// File upload validation
export const validateFileUpload = (maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    // Check file size
    if (req.file.size > maxSize) {
      throw new ValidationError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new ValidationError(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    next();
  });
}; 