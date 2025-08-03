const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const router = express.Router();

// Get user dashboard statistics
router.get('/user/stats', analyticsController.getUserStats);

// Get user analytics by user ID
router.get('/user/:userId', analyticsController.getUserStats);

// Get user activity timeline
router.get('/user/timeline', analyticsController.getUserTimeline);

// Get URL performance analytics
router.get('/url/:urlId/performance', analyticsController.getUrlPerformance);

// Get global statistics (public)
router.get('/global/stats', analyticsController.getGlobalStats);

// Get overall statistics (alias for global stats)
router.get('/overall', analyticsController.getGlobalStats);

module.exports = router; 