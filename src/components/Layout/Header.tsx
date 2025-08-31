import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../UI/Button';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold text-xl text-white">Cracknetic</span>
              <div className="text-xs text-gray-400 -mt-1 hidden sm:block">
                {getPageTitle(location.pathname)}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1.5">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">{user.username}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-primary-500 to-primary-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="secondary"
              size="sm"
              className="bg-white/10 border-white/20"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{user.username}</span>
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white/10 border-white/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full bg-white/10 border-white/20">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary-500 to-primary-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/encrypt': 'Encryption Tools',
    '/encode': 'Encoding Tools',
    '/hash': 'Hash Functions',
    '/brute-force': 'Brute Force Analysis',
    '/predict': 'Algorithm Prediction',
    '/steganography': 'Steganography',
    '/key-generator': 'Key Generator',
    '/advanced-crypto': 'Advanced Crypto',
    '/login': 'Login',
    '/register': 'Register',
  };

  return routes[pathname] || 'Crypto Toolkit';
}