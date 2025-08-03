&apos;use client';

import { useState } from &apos;react';
import { useRouter } from &apos;next/navigation';
import Link from &apos;next/link';
import { 
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual password reset API
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
    } catch (error) {
      setError(&apos;Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className=&quot;min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className=&quot;relative z-10 w-full max-w-md">
          {/* Back to Sign In */}
          <button
            onClick={() => router.push('/auth/signin')}
            className=&quot;flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftIcon className=&quot;h-4 w-4 mr-2" />
            Back to Sign In
          </button>

          <div className=&quot;bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className=&quot;text-center">
              <div className=&quot;w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className=&quot;h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className=&quot;text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h1>
              
              <p className=&quot;text-gray-600 dark:text-gray-400 mb-6">
                We&apos;ve sent a password reset link to <span className=&quot;font-medium text-gray-900 dark:text-white">{email}</span>
              </p>
              
              <div className=&quot;bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className=&quot;text-sm text-blue-800 dark:text-blue-200">
                  If you don&apos;t see the email, check your spam folder or try again.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className=&quot;w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Send Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&quot;min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className=&quot;fixed inset-0 overflow-hidden pointer-events-none">
        <div className=&quot;absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className=&quot;absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: &apos;2s' }}></div>
      </div>

      <div className=&quot;relative z-10 w-full max-w-md">
        {/* Back to Sign In */}
        <button
          onClick={() => router.push('/auth/signin')}
          className=&quot;flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeftIcon className=&quot;h-4 w-4 mr-2" />
          Back to Sign In
        </button>

        <div className=&quot;bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className=&quot;text-center mb-8">
            <h1 className=&quot;text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className=&quot;text-gray-600 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className=&quot;mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className=&quot;text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className=&quot;space-y-6">
            <div>
              <label htmlFor=&quot;email" className=&quot;block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className=&quot;relative">
                <EnvelopeIcon className=&quot;absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type=&quot;email"
                  id=&quot;email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=&quot;w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder=&quot;Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              type=&quot;submit"
              disabled={isLoading}
              className=&quot;w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className=&quot;loading-spinner h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                &apos;Send Reset Link'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className=&quot;mt-8 text-center">
            <p className=&quot;text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link 
                href="/auth/signin"
                className=&quot;text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 