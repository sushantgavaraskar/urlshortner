/**
 * Security Middleware
 * Handles CORS, security headers, and other security measures
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from './errorHandler.js';
import logger from '../utils/logger.js';

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'https://urlshortner-gold.vercel.app',
      'https://urlshortner-b2sf.onrender.com'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Rate limiting configuration
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests from this IP') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        message,
        statusCode: 429,
        timestamp: new Date().toISOString()
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      res.status(429).json({
        success: false,
        error: {
          message,
          statusCode: 429,
          timestamp: new Date().toISOString()
        }
      });
    }
  });
};

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Request logging middleware
export const requestLogger = asyncHandler(async (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
});

// IP blocking middleware
export const ipBlocker = (blockedIPs = []) => {
  return asyncHandler(async (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (blockedIPs.includes(clientIP)) {
      logger.warn('Blocked request from IP:', clientIP);
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied',
          statusCode: 403,
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  });
};

// Request size limiter
export const requestSizeLimiter = (maxSize = '10mb') => {
  return asyncHandler(async (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const maxBytes = parseSize(maxSize);

    if (contentLength > maxBytes) {
      return res.status(413).json({
        success: false,
        error: {
          message: 'Request entity too large',
          statusCode: 413,
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  });
};

// Parse size string to bytes
const parseSize = (size) => {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+)([kmg]?b)$/);
  if (!match) return 1024 * 1024; // Default to 1MB

  const [, value, unit] = match;
  return parseInt(value) * (units[unit] || 1);
};

// API key validation middleware
export const validateApiKey = (required = false) => {
  return asyncHandler(async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (required && !apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'API key required',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (apiKey && apiKey !== process.env.API_KEY) {
      logger.warn('Invalid API key used:', { ip: req.ip, path: req.path });
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid API key',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  });
};

// SQL injection protection middleware
export const sqlInjectionProtection = asyncHandler(async (req, res, next) => {
  const sqlPatterns = [
    /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script)\b)/i,
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+.*\b)/i,
    /(\b(script|javascript|vbscript|onload|onerror)\b)/i
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const hasSqlInjection = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);

  if (hasSqlInjection) {
    logger.warn('Potential SQL injection attempt:', {
      ip: req.ip,
      path: req.path,
      body: req.body,
      query: req.query
    });

    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid input detected',
        statusCode: 400,
        timestamp: new Date().toISOString()
      }
    });
  }

  next();
});

// XSS protection middleware
export const xssProtection = asyncHandler(async (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return xssPatterns.reduce((sanitized, pattern) => {
        return sanitized.replace(pattern, '');
      }, value);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  // Instead of reassigning, mutate in place for Express 5 compatibility
  const sanitizedBody = sanitizeValue(req.body);
  const sanitizedQuery = sanitizeValue(req.query);
  const sanitizedParams = sanitizeValue(req.params);

  Object.keys(req.body).forEach(key => req.body[key] = sanitizedBody[key]);
  Object.keys(req.query).forEach(key => req.query[key] = sanitizedQuery[key]);
  Object.keys(req.params).forEach(key => req.params[key] = sanitizedParams[key]);

  next();
});

// Health check middleware
export const healthCheck = asyncHandler(async (req, res, next) => {
  if (req.path === '/health' || req.path === '/api/health') {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    return res.json(health);
  }

  next();
}); 