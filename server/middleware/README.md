# Middleware System Documentation

This directory contains a comprehensive middleware system for the SmartShort URL shortener application. The middleware provides centralized error handling, authentication, validation, security, and response formatting.

## 📁 File Structure

```
middleware/
├── index.js              # Main exports and middleware stacks
├── errorHandler.js       # Centralized error handling
├── responseFormatter.js  # Response formatting utilities
├── authentication.js     # Authentication and authorization
├── validation.js         # Request validation and sanitization
├── security.js          # Security middleware (CORS, headers, etc.)
└── README.md           # This documentation
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { 
  errorHandler, 
  responseFormatter, 
  authenticate,
  validate,
  validationSchemas 
} from './middleware/index.js';

// Apply middleware to your Express app
app.use(responseFormatter);
app.use(authenticate);
app.use(errorHandler);
```

### Using with Routes

```javascript
import { validate, validationSchemas, requireAuth } from './middleware/index.js';

// Apply validation to route
router.post('/urls', 
  validate(validationSchemas.createUrl),
  requireAuth,
  urlController.createUrl
);
```

## 🔧 Middleware Components

### 1. Error Handler (`errorHandler.js`)

**Features:**
- Centralized error handling
- Custom error classes
- Development vs production error responses
- Async error wrapper
- MongoDB error handling

**Usage:**
```javascript
import { asyncHandler, ValidationError } from './middleware/errorHandler.js';

// Wrap async functions
const controller = asyncHandler(async (req, res) => {
  if (!req.body.url) {
    throw new ValidationError('URL is required');
  }
  // ... rest of logic
});

// Custom error classes
throw new AuthenticationError('Login required');
throw new NotFoundError('Resource not found');
throw new ConflictError('Resource already exists');
```

### 2. Response Formatter (`responseFormatter.js`)

**Features:**
- Consistent API responses
- Success/error response helpers
- Pagination support
- Automatic timestamp addition

**Usage:**
```javascript
// Success responses
res.success(data, 'Operation successful', 200);
res.created(data, 'Resource created');
res.updated(data, 'Resource updated');
res.deleted('Resource deleted');

// Error responses
res.error('Something went wrong', 500);
res.badRequest('Invalid input');
res.unauthorized('Authentication required');

// Pagination
res.paginated(data, page, limit, total);
```

### 3. Authentication (`authentication.js`)

**Features:**
- JWT token authentication
- Role-based authorization
- User ownership validation
- Rate limiting per user
- Session validation

**Usage:**
```javascript
import { 
  authenticate, 
  requireAuth, 
  authorize, 
  requireOwnership 
} from './middleware/authentication.js';

// Basic authentication
app.use(authenticate);

// Require authentication for specific routes
router.get('/profile', requireAuth, profileController.getProfile);

// Role-based access
router.get('/admin', authorize('admin'), adminController.dashboard);

// Resource ownership
router.put('/urls/:id', 
  requireOwnership(Url, 'id'), 
  urlController.updateUrl
);
```

### 4. Validation (`validation.js`)

**Features:**
- Request data validation
- Input sanitization
- Custom validation rules
- Pre-built validation schemas
- Rate limiting validation

**Usage:**
```javascript
import { validate, validationSchemas } from './middleware/validation.js';

// Use pre-built schemas
router.post('/urls', 
  validate(validationSchemas.createUrl),
  urlController.createUrl
);

// Custom validation
const customSchema = {
  email: [
    { validator: 'isRequired', message: 'Email is required' },
    { validator: 'isValidEmail', message: 'Invalid email format' }
  ]
};
```

### 5. Security (`security.js`)

**Features:**
- CORS configuration
- Security headers (Helmet)
- Rate limiting
- Request logging
- XSS protection
- SQL injection protection
- IP blocking

**Usage:**
```javascript
import { 
  corsOptions, 
  securityHeaders, 
  requestLogger,
  xssProtection 
} from './middleware/security.js';

app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(xssProtection);
```

## 📋 Pre-built Validation Schemas

### URL Creation
```javascript
validationSchemas.createUrl = {
  originalUrl: [
    { validator: 'isRequired', message: 'Original URL is required' },
    { validator: 'isValidUrl', message: 'Please provide a valid URL' }
  ],
  customAlias: [
    { validator: (value) => !value || validators.isValidAlias(value) },
    { validator: (value) => !value || validators.isLength(value, 3, 20) }
  ]
};
```

### User Registration
```javascript
validationSchemas.registerUser = {
  email: [
    { validator: 'isRequired', message: 'Email is required' },
    { validator: 'isValidEmail', message: 'Please provide a valid email' }
  ],
  password: [
    { validator: 'isRequired', message: 'Password is required' },
    { validator: 'isLength', params: [6, 50] }
  ]
};
```

## 🔒 Security Features

### Rate Limiting
```javascript
import { createRateLimiter } from './middleware/security.js';

const limiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
app.use('/api/', limiter);
```

### CORS Configuration
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### Security Headers
```javascript
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  }
});
```

## 📊 Logging

### Request Logging
```javascript
// Automatically logs all requests with:
// - Method and URL
// - IP address
// - User agent
// - User ID (if authenticated)
// - Response time
// - Status code
```

### Error Logging
```javascript
// Logs errors with:
// - Error message and stack trace
// - Request details
// - User information
// - Timestamp
```

## 🎯 Best Practices

### 1. Error Handling
```javascript
// Always use asyncHandler for async functions
const controller = asyncHandler(async (req, res) => {
  // Your logic here
});

// Use specific error classes
throw new ValidationError('Invalid input');
throw new NotFoundError('Resource not found');
```

### 2. Response Formatting
```javascript
// Use consistent response methods
res.success(data, 'Operation successful');
res.error('Something went wrong', 500);

// For pagination
res.paginated(data, page, limit, total);
```

### 3. Authentication
```javascript
// Apply authentication middleware early
app.use(authenticate);

// Use requireAuth for protected routes
router.get('/protected', requireAuth, controller.method);
```

### 4. Validation
```javascript
// Use pre-built schemas when possible
router.post('/urls', validate(validationSchemas.createUrl), controller.create);

// Create custom schemas for specific needs
const customSchema = {
  field: [
    { validator: 'isRequired' },
    { validator: 'isLength', params: [1, 100] }
  ]
};
```

## 🔧 Configuration

### Environment Variables
```bash
# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
NODE_ENV=production
```

### Customization
```javascript
// Custom rate limiter
const customLimiter = createRateLimiter(5 * 60 * 1000, 50); // 50 requests per 5 minutes

// Custom CORS options
const customCors = {
  ...corsOptions,
  origin: ['https://customdomain.com']
};

// Custom validation rules
const customValidators = {
  ...validators,
  isCustomField: (value) => {
    // Your custom validation logic
    return true;
  }
};
```

## 🚀 Performance Features

- **Async Error Handling**: No try-catch blocks needed
- **Request Logging**: Performance monitoring built-in
- **Rate Limiting**: Prevents abuse
- **Input Sanitization**: XSS protection
- **Response Caching**: Built-in caching headers

## 🔍 Debugging

### Development Mode
```javascript
// Enhanced error responses with stack traces
if (process.env.NODE_ENV === 'development') {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      stack: err.stack,
      timestamp: new Date().toISOString()
    }
  });
}
```

### Request Logging
```javascript
// All requests are logged with:
// - Method and URL
// - Response time
// - Status code
// - User information
```

This middleware system provides a robust foundation for building secure, scalable, and maintainable APIs. All middleware is designed to work together seamlessly while remaining modular and customizable. 