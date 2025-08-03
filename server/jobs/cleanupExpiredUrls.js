const Url = require('../models/Url');
const logger = require('../utils/logger');

const cleanupExpiredUrls = async () => {
  try {
    logger.info('🧹 Starting expired URLs cleanup job');

    const now = new Date();
    
    // Find expired URLs
    const expiredUrls = await Url.find({
      expiresAt: { $lt: now },
      isActive: true
    });

    if (expiredUrls.length === 0) {
      logger.info('✅ No expired URLs found');
      return;
    }

    // Deactivate expired URLs instead of deleting them
    const result = await Url.updateMany(
      {
        expiresAt: { $lt: now },
        isActive: true
      },
      {
        $set: { isActive: false }
      }
    );

    logger.info(`✅ Cleanup completed: ${result.modifiedCount} URLs deactivated`);

    // Log details of deactivated URLs
    expiredUrls.forEach(url => {
      logger.info(`🔗 Deactivated URL: ${url.shortCode} -> ${url.originalUrl}`, {
        urlId: url._id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        expiredAt: url.expiresAt,
        totalClicks: url.clicks
      });
    });

  } catch (error) {
    logger.error('❌ Error during cleanup job:', error);
  }
};

module.exports = cleanupExpiredUrls; 