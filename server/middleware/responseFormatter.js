/**
 * Response Formatter Middleware
 * Provides consistent API responses across the application
 */

// Success response formatter
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

// Error response formatter
export const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

// Pagination response formatter
export const paginatedResponse = (res, data, page = 1, limit = 10, total = 0) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const response = {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    },
    timestamp: new Date().toISOString()
  };

  return res.json(response);
};

// Response formatter middleware
export const responseFormatter = (req, res, next) => {
  // Add response methods to res object
  res.success = (data = null, message = 'Success', statusCode = 200) => {
    return successResponse(res, data, message, statusCode);
  };

  res.error = (message = 'Error occurred', statusCode = 500, errors = null) => {
    return errorResponse(res, message, statusCode, errors);
  };

  res.paginated = (data, page = 1, limit = 10, total = 0) => {
    return paginatedResponse(res, data, page, limit, total);
  };

  // Override res.json to add consistent formatting
  const originalJson = res.json;
  res.json = function(data) {
    // If data already has success property, return as is
    if (data && typeof data === 'object' && 'success' in data) {
      return originalJson.call(this, data);
    }

    // Format the response
    const formattedResponse = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
};

// API response wrapper
export const apiResponse = {
  // Success responses
  created: (res, data, message = 'Resource created successfully') => {
    return res.success(data, message, 201);
  },

  updated: (res, data, message = 'Resource updated successfully') => {
    return res.success(data, message, 200);
  },

  deleted: (res, message = 'Resource deleted successfully') => {
    return res.success(null, message, 200);
  },

  // Error responses
  badRequest: (res, message = 'Bad request', errors = null) => {
    return res.error(message, 400, errors);
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return res.error(message, 401);
  },

  forbidden: (res, message = 'Forbidden') => {
    return res.error(message, 403);
  },

  notFound: (res, message = 'Resource not found') => {
    return res.error(message, 404);
  },

  conflict: (res, message = 'Resource conflict') => {
    return res.error(message, 409);
  },

  tooManyRequests: (res, message = 'Too many requests') => {
    return res.error(message, 429);
  },

  serverError: (res, message = 'Internal server error') => {
    return res.error(message, 500);
  }
}; 