import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Copy, Download, Key, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { encryptText, decryptText } from '../../utils/comprehensiveCryptoAlgorithms';
import { CryptoResult } from '../../types/crypto';

const algorithmCategories = [
  {
    name: 'Modern Symmetric Encryption',
    algorithms: [
      { value: 'aes', label: 'AES (Advanced Encryption Standard)' },
      { value: 'aes-128', label: 'AES-128' },
      { value: 'aes-192', label: 'AES-192' },
      { value: 'aes-256', label: 'AES-256' },
      { value: 'aes-ecb', label: 'AES-ECB Mode' },
      { value: 'aes-cbc', label: 'AES-CBC Mode' },
      { value: 'aes-cfb', label: 'AES-CFB Mode' },
      { value: 'aes-ofb', label: 'AES-OFB Mode' },
      { value: 'aes-ctr', label: 'AES-CTR Mode' },
      { value: 'aes-gcm', label: 'AES-GCM Mode' },
      { value: 'des', label: 'DES (Data Encryption Standard)' },
      { value: '3des', label: '3DES (Triple DES)' },
      { value: 'blowfish', label: 'Blowfish' },
      { value: 'twofish', label: 'Twofish' },
      { value: 'idea', label: 'IDEA' },
      { value: 'cast5', label: 'CAST5' },
      { value: 'rc5', label: 'RC5' },
      { value: 'rc6', label: 'RC6' },
      { value: 'serpent', label: 'Serpent' },
      { value: 'camellia', label: 'Camellia' },
    ]
  },
  {
    name: 'Stream Ciphers',
    algorithms: [
      { value: 'rc4', label: 'RC4' },
      { value: 'chacha20', label: 'ChaCha20' },
      { value: 'salsa20', label: 'Salsa20' },
      { value: 'seal', label: 'SEAL' },
      { value: 'a51', label: 'A5/1 (GSM)' },
      { value: 'a52', label: 'A5/2 (GSM)' },
      { value: 'grain', label: 'Grain' },
      { value: 'mickey', label: 'MICKEY' },
      { value: 'vernam', label: 'Vernam Cipher (One-Time Pad)' },
    ]
  },
  {
    name: 'Asymmetric (Public Key) Encryption',
    algorithms: [
      { value: 'rsa', label: 'RSA' },
      { value: 'elgamal', label: 'ElGamal' },
      { value: 'ecc', label: 'ECC (Elliptic Curve)' },
      { value: 'paillier', label: 'Paillier Cryptosystem' },
      { value: 'knapsack', label: 'Knapsack Cryptosystem' },
      { value: 'kyber', label: 'Kyber (Post-Quantum)' },
      { value: 'dilithium', label: 'Dilithium (Post-Quantum)' },
      { value: 'ntru', label: 'NTRU (Lattice-based)' },
    ]
  },
  {
    name: 'Classical Substitution Ciphers',
    algorithms: [
      { value: 'caesar', label: 'Caesar Cipher' },
      { value: 'atbash', label: 'Atbash Cipher' },
      { value: 'rot13', label: 'ROT13' },
      { value: 'monoalphabetic', label: 'Monoalphabetic Cipher' },
      { value: 'vigenere', label: 'Vigenère Cipher' },
      { value: 'beaufort', label: 'Beaufort Cipher' },
      { value: 'autokey', label: 'Autokey Cipher' },
      { value: 'playfair', label: 'Playfair Cipher' },
      { value: 'hill', label: 'Hill Cipher' },
      { value: 'adfgx', label: 'ADFGX Cipher' },
      { value: 'bacon', label: 'Bacon\'s Cipher' },
      { value: 'affine', label: 'Affine Cipher' },
      { value: 'xor', label: 'XOR Cipher' },
    ]
  },
  {
    name: 'Classical Transposition Ciphers',
    algorithms: [
      { value: 'railfence', label: 'Rail Fence Cipher' },
      { value: 'columnar', label: 'Columnar Transposition' },
      { value: 'scytale', label: 'Scytale Cipher' },
      { value: 'route', label: 'Route Cipher' },
    ]
  },
  {
    name: 'Encoding & Decoding',
    algorithms: [
      { value: 'base64', label: 'Base64 Encoding' },
      { value: 'base32', label: 'Base32 Encoding' },
      { value: 'base58', label: 'Base58 Encoding' },
      { value: 'hex', label: 'Hexadecimal' },
      { value: 'binary', label: 'Binary' },
      { value: 'url', label: 'URL Encoding' },
      { value: 'ascii', label: 'ASCII Converter' },
    ]
  }
];

const allAlgorithms = algorithmCategories.flatMap(cat => cat.algorithms);

export function EncryptDecrypt() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [key, setKey] = useState('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get algorithm from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && allAlgorithms.find(alg => alg.value === algorithmParam)) {
      setAlgorithm(algorithmParam);
      // Find and set the category
      const category = algorithmCategories.find(cat => 
        cat.algorithms.some(alg => alg.value === algorithmParam)
      );
      if (category) {
        setSelectedCategory(category.name);
      }
    }
  }, []);

  const handleProcess = async () => {
    if (!inputText || !algorithm) return;

    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const processResult = operation === 'encrypt' 
      ? encryptText(inputText, algorithm, key || undefined)
      : decryptText(inputText, algorithm, key || undefined);
    
    setResult(processResult);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (result?.result) {
      navigator.clipboard.writeText(result.result);
    }
  };

  const handleDownload = () => {
    if (result?.result) {
      const blob = new Blob([result.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${operation}-result.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const needsKey = ![
    'caesar', 'atbash', 'rot13', 'bacon', 'base64', 'base32', 'base58', 
    'hex', 'binary', 'url', 'ascii'
  ].includes(algorithm);

  const filteredAlgorithms = selectedCategory 
    ? algorithmCategories.find(cat => cat.name === selectedCategory)?.algorithms || []
    : allAlgorithms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Lock className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Encryption & Decryption
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Secure your data with 84+ advanced encryption algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card variant="glass" className="h-fit">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Operation Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <Button
                  onClick={() => setOperation('encrypt')}
                  variant={operation === 'encrypt' ? 'primary' : 'secondary'}
                  className={`flex-1 ${operation === 'encrypt' ? '' : 'bg-transparent hover:bg-white/10'}`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt
                </Button>
                <Button
                  onClick={() => setOperation('decrypt')}
                  variant={operation === 'decrypt' ? 'primary' : 'secondary'}
                  className={`flex-1 ${operation === 'decrypt' ? '' : 'bg-transparent hover:bg-white/10'}`}
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt
                </Button>
              </div>

              {/* Category Selection */}
              <Select
                label="Algorithm Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: '', label: 'All Algorithms (84+)' },
                  ...algorithmCategories.map(cat => ({ value: cat.name, label: cat.name }))
                ]}
                placeholder="Select a category to filter algorithms"
              />

              {/* Algorithm Selection */}
              <Select
                label="Algorithm"
                value={algorithm}
                onChange={setAlgorithm}
                options={filteredAlgorithms}
                placeholder={`Select from ${filteredAlgorithms.length} available algorithms`}
                required
              />

              {needsKey && (
                <Input
                  label="Key/Password"
                  value={key}
                  onChange={setKey}
                  placeholder="Enter encryption key or password"
                  icon={Key}
                  required
                />
              )}

              <Textarea
                label={`Text to ${operation}`}
                value={inputText}
                onChange={setInputText}
                placeholder={`Enter text to ${operation}...`}
                rows={6}
                required
              />

              <Button
                onClick={handleProcess}
                loading={isProcessing}
                disabled={!inputText || !algorithm || (needsKey && !key)}
                fullWidth
                size="lg"
                icon={operation === 'encrypt' ? Lock : Unlock}
              >
                {operation === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
              </Button>
            </div>
          </Card>

          {/* Result Section */}
          <Card variant="glass" className="h-fit">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Result</h2>
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Algorithm: <span className="text-white font-medium">{result.algorithm.toUpperCase()}</span>
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCopy}
                      size="sm"
                      variant="secondary"
                      icon={Copy}
                    >
                      Copy
                    </Button>
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      variant="secondary"
                      icon={Download}
                    >
                      Download
                    </Button>
                  </div>
                </div>

                {result.success ? (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
                    <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
                      {result.result}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">
                      <strong>Error:</strong> {result.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6 border border-white/10">
                  <Lock className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Process</h3>
                <p className="text-gray-400">
                  Configure your settings and enter text to see results
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Algorithm Information */}
        <Card variant="gradient" className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Available Algorithm Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {algorithmCategories.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-semibold text-blue-400 mb-4 text-lg">{category.name}</h3>
                <div className="text-sm text-gray-400 mb-3">
                  {category.algorithms.length} algorithms available
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {category.algorithms.slice(0, 5).map((alg) => (
                    <div key={alg.value} className="text-gray-300 text-sm flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="truncate">{alg.label}</span>
                    </div>
                  ))}
                  {category.algorithms.length > 5 && (
                    <div className="text-xs text-gray-500 flex items-center mt-2">
                      <ChevronDown className="h-3 w-3 mr-1" />
                      +{category.algorithms.length - 5} more algorithms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 border border-white/10">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Total: 84+ Encryption Algorithms</span>
            </div>
          </div>
        </Card>

        {/* Key Requirements Info */}
        <Card variant="glass" className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-6">Key Requirements by Algorithm Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <h3 className="font-medium text-green-400 mb-2">No Key Required</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Caesar, ROT13, Atbash</li>
                <li>• Bacon's Cipher</li>
                <li>• All Encoding formats</li>
              </ul>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <h3 className="font-medium text-blue-400 mb-2">Text Key</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Vigenère, Beaufort</li>
                <li>• Playfair, Hill</li>
                <li>• XOR, Affine</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <h3 className="font-medium text-purple-400 mb-2">Password Key</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• AES, DES, 3DES</li>
                <li>• Blowfish, Twofish</li>
                <li>• RC4, ChaCha20</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
              <h3 className="font-medium text-orange-400 mb-2">Public/Private Key</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• RSA, ECC</li>
                <li>• ElGamal, Paillier</li>
                <li>• Post-Quantum algorithms</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}