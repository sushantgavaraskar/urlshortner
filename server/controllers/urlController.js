import shortenerService from '../services/shortenerService.js';
import aiService from '../services/aiService.js';
import Url from '../models/Url.js';
import User from '../models/User.js';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler.js';
import { apiResponse } from '../middleware/responseFormatter.js';

class UrlController {
  // Create short URL
  createShortUrl = asyncHandler(async (req, res) => {
    const { originalUrl, customAlias, title, description, expiresAt } = req.body;
    const userId = req.user?.id || req.body.userId; // For testing without auth

    if (!originalUrl) {
      throw new ValidationError('Original URL is required');
    }

    if (!userId) {
      throw new ValidationError('User authentication required');
    }

    // Analyze URL with AI for metadata (non-blocking)
    let metadata = {};
    try {
      metadata = await aiService.analyzeUrlContent(originalUrl);
    } catch (error) {
      console.warn('AI analysis failed, continuing without metadata:', error.message);
      // Provide basic metadata
      metadata = {
        title: title || 'Untitled',
        description: description || '',
        keywords: [],
        suggestedAlias: customAlias || null
      };
    }

    // Create short URL
    const url = await shortenerService.createShortUrl(originalUrl, userId, {
      customAlias,
      title: title || metadata.title,
      description: description || metadata.description,
      keywords: metadata.keywords || [],
      previewImage: metadata.previewImage,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    return apiResponse.created(res, url, 'URL shortened successfully');
  });

  // Redirect to original URL
  redirectToOriginal = async (req, res) => {
    try {
      const { shortCode } = req.params;

      if (!shortCode) {
        return res.status(400).json({
          error: 'Short code is required',
          message: 'Please provide a valid short URL'
        });
      }

      console.log(`🔍 Looking for URL with shortCode: ${shortCode}`);

      // First, let's check if the URL exists at all
      const allUrls = await Url.find({ shortCode });
      console.log(`📊 Found ${allUrls.length} URLs with shortCode: ${shortCode}`);
      
      if (allUrls.length > 0) {
        console.log('URL details:', allUrls[0]);
      }

      const url = await Url.findOne({ 
        shortCode, 
        isActive: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      });

      if (!url) {
        console.log(`❌ URL not found or expired for shortCode: ${shortCode}`);
        
        // Let's check what URLs exist with this shortCode
        const existingUrls = await Url.find({ shortCode });
        if (existingUrls.length > 0) {
          console.log('Existing URLs with this shortCode:', existingUrls.map(u => ({
            id: u._id,
            shortCode: u.shortCode,
            isActive: u.isActive,
            expiresAt: u.expiresAt,
            originalUrl: u.originalUrl
          })));
        }
        
        return res.status(404).json({
          error: 'URL not found or expired',
          message: 'The requested short URL does not exist or has expired',
          shortCode: shortCode
        });
      }

      console.log(`✅ Found URL: ${url.originalUrl} for shortCode: ${shortCode}`);

      // Update click statistics
      url.clicks += 1;
      url.lastClicked = new Date();
      url.clickHistory.push({
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      });

      await url.save();
      console.log(`📊 Updated click count for ${shortCode}: ${url.clicks}`);

      // Emit real-time update if Socket.IO is available
      if (req.app.get('io')) {
        req.app.get('io').to(`user_${url.userId}`).emit('urlClicked', {
          urlId: url._id,
          shortCode: url.shortCode,
          clicks: url.clicks
        });
      }

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error('Redirect error in controller:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while processing your request'
      });
    }
  };

  // Get user's URLs
  getUserUrls = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.query.userId;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', filter = 'all' } = req.query;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    // Build filter query
    let filterQuery = { userId };
    if (filter === 'active') {
      filterQuery.isActive = true;
    } else if (filter === 'expired') {
      filterQuery.expiresAt = { $lt: new Date() };
    }

    const [urls, total] = await Promise.all([
      Url.find(filterQuery)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Url.countDocuments(filterQuery)
    ]);

    return res.paginated(urls, page, limit, total);
  });

  // Get URL details
  getUrlDetails = asyncHandler(async (req, res) => {
    const { urlId } = req.params;
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const url = await Url.findOne({ _id: urlId, userId }).select('-__v');

    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return res.success(url);
  });

  // Update URL
  updateUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params;
    const userId = req.user?.id || req.body.userId;
    const updateData = req.body;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const url = await Url.findOne({ _id: urlId, userId });

    if (!url) {
      throw new NotFoundError('URL not found');
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'customAlias', 'expiresAt'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    const updatedUrl = await Url.findByIdAndUpdate(
      urlId,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    return apiResponse.updated(res, updatedUrl, 'URL updated successfully');
  });

  // Delete URL
  deleteUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const url = await Url.findOne({ _id: urlId, userId });

    if (!url) {
      throw new NotFoundError('URL not found');
    }

    await Url.findByIdAndDelete(urlId);

    return apiResponse.deleted(res, 'URL deleted successfully');
  });

  // Bulk delete URLs
  bulkDeleteUrls = asyncHandler(async (req, res) => {
    const { urlIds, userId } = req.body;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!urlIds || !Array.isArray(urlIds) || urlIds.length === 0) {
      throw new ValidationError('URL IDs array is required');
    }

    const result = await Url.deleteMany({
      _id: { $in: urlIds },
      userId
    });

    return apiResponse.deleted(res, `${result.deletedCount} URLs deleted successfully`);
  });

  // Get URL statistics
  getUrlStats = asyncHandler(async (req, res) => {
    const { urlId } = req.params;
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const url = await Url.findOne({ _id: urlId, userId });

    if (!url) {
      throw new NotFoundError('URL not found');
    }

    const stats = {
      totalClicks: url.clicks,
      clickHistory: url.clickHistory,
      createdAt: url.createdAt,
      lastClicked: url.clickHistory.length > 0 ? url.clickHistory[url.clickHistory.length - 1].timestamp : null
    };

    return res.success(stats);
  });

  // Search URLs
  searchUrls = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.query.userId;
    const { q, page = 1, limit = 10 } = req.query;

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!q) {
      throw new ValidationError('Search query is required');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchRegex = new RegExp(q, 'i');

    const [urls, total] = await Promise.all([
      Url.find({
        userId,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { originalUrl: searchRegex },
          { shortCode: searchRegex }
        ]
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Url.countDocuments({
        userId,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { originalUrl: searchRegex },
          { shortCode: searchRegex }
        ]
      })
    ]);

    return res.paginated(urls, page, limit, total);
  });

  // Get top URLs (public)
  getTopUrls = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const urls = await Url.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(parseInt(limit))
      .select('shortCode originalUrl clicks title')
      .populate('userId', 'name email');

    return res.success(urls);
  });
}

export default new UrlController(); 