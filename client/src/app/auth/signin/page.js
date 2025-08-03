&apos;use client';

import React, { useState, Suspense } from &apos;react';
import { signIn, getSession } from &apos;next-auth/react';
import { useRouter, useSearchParams } from &apos;next/navigation';
import { 
  LinkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get(&apos;callbackUrl') || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(&apos;credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(&apos;Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError(&apos;An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(&apos;google', { callbackUrl });
    } catch (error) {
      setError(&apos;Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn(&apos;credentials', {
        email: &apos;demo@example.com',
        password: &apos;demo123',
        redirect: false,
      });

      if (result?.error) {
        setError(&apos;Demo sign-in failed. Please try again.');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError(&apos;Demo sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=&quot;min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className=&quot;fixed inset-0 overflow-hidden pointer-events-none">
        <div className=&quot;absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className=&quot;absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: &apos;2s' }}></div>
      </div>

      <div className=&quot;relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => router.push('/')}
          className=&quot;flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeftIcon className=&quot;h-4 w-4 mr-2" />
          Back to Home
        </button>

        {/* Sign In Card */}
        <div className=&quot;glass-card rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className=&quot;text-center mb-8">
            <div className=&quot;mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <LinkIcon className=&quot;h-8 w-8 text-white" />
            </div>
            <h1 className=&quot;text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className=&quot;text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your SmartShort account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className=&quot;mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className=&quot;text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Sign In */}
          <button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className=&quot;w-full mb-6 btn-secondary text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? &apos;Signing in...' : '🚀 Try Demo Account'}
          </button>

          {/* Divider */}
          <div className=&quot;relative mb-6">
            <div className=&quot;absolute inset-0 flex items-center">
              <div className=&quot;w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className=&quot;relative flex justify-center text-sm">
              <span className=&quot;px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className=&quot;w-full mb-6 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className=&quot;w-5 h-5 mr-3" viewBox=&quot;0 0 24 24">
              <path fill="#4285F4" d=&quot;M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d=&quot;M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d=&quot;M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d=&quot;M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className=&quot;relative mb-6">
            <div className=&quot;absolute inset-0 flex items-center">
              <div className=&quot;w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className=&quot;relative flex justify-center text-sm">
              <span className=&quot;px-2 bg-white dark:bg-gray-900 text-gray-500">Or sign in with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className=&quot;space-y-4">
            <div>
              <label htmlFor=&quot;email" className=&quot;block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type=&quot;email"
                id=&quot;email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className=&quot;w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder=&quot;Enter your email"
                required
              />
            </div>

            <div>
              <div className=&quot;flex items-center justify-between mb-2">
                <label htmlFor=&quot;password" className=&quot;block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type=&quot;button"
                  onClick={() => router.push('/auth/forgot-password')}
                  className=&quot;text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className=&quot;relative">
                <input
                  type={showPassword ? &apos;text' : &apos;password'}
                  id=&quot;password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className=&quot;w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                  placeholder=&quot;Enter your password"
                  required
                />
                <button
                  type=&quot;button"
                  onClick={() => setShowPassword(!showPassword)}
                  className=&quot;absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className=&quot;h-5 w-5" />
                  ) : (
                    <EyeIcon className=&quot;h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type=&quot;submit"
              disabled={isLoading}
              className=&quot;w-full btn-primary py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? &apos;Signing in...' : &apos;Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className=&quot;mt-8 text-center">
            <p className=&quot;text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/auth/register')}
                className=&quot;text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}