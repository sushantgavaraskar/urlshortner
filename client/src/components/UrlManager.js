'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUrlApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { apiUtils } from '../utils/api';
import LinkCard from './LinkCard';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function UrlManager({ userId }) {
  const { user } = useAuth();
  const { 
    createUrl, 
    getUserUrls, 
    searchUrls, 
    deleteUrl, 
    updateUrl,
    loading, 
    error, 
    clearError 
  } = useUrlApi();

  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    description: '',
    expiresAt: ''
  });

  // Load user's links
  const fetchLinks = useCallback(async () => {
    const currentUserId = userId || user?.id;
    if (!currentUserId) return;
    
    try {
      setIsLoading(true);
      const result = await getUserUrls(currentUserId, {
        page: 1,
        limit: 50,
        sort: 'createdAt',
        order: 'desc'
      });
      setLinks(result.data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, user?.id, getUserUrls]);

  // Create new link
  const handleCreateLink = async (e) => {
    e.preventDefault();
    const currentUserId = userId || user?.id;
    if (!currentUserId) return;

    setIsCreating(true);
    try {
      const linkData = {
        ...formData,
        userId: currentUserId,
        expiresAt: formData.expiresAt ? apiUtils.formatDateForApi(formData.expiresAt) : null
      };

      const result = await createUrl(linkData);
      setLinks(prev => [result.data, ...prev]);
      setFormData({
        originalUrl: '',
        customAlias: '',
        title: '',
        description: '',
        expiresAt: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await deleteUrl(linkId, user.id);
      setLinks(prev => prev.filter(link => link._id !== linkId));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // Edit link handler
  const editLink = (link) => {
    setEditingLink(link);
    setFormData({
      originalUrl: link.originalUrl,
      customAlias: link.customAlias || '',
      title: link.title || '',
      description: link.description || '',
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ''
    });
    setShowEditForm(true);
  };

  // Update link
  const handleUpdateLink = async (e) => {
    e.preventDefault();
    if (!editingLink) return;

    setIsCreating(true);
    try {
      const linkData = {
        ...formData,
        expiresAt: formData.expiresAt ? apiUtils.formatDateForApi(formData.expiresAt) : null
      };

      const result = await updateUrl(editingLink._id, linkData);
      setLinks(prev => prev.map(link => 
        link._id === editingLink._id ? result.data : link
      ));
      setShowEditForm(false);
      setEditingLink(null);
      setFormData({
        originalUrl: '',
        customAlias: '',
        title: '',
        description: '',
        expiresAt: ''
      });
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Refresh links
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLinks();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter links
  const filteredLinks = links.filter(link => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && (!link.expiresAt || new Date(link.expiresAt) > new Date())) ||
                         (filter === 'expired' && link.expiresAt && new Date(link.expiresAt) <= new Date());

    return matchesFilter;
  });

  // Load links on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchLinks();
    }
  }, [user?.id, fetchLinks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your shortened URLs
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Link</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Links</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Links Grid */}
      <div className="space-y-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link, index) => (
            <div
              key={link._id}
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LinkCard
                link={link}
                onDelete={handleDeleteLink}
                onEdit={editLink}
              />
            </div>
          ))
        ) : (
          <div className="card text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <SparklesIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No links found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first shortened link'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Your First Link</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Link
            </h2>
            
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.originalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Alias (optional)
                </label>
                <input
                  type="text"
                  value={formData.customAlias}
                  onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                  className="input-field"
                  placeholder="my-custom-link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="My Awesome Link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="input-field"
                  placeholder="Brief description of this link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires At (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {showEditForm && editingLink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Edit Link
            </h2>
            
            <form onSubmit={handleUpdateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.originalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Alias (optional)
                </label>
                <input
                  type="text"
                  value={formData.customAlias}
                  onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                  className="input-field"
                  placeholder="my-custom-link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="My Awesome Link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="input-field"
                  placeholder="Brief description of this link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires At (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingLink(null);
                    setFormData({
                      originalUrl: '',
                      customAlias: '',
                      title: '',
                      description: '',
                      expiresAt: ''
                    });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isCreating ? 'Updating...' : 'Update Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 