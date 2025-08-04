import React, { useState, useEffect } from 'react';
import { Binary, Copy, Download } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { encodeText, decodeText } from '../../utils/encodingAlgorithms';
import { EncodingResult } from '../../types/crypto';

const encodingAlgorithms = [
  { value: 'base64', label: 'Base64' },
  { value: 'base32', label: 'Base32' },
  { value: 'base58', label: 'Base58' },
  { value: 'hex', label: 'Hexadecimal' },
  { value: 'binary', label: 'Binary' },
  { value: 'url', label: 'URL Encoding' },
  { value: 'ascii', label: 'ASCII Converter' },
];

export function EncodingPage() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<EncodingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get algorithm from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && encodingAlgorithms.find(alg => alg.value === algorithmParam)) {
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
    
    const processResult = operation === 'encode' 
      ? encodeText(inputText, algorithm)
      : decodeText(inputText, algorithm);
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Encoding & Decoding</h1>
            <p className="text-gray-400 text-lg">
              Convert text between different encoding formats
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Binary className="h-5 w-5 mr-2 text-primary-400" />
                Input Configuration
              </h2>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setOperation('encode')}
                    variant={operation === 'encode' ? 'primary' : 'secondary'}
                    className="flex-1"
                  >
                    Encode
                  </Button>
                  <Button
                    onClick={() => setOperation('decode')}
                    variant={operation === 'decode' ? 'primary' : 'secondary'}
                    className="flex-1"
                  >
                    Decode
                  </Button>
                </div>

                <Select
                  label="Encoding Format"
                  value={algorithm}
                  onChange={setAlgorithm}
                  options={encodingAlgorithms}
                  placeholder="Select an encoding format"
                />

                <Textarea
                  label={`Text to ${operation}`}
                  value={inputText}
                  onChange={setInputText}
                  placeholder={`Enter text to ${operation}...`}
                  rows={8}
                />

                <Button
                  onClick={handleProcess}
                  loading={isProcessing}
                  disabled={!inputText || !algorithm}
                  className="w-full"
                  size="lg"
                  icon={Binary}
                >
                  {operation === 'encode' ? 'Encode' : 'Decode'} Text
                </Button>
              </div>
            </Card>

            {/* Result Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Binary className="h-5 w-5 mr-2 text-accent-400" />
                Result
              </h2>

              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Format: <span className="text-white">{result.algorithm.toUpperCase()}</span>
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
                    <div className="bg-gray-700 rounded-lg p-4">
                      <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
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
                    <Binary className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Select an encoding format and enter text to see results
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Encoding Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Encoding Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Base Encodings</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Base64 - Binary-to-text encoding</li>
                  <li>• Base32 - 32-character alphabet encoding</li>
                  <li>• Base58 - Bitcoin-style encoding</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Number Systems</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Hexadecimal - Base-16 representation</li>
                  <li>• Binary - Base-2 representation</li>
                  <li>• ASCII - Character code conversion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Web Encodings</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• URL Encoding - Percent encoding for URLs</li>
                  <li>• HTML Entities - Character entity references</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}