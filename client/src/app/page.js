'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LinkIcon, 
  ChartBarIcon, 
  BoltIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  GlobeAltIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showQuickStart, setShowQuickStart] = useState(false);

  useEffect(() => {
    // Only set loaded state on client side
    if (typeof window !== 'undefined') {
      setIsLoaded(true);
      
      // Auto-rotate features
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % 4);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, []);

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analytics',
      description: 'Get intelligent insights about your links with our advanced AI analysis',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Create and manage your links instantly with our optimized platform',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Tracking',
      description: 'Monitor your links in real-time with detailed analytics and insights',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { label: 'Links Created', value: '10M+', icon: LinkIcon },
    { label: 'Active Users', value: '50K+', icon: UsersIcon },
    { label: 'Countries', value: '150+', icon: GlobeAltIcon },
    { label: 'Uptime', value: '99.9%', icon: StarIcon }
  ];

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      signIn(undefined, { callbackUrl: '/dashboard' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">SmartShort</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGetStarted}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">AI-Powered</span>
              <br />
              <span className="text-gray-900 dark:text-white">URL Shortener</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create intelligent, trackable short links with advanced analytics, 
              AI-powered insights, and real-time performance monitoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <span>Start Creating Links</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setShowQuickStart(true)}
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Quick Start Guide</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`card text-center transition-all duration-500 delay-${index * 100}`}
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Why Choose <span className="text-gradient">SmartShort</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of URL shortening with cutting-edge features 
              designed for modern businesses and creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`card cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'scale-105 shadow-glow' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="card p-8 text-center">
                                     <div className={`p-6 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} mb-6 mx-auto w-20 h-20 flex items-center justify-center shadow-lg`}>
                     {React.createElement(features[activeFeature].icon, { className: "h-10 w-10 text-white" })}
                   </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {features[activeFeature].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who trust SmartShort for their link management needs.
            </p>
            
            {session ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto group"
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Get Started Today
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Choose how you'd like to create your account
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => signIn('google')}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Google Sign Up</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quick and secure</p>
                  </button>
                  
                  <Link
                    href="/auth/register"
                    className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Create Account</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email & password</p>
                  </Link>
                  
                  <button
                    onClick={() => signIn('credentials')}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <BoltIcon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Demo Login</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Try it out</p>
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">SmartShort</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 SmartShort. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Quick Start Guide Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quick Start Guide
                  </h2>
                </div>
                <button
                  onClick={() => setShowQuickStart(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🚀 Getting Started in 3 Simple Steps
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Sign Up & Create Account
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Click "Get Started" and sign in with Google or use our demo account to instantly access the platform.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Create Your First Short Link
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Paste any long URL, add a custom alias (optional), and click "Create Link" to generate your short URL.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Track & Analyze Performance
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Monitor clicks, view analytics, and get insights about your links in real-time from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    💡 Pro Tips
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Aliases</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Create memorable short URLs like "mysite.com/awesome" instead of random characters.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Link Expiration</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Set expiration dates for temporary links to automatically disable them after a certain time.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Analytics</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Get instant notifications and detailed insights about your link performance.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bulk Operations</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Create multiple links at once and manage them efficiently with bulk actions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🎯 Use Cases
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <LinkIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Social Media</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Shorten links for Twitter, Instagram, and other social platforms
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Marketing</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Track campaign performance and analyze click-through rates
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BoltIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Business</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Share professional links with custom branding and tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="flex-1 btn-primary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Get Started Now
                  </button>
                  <button
                    onClick={() => setShowQuickStart(false)}
                    className="flex-1 btn-secondary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Close Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
