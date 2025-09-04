import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Copy, Download, Key, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { encryptText, decryptText } from '../../utils/cryptoAlgorithms';
import { CryptoResult } from '../../types/crypto';

const algorithmCategories = [
  {
    name: 'Modern Encryption',
    algorithms: [
      { value: 'aes', label: 'AES (Advanced Encryption Standard)' },
      { value: 'des', label: 'DES (Data Encryption Standard)' },
      { value: '3des', label: '3DES (Triple DES)' },
    ]
  },
  {
    name: 'Classical Ciphers',
    algorithms: [
      { value: 'caesar', label: 'Caesar Cipher' },
      { value: 'vigenere', label: 'Vigenère Cipher' },
      { value: 'xor', label: 'XOR Cipher' },
    ]
  },
  {
    name: 'Encoding',
    algorithms: [
      { value: 'base64', label: 'Base64 Encoding' },
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

  // Get algorithm from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && allAlgorithms.find(alg => alg.value === algorithmParam)) {
      setAlgorithm(algorithmParam);
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

  const needsKey = ['aes', 'des', '3des', 'vigenere', 'xor'].includes(algorithm);

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
            Secure your data with advanced encryption algorithms
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

              <Select
                label="Algorithm"
                value={algorithm}
                onChange={setAlgorithm}
                options={allAlgorithms}
                placeholder="Select an encryption algorithm"
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
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Available Algorithms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {algorithmCategories.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-blue-400 mb-4 text-lg">{category.name}</h3>
                <ul className="space-y-2">
                  {category.algorithms.map((alg) => (
                    <li key={alg.value} className="text-gray-300 text-sm flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {alg.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}