'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { 
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    notifications: true,
    emailUpdates: true
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '',
        website: '',
        notifications: true,
        emailUpdates: true
      });
    }
  }, [status, router, session]);

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
              Please sign in to access your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Profile Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {session?.user?.name || 'Demo User'}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {session?.user?.email || 'demo@example.com'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  Account Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your links</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.notifications}
                      onChange={(e) => setProfileData({...profileData, notifications: e.target.checked})}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Updates</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.emailUpdates}
                      onChange={(e) => setProfileData({...profileData, emailUpdates: e.target.checked})}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Account Info
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">August 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Security
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <KeyIcon className="h-4 w-4 mr-3" />
                  Change Password
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <BellIcon className="h-4 w-4 mr-3" />
                  Notification Settings
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
              <div className="px-6 py-4 border-b border-red-200 dark:border-red-700">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
                  Danger Zone
                </h3>
              </div>
              <div className="p-6">
                <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <TrashIcon className="h-4 w-4 mr-3" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 