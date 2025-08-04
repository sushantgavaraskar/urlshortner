/**
 * Middleware Index
 * Exports all middleware for easy importing
 */

// Error handling
export {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
} from './errorHandler.js';

// Response formatting
export {
  responseFormatter,
  successResponse,
  errorResponse,
  paginatedResponse,
  apiResponse
} from './responseFormatter.js';

// Authentication
export {
  authenticate,
  requireAuth,
  optionalAuth,
  authorize,
  requireOwnership,
  userRateLimit,
  validateSession,
  authenticateApiKey
} from './authentication.js';

// Validation
export {
  validate,
  validationSchemas,
  validateRateLimit,
  validateContentType,
  validateFileUpload
} from './validation.js';

// Security
export {
  corsOptions,
  createRateLimiter,
  securityHeaders,
  requestLogger,
  ipBlocker,
  requestSizeLimiter,
  validateApiKey,
  sqlInjectionProtection,
  xssProtection,
  healthCheck
} from './security.js';

// Default middleware stack
export const defaultMiddleware = [
  'cors',
  'securityHeaders',
  'requestLogger',
  'requestSizeLimiter',
  'xssProtection',
  'sqlInjectionProtection',
  'responseFormatter'
];

// API middleware stack
export const apiMiddleware = [
  'authenticate',
  'validateRateLimit',
  'requireAuth'
];

// Public middleware stack
export const publicMiddleware = [
  'cors',
  'securityHeaders',
  'requestLogger',
  'requestSizeLimiter',
  'xssProtection',
  'responseFormatter'
]; 