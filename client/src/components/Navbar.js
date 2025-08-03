'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  LinkIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Settings from './Settings';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }

      // Handle scroll effect
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen || isNotificationsOpen) {
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        let clickedInside = false;
        
        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setIsDropdownOpen(false);
          setIsNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isNotificationsOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon, requiresAuth: true },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, requiresAuth: true },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-card shadow-lg' 
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gradient">
                SmartShort
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session && navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
              >
                <item.icon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                {item.name}
              </a>
            ))}
            
            {/* Theme toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

                         {/* Notifications */}
             {session && (
               <div className="relative">
                 <button 
                   onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                   className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105 relative"
                 >
                   <BellIcon className="h-5 w-5" />
                 </button>

                 {/* Notifications Dropdown */}
                 {isNotificationsOpen && (
                   <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50" data-dropdown>
                     <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                       <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0">
                             <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                               <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                             </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm text-gray-900 dark:text-white">
                               Your link <span className="font-medium">bit.ly/abc123</span> was clicked
                             </p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                               2 minutes ago
                             </p>
                           </div>
                         </div>
                       </div>
                       <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0">
                             <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                               <ChartBarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                             </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm text-gray-900 dark:text-white">
                               Weekly analytics report is ready
                             </p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                               1 hour ago
                             </p>
                           </div>
                         </div>
                       </div>
                       <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0">
                             <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                               <Cog6ToothIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                             </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm text-gray-900 dark:text-white">
                               New features available in your dashboard
                             </p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                               3 hours ago
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                       <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                         View all notifications
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             )}

            {/* Auth buttons */}
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded-xl"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    {session.user?.image ? (
                      <Image
                        className="h-8 w-8 rounded-full ring-2 ring-blue-500 group-hover:ring-blue-400 transition-all duration-200"
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session.user?.name}
                    </span>
                  </button>

                                     {/* Dropdown menu */}
                   {isDropdownOpen && (
                     <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2" data-dropdown>
                      <a
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChartBarIcon className="h-4 w-4 mr-3" />
                        Dashboard
                      </a>
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <UserIcon className="h-4 w-4 mr-3" />
                        Profile
                      </a>
                                             <button
                         onClick={() => {
                           setIsDropdownOpen(false);
                           setIsSettingsOpen(true);
                         }}
                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                       >
                         <Cog6ToothIcon className="h-4 w-4 mr-3" />
                         Settings
                       </button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <ArrowRightIcon className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="group inline-flex items-center px-6 py-2 btn-primary text-sm font-medium"
              >
                Sign In
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-2 glass-card border-t border-gray-200 dark:border-gray-700">
          {session && navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </a>
          ))}
          
          {session ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4 py-3">
                {session.user?.image ? (
                  <Image
                    className="h-10 w-10 rounded-full ring-2 ring-blue-500"
                    src={session.user.image}
                    alt={session.user.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-3 text-left btn-danger px-4 py-3 rounded-xl text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                signIn();
                setIsMenuOpen(false);
              }}
              className="w-full text-left btn-primary px-4 py-3 rounded-xl text-sm font-medium"
            >
              Sign In
            </button>
          )}
                 </div>
       </div>

       {/* Settings Modal */}
       <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
     </nav>
   );
 } 