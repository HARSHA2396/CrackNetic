import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, Search, ImageIcon, Cpu, Zap, Eye } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  const publicTools = [
    {
      title: 'Encryption & Decryption',
      description: 'Encrypt and decrypt text using various algorithms including AES, DES, Caesar cipher, and more.',
      icon: Lock,
      link: '/encrypt',
      color: 'text-primary-400',
    },
    {
      title: 'Brute Force Decryption',
      description: 'Attempt to decrypt encrypted text by trying multiple algorithms and common keys.',
      icon: Zap,
      link: '/brute-force',
      color: 'text-yellow-400',
    },
    {
      title: 'Algorithm Prediction',
      description: 'Analyze encrypted text to predict which algorithm or cipher was likely used.',
      icon: Search,
      link: '/predict',
      color: 'text-purple-400',
    },
    {
      title: 'Steganography',
      description: 'Hide text messages within images or extract hidden messages from images.',
      icon: ImageIcon,
      link: '/steganography',
      color: 'text-green-400',
    },
  ];

  const protectedTools = [
    {
      title: 'Key Generator',
      description: 'Generate secure cryptographic keys for AES, DES, RSA, and other algorithms.',
      icon: Key,
      link: '/key-generator',
      color: 'text-accent-400',
    },
    {
      title: 'Advanced Encryption',
      description: 'Use your own generated keys for advanced encryption and decryption operations.',
      icon: Cpu,
      link: '/advanced-crypto',
      color: 'text-accent-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-500" />
            <span className="font-bold text-xl text-white">SecureCrypt</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300">{user.username}</span>
              </div>
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span>Logout</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
          <div className="relative max-w-7xl mx-auto text-center py-16">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary-600/20 rounded-full">
                <Shield className="h-16 w-16 text-primary-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-primary-400">SecureCrypt</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your comprehensive cryptographic toolkit for encryption, decryption, analysis, and security operations.
              Powerful tools for both beginners and security professionals.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link to="/encrypt">Try Public Tools</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Public Tools Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Public Tools</h2>
              <p className="text-gray-400 text-lg">
                No registration required. Start exploring cryptography immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {publicTools.map((tool, index) => (
                <Link key={index} to={tool.link} className="group">
                  <Card className="h-full hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-500/10">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors">
                          <tool.icon className={`h-8 w-8 ${tool.color}`} />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Protected Tools Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Protected Tools
                {!user && <Eye className="inline-block h-6 w-6 ml-2 text-accent-400" />}
              </h2>
              <p className="text-gray-400 text-lg">
                {user 
                  ? 'Advanced features for authenticated users.'
                  : 'Login required to access advanced cryptographic features.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {protectedTools.map((tool, index) => (
                <div key={index} className="relative">
                  {user ? (
                    <Link to={tool.link} className="group block">
                      <Card className="h-full hover:border-accent-500 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent-500/10">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors">
                              <tool.icon className={`h-8 w-8 ${tool.color}`} />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-accent-400 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ) : (
                    <div className="relative">
                      <Card className="h-full opacity-50 cursor-not-allowed">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gray-700 rounded-full">
                              <tool.icon className={`h-8 w-8 ${tool.color}`} />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </Card>
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                        <div className="text-center">
                          <Lock className="h-8 w-8 text-accent-400 mx-auto mb-2" />
                          <p className="text-sm text-white font-medium mb-3">Login Required</p>
                          <Link to="/login">
                            <Button size="sm" variant="accent">
                              Sign In
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose SecureCrypt?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-600/20 rounded-full">
                    <Shield className="h-8 w-8 text-primary-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-gray-400">All operations run locally in your browser. No data is sent to external servers.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-secondary-600/20 rounded-full">
                    <Zap className="h-8 w-8 text-secondary-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast & Efficient</h3>
                <p className="text-gray-400">Optimized algorithms ensure quick processing even for large texts and files.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent-600/20 rounded-full">
                    <Cpu className="h-8 w-8 text-accent-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Comprehensive</h3>
                <p className="text-gray-400">From basic ciphers to advanced encryption, we support a wide range of algorithms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}