'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import UrlManager from '../../components/UrlManager';
import RealtimeStats from '../../components/RealtimeStats';
import { 
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
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
              Please sign in to access your dashboard.
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
              Please sign in again to access your dashboard.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <UrlManager userId={userId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RealtimeStats userId={userId} />
            
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Total Clicks</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    -
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Active Links</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    -
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Recent Activity</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    -
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
} 