import React, { useState } from 'react';
import { Cpu, Upload, Lock, Unlock, Key } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { encryptText, decryptText } from '../../utils/cryptoAlgorithms';
import { CryptoResult } from '../../types/crypto';

const algorithms = [
  { value: 'aes', label: 'AES (Advanced Encryption Standard)' },
  { value: 'des', label: 'DES (Data Encryption Standard)' },
  { value: '3des', label: '3DES (Triple DES)' },
  { value: 'vigenere', label: 'Vigenère Cipher' },
  { value: 'xor', label: 'XOR Cipher' },
];

export function AdvancedCrypto() {
  const [inputText, setInputText] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!inputText || !algorithm || !customKey) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const processResult = operation === 'encrypt' 
      ? encryptText(inputText, algorithm, customKey)
      : decryptText(inputText, algorithm, customKey);
    
    setResult(processResult);
    setIsProcessing(false);
  };

  const handleKeyUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          // Try to parse as JSON first (exported key format)
          const keyData = JSON.parse(content);
          if (keyData.publicKey) {
            setCustomKey(keyData.publicKey);
          } else if (keyData.key) {
            setCustomKey(keyData.key);
          }
        } catch {
          // If not JSON, use raw content
          setCustomKey(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Advanced Encryption</h1>
            <p className="text-gray-400 text-lg">
              Use custom keys for advanced encryption and decryption operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-accent-400" />
                Configuration
              </h2>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setOperation('encrypt')}
                    variant={operation === 'encrypt' ? 'accent' : 'secondary'}
                    className="flex-1"
                  >
                    Encrypt
                  </Button>
                  <Button
                    onClick={() => setOperation('decrypt')}
                    variant={operation === 'decrypt' ? 'accent' : 'secondary'}
                    className="flex-1"
                  >
                    Decrypt
                  </Button>
                </div>

                <Select
                  label="Algorithm"
                  value={algorithm}
                  onChange={setAlgorithm}
                  options={algorithms}
                  placeholder="Select encryption algorithm"
                />

                {/* Custom Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Key
                  </label>
                  <div className="space-y-3">
                    <Textarea
                      value={customKey}
                      onChange={setCustomKey}
                      placeholder="Enter your custom key or upload a key file..."
                      rows={4}
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => document.getElementById('key-upload')?.click()}
                        size="sm"
                        variant="secondary"
                        icon={Upload}
                      >
                        Upload Key File
                      </Button>
                      <input
                        id="key-upload"
                        type="file"
                        accept=".json,.pem,.txt,.key"
                        onChange={handleKeyUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => setCustomKey('')}
                        size="sm"
                        variant="secondary"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                <Textarea
                  label={`Text to ${operation}`}
                  value={inputText}
                  onChange={setInputText}
                  placeholder={`Enter text to ${operation}...`}
                  rows={6}
                />

                <Button
                  onClick={handleProcess}
                  loading={isProcessing}
                  disabled={!inputText || !algorithm || !customKey}
                  className="w-full"
                  size="lg"
                  icon={operation === 'encrypt' ? Lock : Unlock}
                  variant="accent"
                >
                  {operation === 'encrypt' ? 'Encrypt' : 'Decrypt'} with Custom Key
                </Button>
              </div>
            </Card>

            {/* Result Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Key className="h-5 w-5 mr-2 text-primary-400" />
                Result
              </h2>

              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Algorithm: <span className="text-white">{result.algorithm.toUpperCase()}</span>
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => navigator.clipboard.writeText(result.result || '')}
                        size="sm"
                        variant="secondary"
                      >
                        Copy Result
                      </Button>
                    </div>
                  </div>

                  {result.success ? (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <pre className="font-mono text-sm text-accent-300 whitespace-pre-wrap break-all">
                        {result.result}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
                      <p className="text-red-400 text-sm">
                        <strong>Error:</strong> {result.error}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                    <Cpu className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Configure settings and enter text to see results
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Key Management Tips */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Key Management Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Key Generation</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Use the Key Generator for secure keys</li>
                  <li>• Ensure sufficient key length for security</li>
                  <li>• Generate new keys regularly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Key Storage</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Store keys in secure locations</li>
                  <li>• Never share private keys</li>
                  <li>• Use encrypted storage when possible</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Key Formats</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• JSON format for generated keys</li>
                  <li>• PEM format for standard compatibility</li>
                  <li>• Raw format for direct usage</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Supported Key Types */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Supported Key Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Symmetric Algorithms</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>AES:</strong> 128, 192, or 256-bit keys</li>
                  <li>• <strong>DES:</strong> 64-bit keys (56-bit effective)</li>
                  <li>• <strong>3DES:</strong> 192-bit keys (168-bit effective)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Classical Ciphers</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>Vigenère:</strong> Text-based keys</li>
                  <li>• <strong>XOR:</strong> Any length binary keys</li>
                  <li>• <strong>Custom:</strong> Algorithm-specific formats</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}