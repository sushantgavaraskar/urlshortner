'use client';

import { CheckIcon } from '@heroicons/react/24/outline';

export default function FilterButton({ 
  label, 
  isSelected, 
  onClick, 
  className = "" 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg border transition-all duration-200
        inline-flex items-center space-x-2
        ${isSelected 
          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
        ${className}
      `}
    >
      <span className="font-medium">{label}</span>
      {isSelected && (
        <CheckIcon className="h-4 w-4" style={{ marginTop: '1px' }} />
      )}
    </button>
  );
} 