import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, Search, ImageIcon, Cpu, Zap, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  const publicTools = [
    {
      title: 'Encryption & Decryption',
      description: 'Encrypt and decrypt text using 84+ algorithms including AES, RSA, Caesar cipher, and more.',
      icon: Lock,
      link: '/encrypt',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Brute Force Analysis',
      description: 'Intelligent decryption with percentage-based ranking and readability scoring.',
      icon: Zap,
      link: '/brute-force',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      title: 'AI Algorithm Prediction',
      description: 'AI-powered analysis to predict encryption algorithms with machine learning.',
      icon: Search,
      link: '/predict',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Steganography',
      description: 'Hide secret messages in images or extract hidden content with advanced methods.',
      icon: ImageIcon,
      link: '/steganography',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
  ];

  const protectedTools = [
    {
      title: 'Key Generator',
      description: 'Generate secure cryptographic keys with cloud storage and management.',
      icon: Key,
      link: '/key-generator',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Advanced Encryption',
      description: 'Use custom keys for professional-grade encryption operations.',
      icon: Cpu,
      link: '/advanced-crypto',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Modern Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-xl text-white">Cracknetic</span>
                <div className="text-xs text-gray-400 -mt-1">Advanced Crypto Toolkit</div>
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1.5">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">{user.username}</span>
                </div>
                <Button
                  onClick={() => window.location.href = '/login'}
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                >
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
                  <Button size="sm" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-accent-600/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-6 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Shield className="h-16 w-16 text-primary-400" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-accent-400 animate-bounce-subtle" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-accent-400 bg-clip-text text-transparent">
                  Cracknetic
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Your comprehensive cryptographic toolkit for encryption, decryption, analysis, and security operations.
                <span className="block mt-2 text-lg text-gray-400">
                  Powerful AI-enhanced tools for both beginners and security professionals.
                </span>
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-8 py-4 text-lg">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/encrypt">
                    <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 border-white/20 px-8 py-4 text-lg">
                      Try Demo Tools
                    </Button>
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-primary-400">84+</div>
                  <div className="text-sm text-gray-400">Algorithms</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-accent-400">AI</div>
                  <div className="text-sm text-gray-400">Powered</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-gray-400">Browser</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400">Free</div>
                  <div className="text-sm text-gray-400">Forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Public Tools Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Instant Access Tools
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No registration required. Start exploring cryptography immediately with our powerful tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {publicTools.map((tool, index) => (
                <Link key={index} to={tool.link} className="group">
                  <div className={`relative overflow-hidden rounded-2xl border ${tool.borderColor} ${tool.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary-500/10`}>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
                      background: `linear-gradient(135deg, ${tool.color.split(' ')[1]}, ${tool.color.split(' ')[3]})`
                    }}></div>
                    
                    <div className="relative p-6 lg:p-8">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="mt-4 flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                            Try now
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Protected Tools Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Professional Features
                {!user && <Eye className="inline-block h-6 w-6 ml-2 text-accent-400" />}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {user 
                  ? 'Advanced features for authenticated users with cloud storage and history.'
                  : 'Login to unlock advanced cryptographic features with cloud storage.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {protectedTools.map((tool, index) => (
                <div key={index} className="relative">
                  {user ? (
                    <Link to={tool.link} className="group block">
                      <div className={`relative overflow-hidden rounded-2xl border ${tool.borderColor} ${tool.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-500/10`}>
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
                          background: `linear-gradient(135deg, ${tool.color.split(' ')[1]}, ${tool.color.split(' ')[3]})`
                        }}></div>
                        
                        <div className="relative p-6 lg:p-8">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <tool.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-300 transition-colors">
                                {tool.title}
                              </h3>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {tool.description}
                              </p>
                              <div className="mt-4 flex items-center text-accent-400 text-sm font-medium group-hover:text-accent-300 transition-colors">
                                Access now
                                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative">
                      <div className={`relative overflow-hidden rounded-2xl border ${tool.borderColor} ${tool.bgColor} backdrop-blur-sm opacity-60`}>
                        <div className="p-6 lg:p-8">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white flex-shrink-0`}>
                              <tool.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {tool.title}
                              </h3>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-2xl backdrop-blur-sm">
                        <div className="text-center p-6">
                          <div className="p-3 bg-accent-500/20 rounded-full w-fit mx-auto mb-3">
                            <Lock className="h-6 w-6 text-accent-400" />
                          </div>
                          <p className="text-sm text-white font-medium mb-3">Login Required</p>
                          <Link to="/login">
                            <Button size="sm" className="bg-gradient-to-r from-accent-500 to-accent-600">
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
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">Why Choose Cracknetic?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Secure & Private</h3>
                  <p className="text-gray-400 leading-relaxed">
                    All operations run locally in your browser. Zero data transmission to external servers. 
                    Your privacy is our priority.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">AI-Enhanced</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Machine learning algorithms for intelligent pattern recognition and algorithm prediction. 
                    Continuously improving accuracy.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                      <Cpu className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Comprehensive</h3>
                  <p className="text-gray-400 leading-relaxed">
                    84+ algorithms from classical ciphers to post-quantum encryption. 
                    Everything you need in one platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Categories */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Algorithm Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 mb-4">
                  <div className="text-2xl font-bold text-blue-400 mb-1">16</div>
                  <div className="text-sm text-gray-300 font-medium">Classical Ciphers</div>
                </div>
                <p className="text-xs text-gray-400">Caesar, Vigenère, Playfair, Hill, etc.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-4">
                  <div className="text-2xl font-bold text-purple-400 mb-1">25</div>
                  <div className="text-sm text-gray-300 font-medium">Modern Symmetric</div>
                </div>
                <p className="text-xs text-gray-400">AES, DES, ChaCha20, Blowfish, etc.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 mb-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">8</div>
                  <div className="text-sm text-gray-300 font-medium">Asymmetric</div>
                </div>
                <p className="text-xs text-gray-400">RSA, ECC, Post-Quantum, etc.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 mb-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">21</div>
                  <div className="text-sm text-gray-300 font-medium">Hash Functions</div>
                </div>
                <p className="text-xs text-gray-400">SHA, MD5, BLAKE, Argon2, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}