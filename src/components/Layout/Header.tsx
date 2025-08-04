import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">
            {getPageTitle(location.pathname)}
          </h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">{user.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/encrypt': 'Encryption & Decryption',
    '/encode': 'Encoding & Decoding',
    '/hash': 'Hash Functions',
    '/brute-force': 'Brute Force Analysis',
    '/predict': 'Algorithm Prediction',
    '/steganography': 'Steganography',
    '/key-generator': 'Key Generator',
    '/advanced-crypto': 'Advanced Cryptography',
    '/login': 'Login',
    '/register': 'Register',
  };

  return routes[pathname] || 'SecureCrypt';
}