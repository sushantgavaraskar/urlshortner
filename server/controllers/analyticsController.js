const Url = require('../models/Url');
const User = require('../models/User');

class AnalyticsController {
  // Get user dashboard statistics
  async getUserStats(req, res) {
    try {
      const userId = req.user?.id || req.query.userId || req.params.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      // Get total URLs
      const totalUrls = await Url.countDocuments({ userId });

      // Get total clicks
      const totalClicks = await Url.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, total: { $sum: '$clicks' } } }
      ]);

      // Get recent URLs (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUrls = await Url.countDocuments({
        userId,
        createdAt: { $gte: sevenDaysAgo }
      });

      // Get top performing URLs
      const topUrls = await Url.find({ userId })
        .sort({ clicks: -1 })
        .limit(5)
        .select('shortCode originalUrl clicks title');

      // Get clicks by day (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const clicksByDay = await Url.aggregate([
        { $match: { userId: userId } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.timestamp': { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$clickHistory.timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Convert to object format
      const clicksByDayObj = {};
      clicksByDay.forEach(item => {
        clicksByDayObj[item._id] = item.clicks;
      });

      res.json({
        success: true,
        data: {
          totalUrls,
          totalClicks: totalClicks[0]?.total || 0,
          recentUrls,
          topUrls,
          clicksByDay: clicksByDayObj
        }
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  }

  // Get global statistics (admin/public)
  async getGlobalStats(req, res) {
    try {
      // Get total URLs
      const totalUrls = await Url.countDocuments({ isActive: true });

      // Get total clicks
      const totalClicks = await Url.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$clicks' } } }
      ]);

      // Get total users
      const totalUsers = await User.countDocuments({ isActive: true });

      // Get recent activity (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recentUrls = await Url.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });

      const recentClicks = await Url.aggregate([
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.timestamp': { $gte: oneDayAgo } } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]);

      // Get top domains
      const topDomains = await Url.aggregate([
        { $match: { isActive: true, domain: { $exists: true } } },
        { $group: { _id: '$domain', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      res.json({
        success: true,
        data: {
          totalUrls,
          totalClicks: totalClicks[0]?.total || 0,
          totalUsers,
          recentUrls,
          recentClicks: recentClicks[0]?.count || 0,
          topDomains
        }
      });

    } catch (error) {
      console.error('Get global stats error:', error);
      res.status(500).json({ error: 'Failed to fetch global statistics' });
    }
  }

  // Get URL performance analytics
  async getUrlPerformance(req, res) {
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

      // Get click trends by hour (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const clicksByHour = await Url.aggregate([
        { $match: { _id: url._id } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.timestamp': { $gte: oneDayAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d %H:00', date: '$clickHistory.timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get referrer statistics
      const referrerStats = await Url.aggregate([
        { $match: { _id: url._id } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.referrer': { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$clickHistory.referrer',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Get device statistics
      const deviceStats = await Url.aggregate([
        { $match: { _id: url._id } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.device': { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$clickHistory.device',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Get country statistics
      const countryStats = await Url.aggregate([
        { $match: { _id: url._id } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.country': { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$clickHistory.country',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      res.json({
        success: true,
        data: {
          url: {
            shortCode: url.shortCode,
            originalUrl: url.originalUrl,
            title: url.title,
            totalClicks: url.clicks,
            createdAt: url.createdAt
          },
          clicksByHour,
          referrerStats,
          deviceStats,
          countryStats
        }
      });

    } catch (error) {
      console.error('Get URL performance error:', error);
      res.status(500).json({ error: 'Failed to fetch URL performance' });
    }
  }

  // Get user activity timeline
  async getUserTimeline(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const { days = 30 } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      // Get URL creation timeline
      const urlTimeline = await Url.aggregate([
        { $match: { userId: userId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get click activity timeline
      const clickTimeline = await Url.aggregate([
        { $match: { userId: userId } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.timestamp': { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$clickHistory.timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        success: true,
        data: {
          urlTimeline,
          clickTimeline
        }
      });

    } catch (error) {
      console.error('Get user timeline error:', error);
      res.status(500).json({ error: 'Failed to fetch user timeline' });
    }
  }

  // Get real-time analytics (for WebSocket)
  async getRealtimeStats(userId) {
    try {
      // Get today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayUrls = await Url.countDocuments({
        userId,
        createdAt: { $gte: today }
      });

      const todayClicks = await Url.aggregate([
        { $match: { userId: userId } },
        { $unwind: '$clickHistory' },
        { $match: { 'clickHistory.timestamp': { $gte: today } } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]);

      // Get recent clicks (last 10)
      const recentClicks = await Url.aggregate([
        { $match: { userId: userId } },
        { $unwind: '$clickHistory' },
        { $sort: { 'clickHistory.timestamp': -1 } },
        { $limit: 10 },
        {
          $project: {
            shortCode: 1,
            originalUrl: 1,
            clickTime: '$clickHistory.timestamp',
            clickIP: '$clickHistory.ip'
          }
        }
      ]);

      return {
        todayUrls,
        todayClicks: todayClicks[0]?.count || 0,
        recentClicks
      };

    } catch (error) {
      console.error('Get realtime stats error:', error);
      return null;
    }
  }
}

module.exports = new AnalyticsController(); 