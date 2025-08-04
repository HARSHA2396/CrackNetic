import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Lock, 
  Key, 
  Hash, 
  Binary,
  Zap,
  Search,
  ImageIcon,
  Eye,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: SidebarItem[];
  requiresAuth?: boolean;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  algorithm?: string;
  requiresAuth?: boolean;
}

const sidebarSections: SidebarSection[] = [
  {
    id: 'tools',
    title: 'Analysis Tools',
    icon: Search,
    items: [
      { id: 'brute-force', title: 'Brute Force', path: '/brute-force' },
      { id: 'predict', title: 'Algorithm Prediction', path: '/predict' },
      { id: 'steganography', title: 'Steganography', path: '/steganography' },
    ]
  },
  {
    id: 'ciphers',
    title: 'Ciphers',
    icon: Lock,
    items: [
      { id: 'caesar', title: 'Caesar Cipher', path: '/encrypt?algorithm=caesar' },
      { id: 'vigenere', title: 'Vigenère Cipher', path: '/encrypt?algorithm=vigenere' },
      { id: 'xor', title: 'XOR Cipher', path: '/encrypt?algorithm=xor' },
      { id: 'rot13', title: 'ROT13', path: '/encrypt?algorithm=rot13' },
      { id: 'atbash', title: 'Atbash Cipher', path: '/encrypt?algorithm=atbash' },
      { id: 'affine', title: 'Affine Cipher', path: '/encrypt?algorithm=affine' },
      { id: 'playfair', title: 'Playfair Cipher', path: '/encrypt?algorithm=playfair' },
      { id: 'hill', title: 'Hill Cipher', path: '/encrypt?algorithm=hill' },
      { id: 'railfence', title: 'Rail Fence Cipher', path: '/encrypt?algorithm=railfence' },
    ]
  },
  {
    id: 'encryption',
    title: 'Key-Based Encryption',
    icon: Key,
    items: [
      { id: 'aes', title: 'AES', path: '/encrypt?algorithm=aes' },
      { id: 'des', title: 'DES', path: '/encrypt?algorithm=des' },
      { id: '3des', title: '3DES', path: '/encrypt?algorithm=3des' },
      { id: 'blowfish', title: 'Blowfish', path: '/encrypt?algorithm=blowfish' },
      { id: 'rsa', title: 'RSA', path: '/encrypt?algorithm=rsa' },
      { id: 'twofish', title: 'Twofish', path: '/encrypt?algorithm=twofish' },
      { id: 'chacha20', title: 'ChaCha20', path: '/encrypt?algorithm=chacha20' },
      { id: 'rc4', title: 'RC4', path: '/encrypt?algorithm=rc4' },
    ]
  },
  {
    id: 'hashing',
    title: 'Hash Functions',
    icon: Hash,
    items: [
      { id: 'md5', title: 'MD5', path: '/hash?algorithm=md5' },
      { id: 'sha1', title: 'SHA-1', path: '/hash?algorithm=sha1' },
      { id: 'sha224', title: 'SHA-224', path: '/hash?algorithm=sha224' },
      { id: 'sha256', title: 'SHA-256', path: '/hash?algorithm=sha256' },
      { id: 'sha384', title: 'SHA-384', path: '/hash?algorithm=sha384' },
      { id: 'sha512', title: 'SHA-512', path: '/hash?algorithm=sha512' },
      { id: 'ripemd160', title: 'RIPEMD-160', path: '/hash?algorithm=ripemd160' },
      { id: 'whirlpool', title: 'Whirlpool', path: '/hash?algorithm=whirlpool' },
      { id: 'blake2', title: 'BLAKE2', path: '/hash?algorithm=blake2' },
    ]
  },
  {
    id: 'encodings',
    title: 'Encodings',
    icon: Binary,
    items: [
      { id: 'base64', title: 'Base64', path: '/encode?algorithm=base64' },
      { id: 'base32', title: 'Base32', path: '/encode?algorithm=base32' },
      { id: 'base58', title: 'Base58', path: '/encode?algorithm=base58' },
      { id: 'hex', title: 'Hex', path: '/encode?algorithm=hex' },
      { id: 'binary', title: 'Binary', path: '/encode?algorithm=binary' },
      { id: 'url', title: 'URL Encode', path: '/encode?algorithm=url' },
      { id: 'ascii', title: 'ASCII Converter', path: '/encode?algorithm=ascii' },
    ]
  },
  {
    id: 'protected',
    title: 'Protected Tools',
    icon: Shield,
    requiresAuth: true,
    items: [
      { id: 'key-generator', title: 'Key Generator', path: '/key-generator', requiresAuth: true },
      { id: 'advanced-crypto', title: 'Advanced Crypto', path: '/advanced-crypto', requiresAuth: true },
    ]
  }
];

export function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['tools']);
  const { user } = useAuth();
  const location = useLocation();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isItemActive = (item: SidebarItem) => {
    if (item.path.includes('?')) {
      const [basePath, query] = item.path.split('?');
      const params = new URLSearchParams(query);
      const currentParams = new URLSearchParams(location.search);
      return location.pathname === basePath && 
             params.get('algorithm') === currentParams.get('algorithm');
    }
    return location.pathname === item.path;
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary-500" />
          <span className="font-bold text-xl text-white">SecureCrypt</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {sidebarSections.map((section) => {
            // Hide protected sections if user is not authenticated
            if (section.requiresAuth && !user) {
              return null;
            }

            const isExpanded = expandedSections.includes(section.id);
            const SectionIcon = section.icon;

            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SectionIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.items.map((item) => {
                      // Hide protected items if user is not authenticated
                      if (item.requiresAuth && !user) {
                        return (
                          <div key={item.id} className="px-3 py-1.5 text-xs text-gray-500 flex items-center">
                            <Lock className="h-3 w-3 mr-2" />
                            {item.title} (Login Required)
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                            isItemActive(item)
                              ? 'text-primary-400 bg-primary-600/20'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Section */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          {user ? (
            <div className="px-3 py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Eye className="h-4 w-4" />
                <span>Logged in as {user.username}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}