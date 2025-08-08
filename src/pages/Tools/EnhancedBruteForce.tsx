import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Copy, Filter, Settings, Key } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Header } from '../../components/Layout/Header';
import { bruteForceDecryptWithProgress } from '../../utils/comprehensiveCryptoAlgorithms';
import { BruteForceResult } from '../../types/crypto';

const categoryOptions = [
  { value: 'all', label: 'All Algorithms' },
  { value: 'encoding', label: 'Encoding Only' },
  { value: 'classical', label: 'Classical Ciphers Only' },
  { value: 'asymmetric', label: 'Asymmetric Encryption Only' },
  { value: 'symmetric', label: 'Symmetric Encryption Only' }
];

export function EnhancedBruteForce() {
  const [inputText, setInputText] = useState('');
  const [providedKey, setProvidedKey] = useState('');
  const [category, setCategory] = useState<'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all'>('all');
  const [results, setResults] = useState<BruteForceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOnlyReadable, setShowOnlyReadable] = useState(true);
  const [minConfidence, setMinConfidence] = useState(0.3);

  const handleBruteForce = async () => {
    if (!inputText) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    try {
      const bruteForceResults = await bruteForceDecryptWithProgress(
        inputText,
        category,
        (progressValue) => setProgress(progressValue),
        providedKey || undefined
      );
      setResults(bruteForceResults);
      setProgress(100);
    } catch (error) {
      console.error('Brute force failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredResults = results.filter(result => {
    if (showOnlyReadable && !result.isReadable) return false;
    if (result.confidence < minConfidence) return false;
    return true;
  });

  const readableResults = results.filter(r => r.isReadable);
  const providedKeyResults = results.filter(r => r.algorithm.includes('provided key'));
  const totalAttempts = results.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Enhanced Brute Force Decryption</h1>
            <p className="text-gray-400 text-lg">
              Advanced brute force analysis with key support and categorized algorithm testing
            </p>
          </div>

          {/* Configuration Section */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-yellow-400" />
              Configuration
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Select
                  label="Algorithm Category"
                  value={category}
                  onChange={(value) => setCategory(value as any)}
                  options={categoryOptions}
                />

                <Input
                  label="Provided Key (Optional)"
                  value={providedKey}
                  onChange={setProvidedKey}
                  placeholder="Enter a key to try (will be tested first)"
                  icon={Key}
                />

                <Textarea
                  label="Encrypted Text"
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your encrypted text here..."
                  rows={6}
                />

                <Button
                  onClick={handleBruteForce}
                  loading={isProcessing}
                  disabled={!inputText}
                  size="lg"
                  icon={Zap}
                  className="w-full"
                >
                  Start Enhanced Brute Force
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Category Information</h3>
                  <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-300">
                    {category === 'all' && (
                      <ul className="space-y-1">
                        <li>• Tests all available algorithms</li>
                        <li>• Includes 100+ different methods</li>
                        <li>• Most comprehensive analysis</li>
                        <li>• Takes longer to complete</li>
                        {providedKey && <li>• <strong>Will test your provided key first</strong></li>}
                      </ul>
                    )}
                    {category === 'encoding' && (
                      <ul className="space-y-1">
                        <li>• Base64, Base32, Base58, etc.</li>
                        <li>• Hexadecimal and Binary</li>
                        <li>• URL and HTML encoding</li>
                        <li>• Fastest category to test</li>
                        <li>• No keys required for these algorithms</li>
                      </ul>
                    )}
                    {category === 'classical' && (
                      <ul className="space-y-1">
                        <li>• Substitution: Caesar, Atbash, ROT13, Monoalphabetic</li>
                        <li>• Polyalphabetic: Vigenère, Beaufort, Autokey, Playfair, Hill</li>
                        <li>• Transposition: Rail Fence, Columnar, Scytale, Route</li>
                        <li>• Tests common keys and shifts</li>
                        {providedKey && <li>• <strong>Will prioritize your provided key</strong></li>}
                      </ul>
                    )}
                    {category === 'asymmetric' && (
                      <ul className="space-y-1">
                        <li>• RSA, ElGamal, ECC encryption</li>
                        <li>• Post-quantum: Kyber, Dilithium, NTRU</li>
                        <li>• Knapsack and Paillier cryptosystems</li>
                        <li>• Tests common keys and shifts</li>
                        {providedKey && <li>• <strong>Will prioritize your provided key</strong></li>}
                      </ul>
                    )}
                    {category === 'symmetric' && (
                      <ul className="space-y-1">
                        <li>• Block ciphers: AES, DES, 3DES, Blowfish, Twofish, IDEA</li>
                        <li>• Stream ciphers: RC4, ChaCha20, Salsa20, A5/1, Grain</li>
                        <li>• Various modes: ECB, CBC, CFB, OFB, CTR, GCM</li>
                        <li>• Tests with common passwords</li>
                        {providedKey && <li>• <strong>Will test your key with all algorithms</strong></li>}
                      </ul>
                    )}
                  </div>
                </div>

                {providedKey && (
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                      <Key className="h-4 w-4 mr-1" />
                      Key Strategy
                    </h3>
                    <p className="text-sm text-blue-300">
                      Your provided key will be tested first with all applicable algorithms. 
                      Common keys will also be tested for comprehensive coverage.
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div>
                    <ProgressBar progress={progress} />
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      Testing algorithms... {Math.round(progress)}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <>
              {/* Results Summary */}
              <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    Results Summary
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showOnlyReadable}
                          onChange={(e) => setShowOnlyReadable(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Show only readable</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">Min confidence:</span>
                      <select
                        value={minConfidence}
                        onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1"
                      >
                        <option value={0}>0%</option>
                        <option value={0.1}>10%</option>
                        <option value={0.3}>30%</option>
                        <option value={0.5}>50%</option>
                        <option value={0.7}>70%</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{totalAttempts}</div>
                    <div className="text-sm text-gray-400">Total Attempts</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{readableResults.length}</div>
                    <div className="text-sm text-gray-400">Readable Results</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{providedKeyResults.length}</div>
                    <div className="text-sm text-gray-400">Provided Key Hits</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{filteredResults.length}</div>
                    <div className="text-sm text-gray-400">Filtered Results</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {readableResults.length > 0 ? Math.round(readableResults[0].confidence * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Best Confidence</div>
                  </div>
                </div>
              </Card>

              {/* Provided Key Results */}
              {providedKey && providedKeyResults.length > 0 && (
                <Card className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Key className="h-5 w-5 mr-2 text-blue-400" />
                    Provided Key Results ({providedKeyResults.length})
                  </h3>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {providedKeyResults.slice(0, 10).map((result, index) => (
                      <div key={index} className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-400">
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-blue-300">
                              {Math.round(result.confidence * 100)}%
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
                          {result.result.length > 200 
                            ? result.result.substring(0, 200) + '...' 
                            : result.result}
                        </pre>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Results List */}
              <div className="space-y-6">
                {/* High Confidence Results */}
                {filteredResults.filter(r => r.confidence >= 0.6).length > 0 && (
                  <Card>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      High Confidence Results ({filteredResults.filter(r => r.confidence >= 0.6).length})
                    </h3>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredResults
                        .filter(r => r.confidence >= 0.6)
                        .slice(0, 10)
                        .map((result, index) => (
                          <div key={index} className={`rounded-lg p-4 border ${
                            result.confidence >= 0.8 ? 'bg-green-600/20 border-green-600/30' :
                            result.confidence >= 0.6 ? 'bg-yellow-600/20 border-yellow-600/30' :
                            'bg-blue-600/20 border-blue-600/30'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${
                                result.confidence >= 0.8 ? 'text-green-400' :
                                result.confidence >= 0.6 ? 'text-yellow-400' :
                                'text-blue-400'
                              }`}>
                                {result.algorithm}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-bold ${
                                  result.confidence >= 0.8 ? 'text-green-300' :
                                  result.confidence >= 0.6 ? 'text-yellow-300' :
                                  'text-blue-300'
                                }`}>
                                  {Math.round(result.confidence * 100)}%
                                </span>
                                <div className="w-16 bg-gray-600 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      result.confidence >= 0.8 ? 'bg-green-400' :
                                      result.confidence >= 0.6 ? 'bg-yellow-400' :
                                      'bg-blue-400'
                                    }`}
                                    style={{ width: `${result.confidence * 100}%` }}
                                  />
                                </div>
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
                            <pre className="font-mono text-sm text-white whitespace-pre-wrap break-all bg-gray-800 rounded p-2">
                              {result.result}
                            </pre>
                            {result.result.includes('harsha') || result.result.includes('hello') || result.result.includes('world') ? (
                              <div className="mt-2 text-xs text-green-400 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Contains recognizable words/names
                              </div>
                            ) : null}
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

                {/* All Filtered Results */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                    All Results Ranked by Confidence ({filteredResults.length})
                  </h3>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredResults.slice(0, 50).map((result, index) => (
                      <div 
                        key={index} 
                        className={`rounded-lg p-3 ${
                          result.algorithm.includes('provided key')
                            ? 'bg-blue-600/20 border border-blue-600/30'
                            : result.confidence >= 0.8 
                            ? 'bg-green-600/20 border border-green-600/30' 
                            : result.confidence >= 0.6
                            ? 'bg-yellow-600/20 border border-yellow-600/30'
                            : result.confidence >= 0.4
                            ? 'bg-orange-600/20 border-orange-600/30'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            result.algorithm.includes('provided key') ? 'text-blue-400' :
                            result.confidence >= 0.8 ? 'text-green-400' :
                            result.confidence >= 0.6 ? 'text-yellow-400' :
                            result.confidence >= 0.4 ? 'text-orange-400' : 'text-gray-400'
                          }`}>
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-bold ${
                              result.confidence >= 0.8 ? 'text-green-300' :
                              result.confidence >= 0.6 ? 'text-yellow-300' :
                              result.confidence >= 0.4 ? 'text-orange-300' : 'text-gray-400'
                            }`}>
                              {Math.round(result.confidence * 100)}%
                            </span>
                            <div className="w-12 bg-gray-600 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  result.confidence >= 0.8 ? 'bg-green-400' :
                                  result.confidence >= 0.6 ? 'bg-yellow-400' :
                                  result.confidence >= 0.4 ? 'bg-orange-400' : 'bg-gray-400'
                                }`}
                                style={{ width: `${result.confidence * 100}%` }}
                              />
                            </div>
                            <Button
                              onClick={() => handleCopy(result.result)}
                              size="sm"
                              variant="secondary"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-gray-300 truncate bg-gray-800 rounded px-2 py-1">
                          {result.result}
                        </div>
                        {/* Quality indicators */}
                        <div className="flex items-center space-x-2 mt-1">
                          {result.result.toLowerCase().includes('harsha') && (
                            <span className="text-xs bg-green-600/30 text-green-300 px-2 py-0.5 rounded">
                              Contains "harsha"
                            </span>
                          )}
                          {result.result.toLowerCase().includes('hello') && (
                            <span className="text-xs bg-green-600/30 text-green-300 px-2 py-0.5 rounded">
                              Contains "hello"
                            </span>
                          )}
                          {/\b[A-Z][a-z]+\b/.test(result.result) && (
                            <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">
                              Proper names
                            </span>
                          )}
                          {/[.!?]/.test(result.result) && (
                            <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">
                              Sentences
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {filteredResults.length > 50 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-400">
                          Showing first 50 results. {filteredResults.length - 50} more available.
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* No Results */}
          {!isProcessing && results.length === 0 && inputText && (
            <Card>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No readable results found</h3>
                <p className="text-gray-400">
                  The text might be encrypted with an unsupported algorithm, require a specific key,
                  or may not be encrypted at all.
                </p>
              </div>
            </Card>
          )}

          {/* Information Card */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Enhanced Brute Force Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Key Support</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Provided key tested first</li>
                  <li>• Common passwords included</li>
                  <li>• Key variations for classical ciphers</li>
                  <li>• Prioritized results display</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Algorithm Coverage</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 100+ encryption algorithms</li>
                  <li>• Classical and modern ciphers</li>
                  <li>• Multiple encoding schemes</li>
                  <li>• Symmetric and asymmetric methods</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Smart Analysis</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Confidence scoring system</li>
                  <li>• Readability assessment</li>
                  <li>• Common word detection</li>
                  <li>• Pattern recognition</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}