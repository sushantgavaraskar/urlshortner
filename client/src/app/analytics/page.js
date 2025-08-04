'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import RealtimeStats from '../../components/RealtimeStats';
import { useAnalyticsApi } from '../../hooks/useApi';
import { 
  ChartBarIcon, 
  EyeIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getUserStats, getUserTimeline, loading, error } = useAnalyticsApi();
  const [analyticsData, setAnalyticsData] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    topCountries: [],
    deviceTypes: [],
    clickTimeline: [],
    topUrls: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      // Only fetch data if user is authenticated and has a valid ID
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setIsLoading(true);
          const userId = session.user.id;
          
          // Fetch user stats
          const statsResult = await getUserStats(userId);
          const timelineResult = await getUserTimeline(userId);
          
          if (statsResult?.data) {
            setAnalyticsData(prev => ({
              ...prev,
              totalClicks: statsResult.data.totalClicks || 0,
              uniqueVisitors: statsResult.data.uniqueVisitors || 0,
              topCountries: statsResult.data.topCountries || [],
              deviceTypes: statsResult.data.deviceTypes || [],
              topUrls: statsResult.data.topUrls || []
            }));
          }
          
          if (timelineResult?.data) {
            setAnalyticsData(prev => ({
              ...prev,
              clickTimeline: timelineResult.data || []
            }));
          }
        } catch (error) {
          console.error('Error fetching analytics data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        // If not authenticated, redirect to home
        router.push('/');
      }
    };

    fetchAnalyticsData();
  }, [status, session?.user?.id, getUserStats, getUserTimeline, router]);

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner h-12 w-12"></div>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to access analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have a valid user ID
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              User ID Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in again to access analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userId = session.user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights into your link performance and audience behavior
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analyticsData.totalClicks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <GlobeAltIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Visitors</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analyticsData.uniqueVisitors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. CTR</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">0%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Geographic Distribution
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <GlobeAltIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No geographic data available yet</p>
                </div>
              </div>
            </div>

            {/* Device Types */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                  Device Types
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <DevicePhoneMobileIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No device data available yet</p>
                </div>
              </div>
            </div>

            {/* Click Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Click Timeline
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No timeline data available yet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <RealtimeStats userId={userId} analyticsData={analyticsData} />
            
            {/* Top Performing URLs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Top Performing URLs
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No URL data available yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 