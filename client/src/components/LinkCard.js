'use client';

import { useState } from 'react';
import { 
  LinkIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  EyeIcon,
  CalendarIcon,
  TrashIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function LinkCard({ link, onDelete, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shortUrl = `${(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')}/r/${link.shortCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setIsDeleting(true);
      try {
        await onDelete(link._id);
      } catch (error) {
        console.error('Error deleting link:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClickRate = () => {
    const daysSinceCreation = Math.max(1, Math.floor((new Date() - new Date(link.createdAt)) / (1000 * 60 * 60 * 24)));
    return Math.round((link.clicks || 0) / daysSinceCreation);
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isHovered ? 'ring-2 ring-blue-500/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator */}
      {link.expiresAt && new Date(link.expiresAt) < new Date() && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Expired
          </span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {link.title || 'Untitled Link'}
            </h3>
            {link.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-300">
                {link.category}
              </span>
            )}
          </div>

          {/* Original URL */}
          <div className="flex items-center space-x-2 mb-4">
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {link.originalUrl}
            </p>
          </div>

          {/* Short URL */}
          <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm font-mono text-blue-600 dark:text-blue-400 flex-1 truncate">
              {shortUrl}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center justify-center"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <EyeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {link.clicks || 0}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Clicks</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <ChartBarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {getClickRate()}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70">Per Day</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatDate(link.createdAt)}
              </div>
              <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Created</div>
            </div>
          </div>

          {/* Keywords */}
          {link.keywords && link.keywords.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {link.keywords.slice(0, 4).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{keyword}
                  </span>
                ))}
                {link.keywords.length > 4 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                    +{link.keywords.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center space-y-2 ml-4">
          <button
            onClick={() => onEdit(link)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            title="Edit link"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Delete link"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {link.description && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {link.description}
          </p>
        </div>
      )}

      {/* Expiration notice */}
      {link.expiresAt && new Date(link.expiresAt) < new Date() && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 flex items-center">
            <span className="mr-2">⚠️</span>
            This link has expired on {formatDate(link.expiresAt)}
          </p>
        </div>
      )}
    </div>
  );
} 