import React, { useState, useEffect } from 'react';
import { Hash, Copy, Download } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { hashText } from '../../utils/hashAlgorithms';
import { HashResult } from '../../types/crypto';

const hashAlgorithms = [
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha224', label: 'SHA-224' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha384', label: 'SHA-384' },
  { value: 'sha512', label: 'SHA-512' },
  { value: 'ripemd160', label: 'RIPEMD-160' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'blake2', label: 'BLAKE2' },
];

export function HashPage() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [result, setResult] = useState<HashResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get algorithm from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && hashAlgorithms.find(alg => alg.value === algorithmParam)) {
      setAlgorithm(algorithmParam);
    }
  }, []);

  const handleProcess = async () => {
    if (!inputText || !algorithm) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const hashResult = hashText(inputText, algorithm);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Hash Functions</h1>
            <p className="text-gray-400 text-lg">
              Generate cryptographic hashes for data integrity verification
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-primary-400" />
                Input Configuration
              </h2>

              <div className="space-y-6">
                <Select
                  label="Hash Algorithm"
                  value={algorithm}
                  onChange={setAlgorithm}
                  options={hashAlgorithms}
                  placeholder="Select a hash algorithm"
                />

                <Textarea
                  label="Text to Hash"
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Enter text to generate hash..."
                  rows={8}
                />

                <Button
                  onClick={handleProcess}
                  loading={isProcessing}
                  disabled={!inputText || !algorithm}
                  className="w-full"
                  size="lg"
                  icon={Hash}
                >
                  Generate Hash
                </Button>
              </div>
            </Card>

            {/* Result Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-accent-400" />
                Hash Result
              </h2>

              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Algorithm: <span className="text-white">{result.algorithm.toUpperCase()}</span>
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
                      <div className="bg-gray-700 rounded-lg p-4">
                        <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
                          {result.hash}
                        </pre>
                      </div>
                      <div className="text-xs text-gray-400">
                        Hash length: {result.hash?.length} characters
                      </div>
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
                    <Hash className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Select a hash algorithm and enter text to generate hash
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Hash Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Hash Algorithm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Legacy Algorithms</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• MD5 - 128-bit hash (deprecated for security)</li>
                  <li>• SHA-1 - 160-bit hash (deprecated for security)</li>
                  <li>• RIPEMD-160 - 160-bit hash</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">SHA-2 Family</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• SHA-224 - 224-bit hash</li>
                  <li>• SHA-256 - 256-bit hash (recommended)</li>
                  <li>• SHA-384 - 384-bit hash</li>
                  <li>• SHA-512 - 512-bit hash</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Modern Algorithms</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Whirlpool - 512-bit hash</li>
                  <li>• BLAKE2 - High-speed cryptographic hash</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}