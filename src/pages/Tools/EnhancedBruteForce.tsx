import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Copy, Filter, Target, TrendingUp, Award, Sparkles, Info } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Header } from '../../components/Layout/Header';
import { bruteForceDecrypt } from '../../utils/cryptoAlgorithms';
import { BruteForceResult } from '../../types/crypto';

const categoryOptions = [
  { value: 'all', label: '🔍 All Algorithms (Comprehensive)' },
  { value: 'encoding', label: '📝 Encoding Only (Fast)' },
  { value: 'classical', label: '🏛️ Classical Ciphers Only' },
];

export function EnhancedBruteForce() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<BruteForceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOnlyReadable, setShowOnlyReadable] = useState(true);

  const handleBruteForce = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 90));
    }, 300);

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

  const filteredResults = showOnlyReadable ? results.filter(r => r.isReadable) : results;
  const readableResults = results.filter(r => r.isReadable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                <Zap className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-cyan-400 animate-bounce" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Brute Force Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Intelligent decryption with confidence-based ranking
          </p>
        </div>

        {/* Input Section */}
        <Card variant="gradient" className="mb-8">
          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">Analysis Configuration</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Textarea
                label="Encrypted Text"
                value={inputText}
                onChange={setInputText}
                placeholder="Paste your encrypted text here for analysis..."
                rows={6}
                required
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Analysis Info
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Tests multiple algorithms automatically</li>
                  <li>• Ranks results by readability confidence</li>
                  <li>• Identifies meaningful text patterns</li>
                  <li>• Highlights proper names and sentences</li>
                </ul>
              </div>

              <Button
                onClick={handleBruteForce}
                loading={isProcessing}
                disabled={!inputText.trim()}
                fullWidth
                size="lg"
                icon={Zap}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {isProcessing ? 'Analyzing...' : 'Start Analysis'}
              </Button>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-6">
              <ProgressBar progress={progress} />
              <p className="text-sm text-gray-400 mt-3 text-center">
                Testing algorithms... {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <>
            {/* Results Summary */}
            <Card variant="glass" className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center mb-4 lg:mb-0">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
                  Analysis Results
                </h2>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showOnlyReadable}
                      onChange={(e) => setShowOnlyReadable(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Show only readable results</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{results.length}</div>
                  <div className="text-sm text-gray-400">Total Tests</div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400 mb-1">{readableResults.length}</div>
                  <div className="text-sm text-gray-400">Readable</div>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {readableResults.length > 0 ? Math.round(readableResults[0].confidence * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">Best Score</div>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{filteredResults.length}</div>
                  <div className="text-sm text-gray-400">Shown</div>
                </div>
              </div>
            </Card>

            {/* Top Results */}
            {filteredResults.length > 0 ? (
              <Card variant="glass">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-3 text-green-400" />
                  Ranked Results ({filteredResults.length})
                </h3>

                <div className="space-y-4">
                  {filteredResults.slice(0, 10).map((result, index) => {
                    const confidencePercent = Math.round(result.confidence * 100);
                    
                    return (
                      <div 
                        key={index} 
                        className={`rounded-xl p-4 border transition-all duration-200 hover:bg-white/10 ${
                          confidencePercent >= 80 ? 'bg-green-500/10 border-green-500/30' :
                          confidencePercent >= 60 ? 'bg-yellow-500/10 border-yellow-500/30' :
                          confidencePercent >= 40 ? 'bg-orange-500/10 border-orange-500/30' :
                          'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                          <span className={`text-lg font-medium mb-2 lg:mb-0 ${
                            confidencePercent >= 80 ? 'text-green-400' :
                            confidencePercent >= 60 ? 'text-yellow-400' :
                            confidencePercent >= 40 ? 'text-orange-400' : 'text-gray-400'
                          }`}>
                            {result.algorithm}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className={`text-xl font-bold ${
                              confidencePercent >= 80 ? 'text-green-300' :
                              confidencePercent >= 60 ? 'text-yellow-300' :
                              confidencePercent >= 40 ? 'text-orange-300' : 'text-gray-400'
                            }`}>
                              {confidencePercent}%
                            </span>
                            <div className="w-24 bg-gray-600 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
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
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                            {result.result}
                          </pre>
                        </div>
                        
                        {/* Quality indicators */}
                        <div className="flex flex-wrap gap-2 mt-3">
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
                    );
                  })}
                </div>
              </Card>
            ) : (
              <Card variant="glass">
                <div className="text-center py-16">
                  <AlertTriangle className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-white mb-4">No Readable Results Found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    The text might be encrypted with an unsupported algorithm or may require a specific key.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Information Card */}
        <Card variant="gradient" className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">How Brute Force Analysis Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-yellow-400 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Algorithm Testing
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Caesar Cipher (all 25 shifts)</li>
                <li>• Base64 decoding</li>
                <li>• Vigenère (common keys)</li>
                <li>• XOR cipher (common keys)</li>
                <li>• Modern encryption attempts</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-green-400 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Confidence Scoring
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Common English words frequency</li>
                <li>• Character distribution analysis</li>
                <li>• Text readability assessment</li>
                <li>• Language pattern recognition</li>
                <li>• Proper name detection</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-blue-400 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Quality Indicators
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 80%+ = Excellent match</li>
                <li>• 60-79% = Good match</li>
                <li>• 40-59% = Fair match</li>
                <li>• Visual tags for quality features</li>
                <li>• Automatic ranking by confidence</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}