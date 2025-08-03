/**
 * SmartShort API Client
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base API request function
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error',
      0,
      null
    );
  }
}

/**
 * URL Management API
 */
export const urlApi = {
  // Create a new shortened URL
  async createUrl(data) {
    return apiRequest('/api/urls/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get user's URLs with pagination and filtering
  async getUserUrls(userId, params = {}) {
    const queryParams = new URLSearchParams({
      userId,
      ...params,
    });
    return apiRequest(`/api/urls/user?${queryParams}`);
  },

  // Get top performing URLs (public)
  async getTopUrls(limit = 10) {
    return apiRequest(`/api/urls/top/list?limit=${limit}`);
  },

  // Search URLs
  async searchUrls(userId, query, params = {}) {
    const queryParams = new URLSearchParams({
      userId,
      q: query,
      ...params,
    });
    return apiRequest(`/api/urls/search?${queryParams}`);
  },

  // Get single URL details
  async getUrlDetails(urlId, userId) {
    return apiRequest(`/api/urls/${urlId}?userId=${userId}`);
  },

  // Get URL statistics
  async getUrlStats(urlId, userId) {
    return apiRequest(`/api/urls/${urlId}/stats?userId=${userId}`);
  },

  // Update URL
  async updateUrl(urlId, data) {
    return apiRequest(`/api/urls/${urlId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete URL
  async deleteUrl(urlId, userId) {
    return apiRequest(`/api/urls/${urlId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  // Bulk delete URLs
  async bulkDeleteUrls(urlIds, userId) {
    return apiRequest('/api/urls/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({ urlIds, userId }),
    });
  },
};

/**
 * Analytics API
 */
export const analyticsApi = {
  // Get user dashboard statistics
  async getUserStats(userId) {
    return apiRequest(`/api/analytics/user/stats?userId=${userId}`);
  },

  // Get user analytics by user ID
  async getUserStatsById(userId) {
    return apiRequest(`/api/analytics/user/${userId}`);
  },

  // Get user activity timeline
  async getUserTimeline(userId) {
    return apiRequest(`/api/analytics/user/timeline?userId=${userId}`);
  },

  // Get URL performance analytics
  async getUrlPerformance(urlId, userId) {
    return apiRequest(`/api/analytics/url/${urlId}/performance?userId=${userId}`);
  },

  // Get global statistics (public)
  async getGlobalStats() {
    return apiRequest('/api/analytics/global/stats');
  },

  // Get overall statistics (alias for global stats)
  async getOverallStats() {
    return apiRequest('/api/analytics/overall');
  },
};

/**
 * Test API (for demo purposes)
 */
export const testApi = {
  // Create demo user and test data
  async setupDemo() {
    return apiRequest('/api/test/setup-demo', {
      method: 'POST',
    });
  },

  // Get demo user info
  async getDemoUser() {
    return apiRequest('/api/test/demo-user');
  },
};

/**
 * System API
 */
export const systemApi = {
  // Health check
  async healthCheck() {
    return apiRequest('/api/health');
  },
};

/**
 * URL Redirection helper
 */
export const getShortUrl = (shortCode) => {
  return `${API_BASE_URL}/r/${shortCode}`;
};

/**
 * Utility functions
 */
export const apiUtils = {
  // Format API error for display
  formatError(error) {
    if (error instanceof ApiError) {
      return error.message;
    }
    return error.message || 'An unexpected error occurred';
  },

  // Check if error is authentication related
  isAuthError(error) {
    return error instanceof ApiError && error.status === 401;
  },

  // Check if error is network related
  isNetworkError(error) {
    return error instanceof ApiError && error.status === 0;
  },

  // Validate URL format
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Format date for API
  formatDateForApi(date) {
    if (!date) return null;
    return new Date(date).toISOString();
  },

  // Parse API date
  parseApiDate(dateString) {
    return new Date(dateString);
  },
};

// Main API object with all exports
const api = {
  urlApi,
  analyticsApi,
  testApi,
  systemApi,
  getShortUrl,
  apiUtils,
};

export default api; 