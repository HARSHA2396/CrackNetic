import React, { useState, useEffect } from 'react';
import { Hash, Copy, Download, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Input } from '../../components/UI/Input';
import { Header } from '../../components/Layout/Header';
import { hashTextEnhanced } from '../../utils/enhancedHashAlgorithms';
import { HashResult } from '../../types/crypto';

const hashCategories = [
  {
    name: 'SHA Family',
    algorithms: [
      { value: 'sha1', label: 'SHA-1' },
      { value: 'sha224', label: 'SHA-224' },
      { value: 'sha256', label: 'SHA-256' },
      { value: 'sha384', label: 'SHA-384' },
      { value: 'sha512', label: 'SHA-512' },
    ]
  },
  {
    name: 'SHA-3 & Keccak',
    algorithms: [
      { value: 'sha3-224', label: 'SHA3-224' },
      { value: 'sha3-256', label: 'SHA3-256' },
      { value: 'sha3-384', label: 'SHA3-384' },
      { value: 'sha3-512', label: 'SHA3-512' },
      { value: 'keccak-256', label: 'Keccak-256' },
      { value: 'keccak-384', label: 'Keccak-384' },
      { value: 'keccak-512', label: 'Keccak-512' },
    ]
  },
  {
    name: 'Modern Hash Functions',
    algorithms: [
      { value: 'blake2b', label: 'BLAKE2b' },
      { value: 'blake2s', label: 'BLAKE2s' },
      { value: 'blake3', label: 'BLAKE3' },
      { value: 'whirlpool', label: 'Whirlpool' },
    ]
  },
  {
    name: 'Legacy Hash Functions',
    algorithms: [
      { value: 'md5', label: 'MD5' },
      { value: 'ripemd160', label: 'RIPEMD-160' },
    ]
  },
  {
    name: 'HMAC (Keyed Hash)',
    algorithms: [
      { value: 'hmac-md5', label: 'HMAC-MD5' },
      { value: 'hmac-sha1', label: 'HMAC-SHA1' },
      { value: 'hmac-sha256', label: 'HMAC-SHA256' },
      { value: 'hmac-sha512', label: 'HMAC-SHA512' },
    ]
  },
  {
    name: 'Password Hashing',
    algorithms: [
      { value: 'pbkdf2', label: 'PBKDF2' },
      { value: 'bcrypt', label: 'bcrypt' },
      { value: 'argon2', label: 'Argon2' },
    ]
  }
];

const allHashAlgorithms = hashCategories.flatMap(cat => cat.algorithms);

export function HashPage() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [key, setKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [result, setResult] = useState<HashResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && allHashAlgorithms.find(alg => alg.value === algorithmParam)) {
      setAlgorithm(algorithmParam);
      const category = hashCategories.find(cat => 
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const hashResult = hashTextEnhanced(inputText, algorithm, key || undefined);
    setResult(hashResult);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (result?.hash) {
      navigator.clipboard.writeText(result.hash);
    }
  };

  const handleDownload = () => {
    if (result?.hash) {
      const blob = new Blob([result.hash], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${algorithm}-hash.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const needsKey = ['hmac-md5', 'hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'pbkdf2', 'argon2'].includes(algorithm);

  const filteredAlgorithms = selectedCategory 
    ? hashCategories.find(cat => cat.name === selectedCategory)?.algorithms || []
    : allHashAlgorithms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Hash className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
              Hash Functions
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Generate cryptographic hashes with 21+ algorithms for data integrity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-red-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Input Configuration</h2>
            </div>

            <div className="space-y-6">
              <Select
                label="Hash Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: '', label: 'All Hash Functions (21+)' },
                  ...hashCategories.map(cat => ({ value: cat.name, label: cat.name }))
                ]}
                placeholder="Select a category to filter algorithms"
              />

              <Select
                label="Hash Algorithm"
                value={algorithm}
                onChange={setAlgorithm}
                options={filteredAlgorithms}
                placeholder={`Select from ${filteredAlgorithms.length} available algorithms`}
                required
              />

              {needsKey && (
                <Input
                  label="Key/Salt"
                  value={key}
                  onChange={setKey}
                  placeholder="Enter key for HMAC or salt for PBKDF2/Argon2"
                  required
                />
              )}

              <Textarea
                label="Text to Hash"
                value={inputText}
                onChange={setInputText}
                placeholder="Enter text to generate hash..."
                rows={8}
                required
              />

              <Button
                onClick={handleProcess}
                loading={isProcessing}
                disabled={!inputText || !algorithm || (needsKey && !key)}
                fullWidth
                size="lg"
                icon={Hash}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
              >
                Generate Hash
              </Button>
            </div>
          </Card>

          {/* Result Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Hash Result</h2>
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
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
                      <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
                        {result.hash}
                      </pre>
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      Hash length: {result.hash?.length} characters
                    </div>
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
                  <Hash className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Hash</h3>
                <p className="text-gray-400">
                  Select a hash algorithm and enter text to generate hash
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Hash Information */}
        <Card variant="gradient" className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Hash Algorithm Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hashCategories.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-red-400 mb-4">{category.name}</h3>
                <div className="space-y-2">
                  {category.algorithms.map((alg) => (
                    <div key={alg.value} className="text-sm text-gray-400 flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      {alg.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}