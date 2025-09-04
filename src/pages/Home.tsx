import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Key, 
  Hash, 
  Binary, 
  Zap, 
  Search, 
  ImageIcon, 
  ArrowRight,
  Star,
  Users,
  Globe,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Header } from '../components/Layout/Header';

const features = [
  {
    icon: Lock,
    title: 'Encryption & Decryption',
    description: 'Encrypt and decrypt text using 84+ algorithms including AES, RSA, DES, and classical ciphers',
    path: '/encrypt',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Zap,
    title: 'Brute Force Analysis',
    description: 'Intelligent brute force decryption with readability scoring and confidence ranking',
    path: '/brute-force',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    icon: Search,
    title: 'Algorithm Prediction',
    description: 'AI-powered algorithm detection with machine learning and pattern recognition',
    path: '/predict',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: ImageIcon,
    title: 'Steganography',
    description: 'Hide secret messages in images using LSB, spread spectrum, and advanced methods',
    path: '/steganography',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    icon: Hash,
    title: 'Hash Functions',
    description: 'Generate cryptographic hashes using MD5, SHA-256, SHA-512, and modern algorithms',
    path: '/hash',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  {
    icon: Binary,
    title: 'Encoding Tools',
    description: 'Convert between Base64, Hex, Binary, URL encoding, and other formats',
    path: '/encode',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  }
];

const stats = [
  { label: 'Algorithms', value: '84+', icon: Shield },
  { label: 'Users', value: '10K+', icon: Users },
  { label: 'Success Rate', value: '99.9%', icon: Star },
  { label: 'Global Access', value: '24/7', icon: Globe }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
                  <Shield className="h-16 w-16 text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-cyan-400 animate-bounce" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Cracknetic
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Advanced Cryptographic Toolkit for Security Professionals
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Encrypt, decrypt, analyze, and crack ciphers with 84+ algorithms. 
              AI-powered analysis, brute force tools, and steganography - all in your browser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/encrypt">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                  Start Encrypting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/brute-force">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                  Try Brute Force
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
                    <stat.icon className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Powerful Crypto Tools
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need for cryptographic analysis and security research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.path} className="group">
                <Card className={`h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl ${feature.bgColor} border ${feature.borderColor} hover:border-white/30`}>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl mr-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Explore Tool</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of security professionals using Cracknetic for advanced cryptographic analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
            <Link to="/encrypt">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                Try Tools Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold text-white">Cracknetic</span>
            </div>
            <p className="text-gray-400 mb-6">
              Advanced Cryptographic Toolkit for Security Professionals
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>© 2025 Cracknetic</span>
              <span>•</span>
              <span>All tools run locally in your browser</span>
              <span>•</span>
              <span>No data sent to servers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}