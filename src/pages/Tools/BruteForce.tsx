import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Textarea } from '../../components/UI/Textarea';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Header } from '../../components/Layout/Header';
import { bruteForceDecrypt } from '../../utils/cryptoAlgorithms';
import { BruteForceResult } from '../../types/crypto';

export function BruteForce() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<BruteForceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBruteForce = async () => {
    if (!inputText) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const bruteForceResults = bruteForceDecrypt(inputText);
      setResults(bruteForceResults);
      setProgress(100);
    } catch (error) {
      console.error('Brute force failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const readableResults = results.filter(r => r.isReadable);
  const allResults = results.filter(r => !r.isReadable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Brute Force Decryption</h1>
            <p className="text-gray-400 text-lg">
              Attempt to decrypt text by trying multiple algorithms and keys
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Encrypted Text Input
            </h2>

            <div className="space-y-6">
              <Textarea
                label="Encrypted Text"
                value={inputText}
                onChange={setInputText}
                placeholder="Paste your encrypted text here..."
                rows={6}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  This process may take some time depending on the complexity
                </div>
                <Button
                  onClick={handleBruteForce}
                  loading={isProcessing}
                  disabled={!inputText}
                  size="lg"
                  icon={Zap}
                >
                  Start Brute Force
                </Button>
              </div>

              {isProcessing && (
                <ProgressBar progress={progress} />
              )}
            </div>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Readable Results */}
              {readableResults.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    Likely Matches ({readableResults.length})
                  </h2>

                  <div className="space-y-4">
                    {readableResults.map((result, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-400">
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              Confidence: {Math.round(result.confidence * 100)}%
                            </span>
                            <Button
                              onClick={() => handleCopy(result.result)}
                              size="sm"
                              variant="secondary"
                              icon={Copy}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        <pre className="font-mono text-sm text-white whitespace-pre-wrap break-all">
                          {result.result}
                        </pre>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* All Results */}
              <Card>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  All Attempts ({results.length})
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`bg-gray-700 rounded-lg p-3 ${
                        result.isReadable ? 'border-l-4 border-green-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          result.isReadable ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {result.algorithm}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {Math.round(result.confidence * 100)}%
                          </span>
                          <Button
                            onClick={() => handleCopy(result.result)}
                            size="sm"
                            variant="secondary"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-gray-300 truncate">
                        {result.result}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* No Results */}
          {!isProcessing && results.length === 0 && inputText && (
            <Card>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No readable results found</h3>
                <p className="text-gray-400">
                  The text might be encrypted with an unsupported algorithm or may require a specific key.
                </p>
              </div>
            </Card>
          )}

          {/* Information Card */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">How Brute Force Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Algorithms Tested</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Caesar Cipher (all 25 shifts)</li>
                  <li>• Base64 decoding</li>
                  <li>• Vigenère (common keys)</li>
                  <li>• XOR cipher (common keys)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Confidence Scoring</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Common English words frequency</li>
                  <li>• Character distribution analysis</li>
                  <li>• Text readability assessment</li>
                  <li>• Language pattern recognition</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}