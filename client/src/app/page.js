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
    <div className=&quot;min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900&quot;>
      {/* Background Elements */}
      <div className=&quot;fixed inset-0 overflow-hidden pointer-events-none&quot;>
        <div className=&quot;absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float&quot;></div>
        <div className=&quot;absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float&quot; style={{ animationDelay: '2s' }}></div>
        <div className=&quot;absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-float&quot; style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className=&quot;relative z-10 px-6 py-4&quot;>
        <div className=&quot;max-w-7xl mx-auto flex items-center justify-between&quot;>
          <div className=&quot;flex items-center space-x-3&quot;>
            <div className=&quot;p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg&quot;>
              <LinkIcon className=&quot;h-8 w-8 text-white&quot; />
            </div>
            <span className=&quot;text-2xl font-bold text-gradient&quot;>SmartShort</span>
          </div>
          
          <div className=&quot;flex items-center space-x-4&quot;>
            <button
              onClick={handleGetStarted}
              className=&quot;btn-primary flex items-center space-x-2&quot;
            >
              <span>Get Started</span>
              <ArrowRightIcon className=&quot;h-5 w-5&quot; />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=&quot;relative z-10 px-6 py-20&quot;>
        <div className=&quot;max-w-7xl mx-auto text-center&quot;>
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className=&quot;text-5xl md:text-7xl font-bold mb-6&quot;>
              <span className=&quot;text-gradient&quot;>AI-Powered</span>
              <br />
              <span className=&quot;text-gray-900 dark:text-white&quot;>URL Shortener</span>
            </h1>
            
            <p className=&quot;text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed&quot;>
              Create intelligent, trackable short links with advanced analytics, 
              AI-powered insights, and real-time performance monitoring.
            </p>

            <div className=&quot;flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12&quot;>
              <button
                onClick={handleGetStarted}
                className=&quot;btn-primary text-lg px-8 py-4 flex items-center space-x-2 group&quot;
              >
                <span>Start Creating Links</span>
                <ArrowRightIcon className=&quot;h-5 w-5 group-hover:translate-x-1 transition-transform&quot; />
              </button>
              
              <button 
                onClick={() => setShowQuickStart(true)}
                className=&quot;btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group&quot;
              >
                <SparklesIcon className=&quot;h-5 w-5&quot; />
                <span>Quick Start Guide</span>
              </button>
            </div>

            {/* Stats */}
            <div className=&quot;grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto&quot;>
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`card text-center transition-all duration-500 delay-${index * 100}`}
                >
                  <stat.icon className=&quot;h-8 w-8 mx-auto mb-2 text-blue-600&quot; />
                  <div className=&quot;text-2xl font-bold text-gray-900 dark:text-white&quot;>{stat.value}</div>
                  <div className=&quot;text-sm text-gray-600 dark:text-gray-400&quot;>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=&quot;relative z-10 px-6 py-20&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;text-center mb-16&quot;>
            <h2 className=&quot;text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white&quot;>
              Why Choose <span className=&quot;text-gradient&quot;>SmartShort</span>?
            </h2>
            <p className=&quot;text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto&quot;>
              Experience the next generation of URL shortening with cutting-edge features 
              designed for modern businesses and creators.
            </p>
          </div>

          <div className=&quot;grid md:grid-cols-2 gap-8&quot;>
            <div className=&quot;space-y-8&quot;>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`card cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'scale-105 shadow-glow' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className=&quot;flex items-start space-x-4&quot;>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className=&quot;h-6 w-6 text-white&quot; />
                    </div>
                    <div>
                      <h3 className=&quot;text-xl font-semibold mb-2 text-gray-900 dark:text-white&quot;>
                        {feature.title}
                      </h3>
                      <p className=&quot;text-gray-600 dark:text-gray-400&quot;>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className=&quot;flex items-center justify-center&quot;>
              <div className=&quot;relative w-full max-w-md&quot;>
                <div className=&quot;card p-8 text-center&quot;>
                                     <div className={`p-6 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} mb-6 mx-auto w-20 h-20 flex items-center justify-center shadow-lg`}>
                     {React.createElement(features[activeFeature].icon, { className: &quot;h-10 w-10 text-white&quot; })}
                   </div>
                  <h3 className=&quot;text-2xl font-bold mb-4 text-gray-900 dark:text-white&quot;>
                    {features[activeFeature].title}
                  </h3>
                  <p className=&quot;text-gray-600 dark:text-gray-400 leading-relaxed&quot;>
                    {features[activeFeature].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className=&quot;relative z-10 px-6 py-20&quot;>
        <div className=&quot;max-w-4xl mx-auto text-center&quot;>
          <div className=&quot;card p-12&quot;>
            <h2 className=&quot;text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white&quot;>
              Ready to Get Started?
            </h2>
            <p className=&quot;text-xl text-gray-600 dark:text-gray-300 mb-8&quot;>
              Join thousands of users who trust SmartShort for their link management needs.
            </p>
            
            {session ? (
              <button
                onClick={() => router.push('/dashboard')}
                className=&quot;btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto group&quot;
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className=&quot;h-5 w-5 group-hover:translate-x-1 transition-transform&quot; />
              </button>
            ) : (
              <div className=&quot;space-y-6&quot;>
                <div className=&quot;text-center&quot;>
                  <h3 className=&quot;text-lg font-semibold text-gray-900 dark:text-white mb-2&quot;>
                    Get Started Today
                  </h3>
                  <p className=&quot;text-gray-600 dark:text-gray-400 mb-6&quot;>
                    Choose how you&apos;d like to create your account
                  </p>
                </div>
                
                <div className=&quot;grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto&quot;>
                  <button
                    onClick={() => signIn('google')}
                    className=&quot;group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg text-center&quot;
                  >
                    <div className=&quot;w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform&quot;>
                      <svg className=&quot;h-6 w-6 text-white&quot; viewBox=&quot;0 0 24 24&quot;>
                        <path fill=&quot;currentColor&quot; d=&quot;M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z&quot;/>
                        <path fill=&quot;currentColor&quot; d=&quot;M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z&quot;/>
                        <path fill=&quot;currentColor&quot; d=&quot;M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z&quot;/>
                        <path fill=&quot;currentColor&quot; d=&quot;M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z&quot;/>
                      </svg>
                    </div>
                    <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Google Sign Up</h4>
                    <p className=&quot;text-sm text-gray-600 dark:text-gray-400&quot;>Quick and secure</p>
                  </button>
                  
                  <Link
                    href=&quot;/auth/register&quot;
                    className=&quot;group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 hover:shadow-lg text-center&quot;
                  >
                    <div className=&quot;w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform&quot;>
                      <UserIcon className=&quot;h-6 w-6 text-white&quot; />
                    </div>
                    <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Create Account</h4>
                    <p className=&quot;text-sm text-gray-600 dark:text-gray-400&quot;>Email & password</p>
                  </Link>
                  
                  <button
                    onClick={() => signIn('credentials')}
                    className=&quot;group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg text-center&quot;
                  >
                    <div className=&quot;w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform&quot;>
                      <BoltIcon className=&quot;h-6 w-6 text-white&quot; />
                    </div>
                    <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Demo Login</h4>
                    <p className=&quot;text-sm text-gray-600 dark:text-gray-400&quot;>Try it out</p>
                  </button>
                </div>
                
                <div className=&quot;text-center&quot;>
                  <p className=&quot;text-sm text-gray-500 dark:text-gray-400&quot;>
                    Already have an account?{' '}
                    <button
                      onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
                      className=&quot;text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors&quot;
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
      <footer className=&quot;relative z-10 px-6 py-12 border-t border-gray-200 dark:border-gray-800&quot;>
        <div className=&quot;max-w-7xl mx-auto text-center&quot;>
          <div className=&quot;flex items-center justify-center space-x-3 mb-4&quot;>
            <div className=&quot;p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600&quot;>
              <LinkIcon className=&quot;h-6 w-6 text-white&quot; />
            </div>
            <span className=&quot;text-xl font-bold text-gradient&quot;>SmartShort</span>
          </div>
          <p className=&quot;text-gray-600 dark:text-gray-400&quot;>
            © 2024 SmartShort. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Quick Start Guide Modal */}
      {showQuickStart && (
        <div className=&quot;fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm&quot;>
          <div className=&quot;bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl&quot;>
            <div className=&quot;p-8&quot;>
              {/* Header */}
              <div className=&quot;flex items-center justify-between mb-6&quot;>
                <div className=&quot;flex items-center space-x-3&quot;>
                  <div className=&quot;p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600&quot;>
                    <SparklesIcon className=&quot;h-6 w-6 text-white&quot; />
                  </div>
                  <h2 className=&quot;text-2xl font-bold text-gray-900 dark:text-white&quot;>
                    Quick Start Guide
                  </h2>
                </div>
                <button
                  onClick={() => setShowQuickStart(false)}
                  className=&quot;p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors&quot;
                >
                  <XMarkIcon className=&quot;h-6 w-6&quot; />
                </button>
              </div>

              {/* Content */}
              <div className=&quot;space-y-6&quot;>
                <div className=&quot;space-y-4&quot;>
                  <h3 className=&quot;text-lg font-semibold text-gray-900 dark:text-white&quot;>
                    🚀 Getting Started in 3 Simple Steps
                  </h3>
                  
                  <div className=&quot;space-y-4&quot;>
                    <div className=&quot;flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl&quot;>
                      <div className=&quot;flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm&quot;>
                        1
                      </div>
                      <div>
                        <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>
                          Sign Up & Create Account
                        </h4>
                        <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                          Click &quot;Get Started&quot; and sign in with Google or use our demo account to instantly access the platform.
                        </p>
                      </div>
                    </div>

                    <div className=&quot;flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl&quot;>
                      <div className=&quot;flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm&quot;>
                        2
                      </div>
                      <div>
                        <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>
                          Create Your First Short Link
                        </h4>
                        <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                          Paste any long URL, add a custom alias (optional), and click &quot;Create Link&quot; to generate your short URL.
                        </p>
                      </div>
                    </div>

                    <div className=&quot;flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl&quot;>
                      <div className=&quot;flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm&quot;>
                        3
                      </div>
                      <div>
                        <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>
                          Track & Analyze Performance
                        </h4>
                        <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                          Monitor clicks, view analytics, and get insights about your links in real-time from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=&quot;space-y-4&quot;>
                  <h3 className=&quot;text-lg font-semibold text-gray-900 dark:text-white&quot;>
                    💡 Pro Tips
                  </h3>
                  <div className=&quot;grid md:grid-cols-2 gap-4&quot;>
                    <div className=&quot;p-4 bg-gray-50 dark:bg-gray-800 rounded-xl&quot;>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-2&quot;>Custom Aliases</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Create memorable short URLs like &quot;mysite.com/awesome&quot; instead of random characters.
                      </p>
                    </div>
                    <div className=&quot;p-4 bg-gray-50 dark:bg-gray-800 rounded-xl&quot;>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-2&quot;>Link Expiration</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Set expiration dates for temporary links to automatically disable them after a certain time.
                      </p>
                    </div>
                    <div className=&quot;p-4 bg-gray-50 dark:bg-gray-800 rounded-xl&quot;>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-2&quot;>Real-time Analytics</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Get instant notifications and detailed insights about your link performance.
                      </p>
                    </div>
                    <div className=&quot;p-4 bg-gray-50 dark:bg-gray-800 rounded-xl&quot;>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-2&quot;>Bulk Operations</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Create multiple links at once and manage them efficiently with bulk actions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className=&quot;space-y-4&quot;>
                  <h3 className=&quot;text-lg font-semibold text-gray-900 dark:text-white&quot;>
                    🎯 Use Cases
                  </h3>
                  <div className=&quot;grid md:grid-cols-3 gap-4&quot;>
                    <div className=&quot;text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl&quot;>
                      <div className=&quot;w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3&quot;>
                        <LinkIcon className=&quot;h-6 w-6 text-white&quot; />
                      </div>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Social Media</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Shorten links for Twitter, Instagram, and other social platforms
                      </p>
                    </div>
                    <div className=&quot;text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl&quot;>
                      <div className=&quot;w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3&quot;>
                        <ChartBarIcon className=&quot;h-6 w-6 text-white&quot; />
                      </div>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Marketing</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Track campaign performance and analyze click-through rates
                      </p>
                    </div>
                    <div className=&quot;text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl&quot;>
                      <div className=&quot;w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3&quot;>
                        <BoltIcon className=&quot;h-6 w-6 text-white&quot; />
                      </div>
                      <h4 className=&quot;font-semibold text-gray-900 dark:text-white mb-1&quot;>Business</h4>
                      <p className=&quot;text-gray-600 dark:text-gray-400 text-sm&quot;>
                        Share professional links with custom branding and tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className=&quot;mt-8 pt-6 border-t border-gray-200 dark:border-gray-700&quot;>
                <div className=&quot;flex flex-col sm:flex-row gap-4&quot;>
                  <button
                    onClick={handleGetStarted}
                    className=&quot;flex-1 btn-primary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105&quot;
                  >
                    Get Started Now
                  </button>
                  <button
                    onClick={() => setShowQuickStart(false)}
                    className=&quot;flex-1 btn-secondary py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105&quot;
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
