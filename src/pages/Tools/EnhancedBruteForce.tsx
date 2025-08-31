import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Copy, Filter, Settings, Key, Target, TrendingUp, Award, Sparkles } from 'lucide-react';
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
  { value: 'all', label: '🔍 All Algorithms (Comprehensive)' },
  { value: 'encoding', label: '📝 Encoding Only (Fast)' },
  { value: 'classical', label: '🏛️ Classical Ciphers Only' },
  { value: 'symmetric', label: '🔐 Symmetric Encryption Only' },
  { value: 'asymmetric', label: '🔑 Asymmetric Encryption Only' }
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
    if (!inputText.trim()) return;

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

  // Categorize results by confidence
  const excellentResults = filteredResults.filter(r => r.confidence >= 0.8);
  const goodResults = filteredResults.filter(r => r.confidence >= 0.6 && r.confidence < 0.8);
  const fairResults = filteredResults.filter(r => r.confidence >= 0.4 && r.confidence < 0.6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Header />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Zap className="h-12 w-12 text-yellow-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-accent-400 animate-bounce-subtle" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Enhanced Brute Force
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto">
              Advanced brute force analysis with percentage-based ranking and intelligent readability scoring
            </p>
          </div>

          {/* Configuration Section */}
          <Card variant="gradient" className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-yellow-400" />
              Configuration
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
                  placeholder="Enter a key to prioritize in testing"
                  icon={Key}
                />

                <Textarea
                  label="Encrypted Text"
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your encrypted text here for analysis..."
                  rows={6}
                />

                <Button
                  onClick={handleBruteForce}
                  loading={isProcessing}
                  disabled={!inputText.trim()}
                  size="lg"
                  icon={Zap}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isProcessing ? 'Analyzing...' : 'Start Enhanced Analysis'}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Category Information
                  </h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    {category === 'all' && (
                      <div>
                        <div className="font-medium text-primary-400 mb-1">Comprehensive Analysis</div>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Tests all 84+ available algorithms</li>
                          <li>• Most thorough analysis possible</li>
                          <li>• Takes longer but covers everything</li>
                          {providedKey && <li>• <strong className="text-blue-400">Your key tested first</strong></li>}
                        </ul>
                      </div>
                    )}
                    {category === 'encoding' && (
                      <div>
                        <div className="font-medium text-green-400 mb-1">Encoding Analysis</div>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Base64, Base32, Base58, Hex, Binary</li>
                          <li>• URL and HTML encoding</li>
                          <li>• Fastest category to test</li>
                          <li>• No keys required</li>
                        </ul>
                      </div>
                    )}
                    {category === 'classical' && (
                      <div>
                        <div className="font-medium text-purple-400 mb-1">Classical Ciphers</div>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Caesar, Vigenère, Playfair, Hill</li>
                          <li>• Rail Fence, Columnar, Route</li>
                          <li>• Tests common keys and shifts</li>
                          {providedKey && <li>• <strong className="text-blue-400">Prioritizes your key</strong></li>}
                        </ul>
                      </div>
                    )}
                    {category === 'symmetric' && (
                      <div>
                        <div className="font-medium text-blue-400 mb-1">Symmetric Encryption</div>
                        <ul className="space-y-1 text-gray-400">
                          <li>• AES, DES, Blowfish, ChaCha20</li>
                          <li>• Various cipher modes</li>
                          <li>• Tests common passwords</li>
                          {providedKey && <li>• <strong className="text-blue-400">Tests your key first</strong></li>}
                        </ul>
                      </div>
                    )}
                    {category === 'asymmetric' && (
                      <div>
                        <div className="font-medium text-orange-400 mb-1">Asymmetric Encryption</div>
                        <ul className="space-y-1 text-gray-400">
                          <li>• RSA, ECC, ElGamal</li>
                          <li>• Post-quantum algorithms</li>
                          <li>• Public/private key testing</li>
                          {providedKey && <li>• <strong className="text-blue-400">Uses your key</strong></li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {providedKey && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Key Strategy
                    </h3>
                    <p className="text-sm text-blue-300">
                      Your provided key will be tested first with all applicable algorithms. 
                      Results will be clearly marked and prioritized.
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <ProgressBar progress={progress} />
                    <p className="text-sm text-gray-400 mt-3 text-center">
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
              <Card variant="glass" className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center mb-4 lg:mb-0">
                    <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
                    Analysis Results
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showOnlyReadable}
                          onChange={(e) => setShowOnlyReadable(e.target.checked)}
                          className="rounded bg-white/10 border-white/20 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-300">Readable only</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">Min confidence:</span>
                      <select
                        value={minConfidence}
                        onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                        className="bg-white/10 text-white text-sm rounded-lg px-3 py-1 border border-white/20 focus:ring-2 focus:ring-primary-500"
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

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{totalAttempts}</div>
                    <div className="text-sm text-gray-400">Total Tests</div>
                  </div>
                  <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-green-500/20">
                    <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">{readableResults.length}</div>
                    <div className="text-sm text-gray-400">Readable</div>
                  </div>
                  <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-500/20">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-1">{providedKeyResults.length}</div>
                    <div className="text-sm text-gray-400">Key Hits</div>
                  </div>
                  <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-purple-500/20">
                    <div className="text-2xl lg:text-3xl font-bold text-purple-400 mb-1">{filteredResults.length}</div>
                    <div className="text-sm text-gray-400">Filtered</div>
                  </div>
                  <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-500/20">
                    <div className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">
                      {readableResults.length > 0 ? Math.round(readableResults[0].confidence * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Best Score</div>
                  </div>
                </div>
              </Card>

              {/* Excellent Results (80%+) */}
              {excellentResults.length > 0 && (
                <Card variant="glass" className="mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-3 text-green-400" />
                    Excellent Matches ({excellentResults.length})
                    <span className="ml-2 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">80%+ Confidence</span>
                  </h3>

                  <div className="space-y-4">
                    {excellentResults.slice(0, 5).map((result, index) => (
                      <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <span className="text-lg font-semibold text-green-400">
                              {result.algorithm}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-green-300">
                                {Math.round(result.confidence * 100)}%
                              </span>
                              <div className="w-20 bg-gray-600 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                                  style={{ width: `${result.confidence * 100}%` }}
                                />
                              </div>
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
                        
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <pre className="font-mono text-sm text-white whitespace-pre-wrap break-all">
                            {result.result}
                          </pre>
                        </div>
                        
                        {/* Quality indicators */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {result.result.toLowerCase().includes('harsha') && (
                            <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                              ✓ Contains "harsha"
                            </span>
                          )}
                          {result.result.toLowerCase().includes('hello') && (
                            <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                              ✓ Contains "hello"
                            </span>
                          )}
                          {/\b[A-Z][a-z]+\b/.test(result.result) && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                              ✓ Proper names
                            </span>
                          )}
                          {/[.!?]/.test(result.result) && (
                            <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                              ✓ Sentences
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Good Results (60-79%) */}
              {goodResults.length > 0 && (
                <Card variant="glass" className="mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-3 text-yellow-400" />
                    Good Matches ({goodResults.length})
                    <span className="ml-2 bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">60-79% Confidence</span>
                  </h3>

                  <div className="space-y-3">
                    {goodResults.slice(0, 8).map((result, index) => (
                      <div key={index} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <span className="text-base font-medium text-yellow-400 mb-2 sm:mb-0">
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-yellow-300">
                              {Math.round(result.confidence * 100)}%
                            </span>
                            <div className="w-16 bg-gray-600 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
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
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-mono text-gray-300 truncate">
                            {result.result}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* All Results Ranked */}
              <Card variant="glass">
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3 text-purple-400" />
                  All Results Ranked by Percentage ({filteredResults.length})
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredResults.slice(0, 50).map((result, index) => {
                    const isProvidedKey = result.algorithm.includes('provided key');
                    const confidencePercent = Math.round(result.confidence * 100);
                    
                    return (
                      <div 
                        key={index} 
                        className={`rounded-xl p-3 lg:p-4 border transition-all duration-200 hover:bg-white/10 ${
                          isProvidedKey
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : confidencePercent >= 80 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : confidencePercent >= 60
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : confidencePercent >= 40
                            ? 'bg-orange-500/10 border-orange-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <span className={`text-sm lg:text-base font-medium mb-1 sm:mb-0 ${
                            isProvidedKey ? 'text-blue-400' :
                            confidencePercent >= 80 ? 'text-green-400' :
                            confidencePercent >= 60 ? 'text-yellow-400' :
                            confidencePercent >= 40 ? 'text-orange-400' : 'text-gray-400'
                          }`}>
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-bold ${
                              confidencePercent >= 80 ? 'text-green-300' :
                              confidencePercent >= 60 ? 'text-yellow-300' :
                              confidencePercent >= 40 ? 'text-orange-300' : 'text-gray-400'
                            }`}>
                              {confidencePercent}%
                            </span>
                            <div className="w-16 lg:w-20 bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  confidencePercent >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                  confidencePercent >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                  confidencePercent >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${confidencePercent}%` }}
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
                        
                        <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                          <div className="text-xs lg:text-sm font-mono text-gray-300 truncate">
                            {result.result}
                          </div>
                        </div>
                        
                        {/* Enhanced Quality indicators */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {result.result.toLowerCase().includes('harsha') && (
                            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Contains "harsha"
                            </span>
                          )}
                          {result.result.toLowerCase().includes('hello') && (
                            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30">
                              ✓ Contains "hello"
                            </span>
                          )}
                          {/\b[A-Z][a-z]+\b/.test(result.result) && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                              👤 Proper names
                            </span>
                          )}
                          {/[.!?]/.test(result.result) && (
                            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                              📝 Sentences
                            </span>
                          )}
                          {isProvidedKey && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30 flex items-center">
                              <Key className="h-3 w-3 mr-1" />
                              Your key
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredResults.length > 50 && (
                    <div className="text-center py-4">
                      <span className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        Showing top 50 results. {filteredResults.length - 50} more available.
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* No Results */}
          {!isProcessing && results.length === 0 && inputText && (
            <Card variant="glass">
              <div className="text-center py-12 lg:py-16">
                <AlertTriangle className="h-16 w-16 lg:h-20 lg:w-20 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-lg lg:text-xl font-medium text-white mb-4">No Readable Results Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  The text might be encrypted with an unsupported algorithm, require a specific key,
                  or may not be encrypted at all.
                </p>
              </div>
            </Card>
          )}

          {/* Information Card */}
          <Card variant="gradient" className="mt-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6">Enhanced Analysis Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-medium text-primary-400 mb-3 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Smart Key Testing
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Provided key tested first</li>
                  <li>• 25+ common passwords included</li>
                  <li>• Key variations for classical ciphers</li>
                  <li>• Prioritized results display</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-medium text-accent-400 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Algorithm Coverage
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 84+ encryption algorithms</li>
                  <li>• Classical and modern ciphers</li>
                  <li>• Multiple encoding schemes</li>
                  <li>• Symmetric and asymmetric methods</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-medium text-purple-400 mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Intelligent Analysis
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Percentage-based confidence scoring</li>
                  <li>• Name and word recognition</li>
                  <li>• Sentence structure detection</li>
                  <li>• Quality ranking system</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}