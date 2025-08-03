import { useState, useCallback } from 'react';
import { apiUtils } from '../utils/api';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const formattedError = apiUtils.formatError(err);
      setError(formattedError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { 
    callApi, 
    loading, 
    error, 
    clearError,
    setError 
  };
};

/**
 * Custom hook for URL management operations
 */
export const useUrlApi = () => {
  const { callApi, loading, error, clearError } = useApi();
  const { urlApi } = require('../utils/api');

  const createUrl = useCallback(async (data) => {
    return callApi(urlApi.createUrl, data);
  }, [callApi]);

  const getUserUrls = useCallback(async (userId, params) => {
    return callApi(urlApi.getUserUrls, userId, params);
  }, [callApi]);

  const searchUrls = useCallback(async (userId, query, params) => {
    return callApi(urlApi.searchUrls, userId, query, params);
  }, [callApi]);

  const deleteUrl = useCallback(async (urlId, userId) => {
    return callApi(urlApi.deleteUrl, urlId, userId);
  }, [callApi]);

  const updateUrl = useCallback(async (urlId, data) => {
    return callApi(urlApi.updateUrl, urlId, data);
  }, [callApi]);

  const getUrlStats = useCallback(async (urlId, userId) => {
    return callApi(urlApi.getUrlStats, urlId, userId);
  }, [callApi]);

  return {
    createUrl,
    getUserUrls,
    searchUrls,
    deleteUrl,
    updateUrl,
    getUrlStats,
    loading,
    error,
    clearError
  };
};

/**
 * Custom hook for analytics operations
 */
export const useAnalyticsApi = () => {
  const { callApi, loading, error, clearError } = useApi();
  const { analyticsApi } = require('../utils/api');

  const getUserStats = useCallback(async (userId) => {
    return callApi(analyticsApi.getUserStats, userId);
  }, [callApi]);

  const getUserTimeline = useCallback(async (userId) => {
    return callApi(analyticsApi.getUserTimeline, userId);
  }, [callApi]);

  const getUrlPerformance = useCallback(async (urlId, userId) => {
    return callApi(analyticsApi.getUrlPerformance, urlId, userId);
  }, [callApi]);

  const getGlobalStats = useCallback(async () => {
    return callApi(analyticsApi.getGlobalStats);
  }, [callApi]);

  return {
    getUserStats,
    getUserTimeline,
    getUrlPerformance,
    getGlobalStats,
    loading,
    error,
    clearError
  };
};

export default {
  useApi,
  useUrlApi,
  useAnalyticsApi
}; 