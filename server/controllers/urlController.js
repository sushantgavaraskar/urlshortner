const shortenerService = require('../services/shortenerService');
const aiService = require('../services/aiService');
const Url = require('../models/Url');

class UrlController {
  // Create short URL
  async createShortUrl(req, res) {
    try {
      const { originalUrl, customAlias, title, description, expiresAt } = req.body;
      const userId = req.user?.id || req.body.userId; // For testing without auth

      if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
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

      res.status(201).json({
        success: true,
        data: url,
        metadata: {
          suggestedAlias: metadata.suggestedAlias,
          category: metadata.category
        }
      });

    } catch (error) {
      console.error('Create URL error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create short URL' 
      });
    }
  }

  // Redirect to original URL
  async redirectToOriginal(req, res) {
    try {
      const { shortCode } = req.params;
      
      const url = await shortenerService.getUrlByShortCode(shortCode);
      
      // Update click statistics
      const clickData = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer'),
        // Add geo-location data if available
        country: req.headers['cf-ipcountry'] || null,
        city: req.headers['cf-ipcity'] || null
      };

      await shortenerService.updateUrlClicks(url._id, clickData);

      // Emit real-time update via Socket.IO
      if (req.app.get('io')) {
        req.app.get('io').to(url.userId.toString()).emit('urlClicked', {
          urlId: url._id,
          shortCode: url.shortCode,
          clicks: url.clicks + 1
        });
      }

      res.redirect(url.originalUrl);

    } catch (error) {
      console.error('Redirect error:', error);
      res.status(404).json({ error: 'URL not found or expired' });
    }
  }

  // Get user's URLs
  async getUserUrls(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const { page, limit, sortBy, sortOrder } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      // Check if user exists (for testing purposes, we'll create a demo user if needed)
      const User = require('../models/User');
      let user = await User.findById(userId);
      
      if (!user) {
        // For demo purposes, create a test user if it doesn't exist
        if (userId === '1' || userId === 'demo') {
          user = new User({
            _id: userId,
            email: 'demo@example.com',
            name: 'Demo User',
            provider: 'credentials'
          });
          await user.save();
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      }

      const result = await shortenerService.getUserUrls(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc'
      });

      res.json({
        success: true,
        data: result.urls,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get user URLs error:', error);
      res.status(500).json({ error: 'Failed to fetch URLs' });
    }
  }

  // Get single URL details
  async getUrlDetails(req, res) {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      const url = await Url.findOne({ _id: urlId, userId })
        .populate('userId', 'name email');

      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      res.json({
        success: true,
        data: url
      });

    } catch (error) {
      console.error('Get URL details error:', error);
      res.status(500).json({ error: 'Failed to fetch URL details' });
    }
  }

  // Update URL
  async updateUrl(req, res) {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id || req.body.userId;
      const updateData = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      const updatedUrl = await shortenerService.updateUrl(urlId, userId, updateData);

      res.json({
        success: true,
        data: updatedUrl
      });

    } catch (error) {
      console.error('Update URL error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to update URL' 
      });
    }
  }

  // Delete URL
  async deleteUrl(req, res) {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      const result = await shortenerService.deleteUrl(urlId, userId);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Delete URL error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to delete URL' 
      });
    }
  }

  // Get top URLs (public)
  async getTopUrls(req, res) {
    try {
      const { limit } = req.query;
      const urls = await shortenerService.getTopUrls(parseInt(limit) || 10);

      res.json({
        success: true,
        data: urls
      });

    } catch (error) {
      console.error('Get top URLs error:', error);
      res.status(500).json({ error: 'Failed to fetch top URLs' });
    }
  }

  // Get URL statistics
  async getUrlStats(req, res) {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      // Calculate unique clicks
      const uniqueIPs = new Set(url.clickHistory.map(click => click.ip).filter(ip => ip));
      const uniqueClicks = uniqueIPs.size;

      // Calculate recent clicks (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentClicks = url.clickHistory.filter(click => 
        click.timestamp >= sevenDaysAgo
      );

      // Group clicks by day
      const clicksByDay = {};
      recentClicks.forEach(click => {
        const date = click.timestamp.toISOString().split('T')[0];
        clicksByDay[date] = (clicksByDay[date] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          totalClicks: url.clicks,
          uniqueClicks,
          lastClicked: url.lastClicked,
          clicksByDay,
          totalHistory: url.clickHistory.length
        }
      });

    } catch (error) {
      console.error('Get URL stats error:', error);
      res.status(500).json({ error: 'Failed to fetch URL statistics' });
    }
  }

  // Bulk delete URLs
  async bulkDeleteUrls(req, res) {
    try {
      const { urlIds } = req.body;
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      if (!urlIds || !Array.isArray(urlIds)) {
        return res.status(400).json({ error: 'URL IDs array is required' });
      }

      const result = await Url.deleteMany({
        _id: { $in: urlIds },
        userId
      });

      res.json({
        success: true,
        message: `Deleted ${result.deletedCount} URLs`
      });

    } catch (error) {
      console.error('Bulk delete URLs error:', error);
      res.status(500).json({ error: 'Failed to delete URLs' });
    }
  }

  // Search URLs
  async searchUrls(req, res) {
    try {
      const { q, page, limit } = req.query;
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const searchQuery = {
        userId,
        $or: [
          { originalUrl: { $regex: q, $options: 'i' } },
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { shortCode: { $regex: q, $options: 'i' } },
          { customAlias: { $regex: q, $options: 'i' } }
        ]
      };

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      const urls = await Url.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('userId', 'name email');

      const total = await Url.countDocuments(searchQuery);

      res.json({
        success: true,
        data: urls,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });

    } catch (error) {
      console.error('Search URLs error:', error);
      res.status(500).json({ error: 'Failed to search URLs' });
    }
  }
}

module.exports = new UrlController(); 