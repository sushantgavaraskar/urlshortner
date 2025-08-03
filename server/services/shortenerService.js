const Url = require('../models/Url');
const crypto = require('crypto');

class ShortenerService {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  }

  generateShortCode(length = 6) {
    return crypto.randomBytes(length)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, length);
  }

  async createShortUrl(originalUrl, userId, options = {}) {
    try {
      if (!this.isValidUrl(originalUrl)) {
        throw new Error('Invalid URL format');
      }

      let shortCode = options.customAlias;
      
      if (shortCode) {
        if (!this.isValidCustomAlias(shortCode)) {
          throw new Error('Invalid custom alias format');
        }
        
        const existingUrl = await Url.findOne({ shortCode });
        if (existingUrl) {
          throw new Error('Custom alias already exists');
        }
      } else {
        shortCode = await this.generateUniqueShortCode();
      }

      const urlData = {
        originalUrl,
        shortCode,
        userId,
        customAlias: options.customAlias || null,
        title: options.title || null,
        description: options.description || null,
        keywords: options.keywords || [],
        previewImage: options.previewImage || null,
        expiresAt: options.expiresAt || null
      };

      const url = new Url(urlData);
      await url.save();
      return url;
    } catch (error) {
      throw error;
    }
  }

  async generateUniqueShortCode(length = 6, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const shortCode = this.generateShortCode(length);
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        return shortCode;
      }
    }
    return this.generateUniqueShortCode(length + 1, maxAttempts);
  }

  async getUrlByShortCode(shortCode) {
    try {
      const url = await Url.findOne({ 
        shortCode, 
        isActive: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      });

      if (!url) {
        throw new Error('URL not found or expired');
      }

      return url;
    } catch (error) {
      throw error;
    }
  }

  async updateUrlClicks(urlId, clickData = {}) {
    try {
      const url = await Url.findById(urlId);
      if (!url) {
        throw new Error('URL not found');
      }

      url.clicks += 1;
      url.lastClicked = new Date();

      url.clickHistory.push({
        timestamp: new Date(),
        ip: clickData.ip || null,
        userAgent: clickData.userAgent || null,
        referrer: clickData.referrer || null,
        country: clickData.country || null,
        city: clickData.city || null,
        device: clickData.device || null,
        browser: clickData.browser || null
      });

      if (url.clickHistory.length > 1000) {
        url.clickHistory = url.clickHistory.slice(-1000);
      }

      await url.save();
      return url;
    } catch (error) {
      throw error;
    }
  }

  async getUserUrls(userId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const urls = await Url.find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email');

      const total = await Url.countDocuments({ userId });

      return {
        urls,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUrl(urlId, userId, updateData) {
    try {
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      if (updateData.customAlias) {
        if (!this.isValidCustomAlias(updateData.customAlias)) {
          throw new Error('Invalid custom alias format');
        }
        
        const existingUrl = await Url.findOne({ 
          shortCode: updateData.customAlias,
          _id: { $ne: urlId }
        });
        
        if (existingUrl) {
          throw new Error('Custom alias already exists');
        }
      }

      const allowedFields = ['title', 'description', 'keywords', 'previewImage', 'expiresAt', 'isActive'];
      const filteredData = {};
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      if (updateData.customAlias) {
        filteredData.shortCode = updateData.customAlias;
        filteredData.customAlias = updateData.customAlias;
      }

      const updatedUrl = await Url.findByIdAndUpdate(
        urlId,
        filteredData,
        { new: true, runValidators: true }
      );

      return updatedUrl;
    } catch (error) {
      throw error;
    }
  }

  async deleteUrl(urlId, userId) {
    try {
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      await Url.findByIdAndDelete(urlId);
      return { message: 'URL deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getTopUrls(limit = 10) {
    try {
      const urls = await Url.find({ isActive: true })
        .sort({ clicks: -1 })
        .limit(limit)
        .populate('userId', 'name');

      return urls;
    } catch (error) {
      throw error;
    }
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidCustomAlias(alias) {
    const aliasRegex = /^[a-zA-Z0-9-]{3,20}$/;
    return aliasRegex.test(alias);
  }

  getFullShortUrl(shortCode) {
    return `${this.baseUrl}/r/${shortCode}`;
  }
}

module.exports = new ShortenerService(); 