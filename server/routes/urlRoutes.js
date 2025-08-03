const express = require('express');
const urlController = require('../controllers/urlController');
const router = express.Router();

// Create short URL
router.post('/create', urlController.createShortUrl);

// Get user's URLs with pagination and filtering
router.get('/user', urlController.getUserUrls);

// Get top URLs (public)
router.get('/top/list', urlController.getTopUrls);

// Search URLs
router.get('/search', urlController.searchUrls);

// Bulk delete URLs
router.delete('/bulk/delete', urlController.bulkDeleteUrls);

// Get single URL details
router.get('/:urlId', urlController.getUrlDetails);

// Get URL statistics
router.get('/:urlId/stats', urlController.getUrlStats);

// Update URL
router.put('/:urlId', urlController.updateUrl);

// Delete URL
router.delete('/:urlId', urlController.deleteUrl);

module.exports = router; 