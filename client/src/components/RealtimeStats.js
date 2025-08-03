'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  ChartBarIcon, 
  LinkIcon, 
  EyeIcon, 
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function RealtimeStats({ userId, analyticsData }) {
  const [socket, setSocket] = useState(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    todayClicks: 0,
    topLinks: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Initialize Socket.IO connection with aggressive cache busting
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      query: { 
        v: Date.now(),
        cache: Math.random().toString(36).substring(7)
      },
      forceNew: true
    });

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      
      // Join user's private room
      if (userId) {
        console.log('Emitting joinUserRoom with userId:', userId, 'Type:', typeof userId);
        socketInstance.emit('joinUserRoom', userId);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    // Listen for real-time stats updates
    socketInstance.on('statsUpdate', (data) => {
      setStats(prevStats => ({
        ...prevStats,
        ...data
      }));
    });

    // Listen for URL click events
    socketInstance.on('urlClicked', (data) => {
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'click',
          urlId: data.urlId,
          shortCode: data.shortCode,
          clicks: data.clicks,
          timestamp: new Date()
        },
        ...prev.slice(0, 9) // Keep only last 10 activities
      ]);
    });

    // Listen for new URL creation
    socketInstance.on('urlCreated', (data) => {
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'created',
          urlId: data.urlId,
          shortCode: data.shortCode,
          title: data.title,
          timestamp: new Date()
        },
        ...prev.slice(0, 9)
      ]);
    });

    // Request initial stats
    console.log('Emitting requestStats with userId:', userId, 'Type:', typeof userId);
    socketInstance.emit('requestStats', userId);

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Update stats when analyticsData changes
  useEffect(() => {
    if (analyticsData) {
      setStats(prevStats => ({
        ...prevStats,
        totalClicks: analyticsData.totalClicks || prevStats.totalClicks,
        totalLinks: analyticsData.topUrls?.length || prevStats.totalLinks
      }));
    }
  }, [analyticsData]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'click':
        return <EyeIcon className="h-4 w-4 text-green-500" />;
      case 'created':
        return <LinkIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'click':
        return `Link ${activity.shortCode} was clicked (${activity.clicks} total clicks)`;
      case 'created':
        return `New link ${activity.shortCode} was created`;
      default:
        return 'Activity recorded';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Real-time Analytics
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-3">
              <LinkIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Links</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalLinks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-3">
              <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Clicks</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalClicks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Today&apos;s Clicks</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.todayClicks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-3">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. CTR</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.totalLinks > 0 ? Math.round((stats.totalClicks / stats.totalLinks) * 100) / 100 : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center space-x-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {getActivityText(activity)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Links */}
      {stats.topLinks && stats.topLinks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Top Performing Links
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.topLinks.map((link, index) => (
              <div key={link._id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {link.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      /r/{link.shortCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {link.clicks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 