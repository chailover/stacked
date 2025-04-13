'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LoginButton() {
  const { user, signInWithGoogle, logout, isSigningIn, error } = useAuth();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-2">
          {user.photoURL && !imageError ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="h-8 w-8 rounded-full object-cover"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.displayName || 'User'}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <button
            onClick={signInWithGoogle}
            disabled={isSigningIn}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md
              ${isSigningIn 
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
          >
            <UserCircleIcon className="h-5 w-5" />
            <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>
          {error && (
            <span className="text-xs text-red-500 mt-1">
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 