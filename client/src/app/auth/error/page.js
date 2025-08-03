'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorDetails = (errorCode) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the server configuration. Please try again later.',
          icon: '🔧'
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          icon: '🚫'
        };
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification link has expired or is invalid.',
          icon: '⏰'
        };
      case 'Default':
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication. Please try again.',
          icon: '⚠️'
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-red-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Error Card */}
        <div className="glass-card rounded-2xl p-8 shadow-xl text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">{errorDetails.icon}</span>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {errorDetails.title}
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {errorDetails.message}
          </p>

          {/* Error Code (if available) */}
          {error && (
            <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Error Code: <span className="font-mono text-gray-700 dark:text-gray-300">{error}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full btn-primary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 btn-secondary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Go Home</span>
              </button>
              
              <button
                onClick={() => router.back()}
                className="flex-1 btn-secondary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 