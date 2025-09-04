import React, { useState } from 'react';
import { Search, Brain, TrendingUp, Info, Sparkles, Target } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { predictAlgorithm } from '../../utils/cryptoAlgorithms';
import { AlgorithmPrediction } from '../../types/crypto';

export function AlgorithmPredictionPage() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState<AlgorithmPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const results = predictAlgorithm(inputText);
      setPredictions(results);
    } catch (error) {
      console.error('Prediction failed:', error);
      setPredictions([{
        algorithm: 'Analysis Failed',
        confidence: 0,
        reasoning: 'Unable to analyze the provided text. Please check the input and try again.'
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    if (confidence >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceGradient = (confidence: number) => {
    if (confidence >= 0.8) return 'from-green-500 to-green-600';
    if (confidence >= 0.6) return 'from-yellow-500 to-yellow-600';
    if (confidence >= 0.4) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getConfidenceBorder = (confidence: number) => {
    if (confidence >= 0.8) return 'border-green-500/30';
    if (confidence >= 0.6) return 'border-yellow-500/30';
    if (confidence >= 0.4) return 'border-orange-500/30';
    return 'border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                <Brain className="h-12 w-12 text-purple-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-cyan-400 animate-bounce" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Algorithm Prediction
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Advanced pattern recognition to identify encryption algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Search className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Text Analysis</h2>
            </div>

            <div className="space-y-6">
              <Textarea
                label="Encrypted/Encoded Text"
                value={inputText}
                onChange={setInputText}
                placeholder="Paste your encrypted or encoded text here for AI analysis..."
                rows={8}
                required
              />

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  AI Analysis Features
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Pattern recognition algorithms</li>
                  <li>• Statistical analysis</li>
                  <li>• Character distribution assessment</li>
                  <li>• Format signature detection</li>
                </ul>
              </div>

              <Button
                onClick={handleAnalyze}
                loading={isAnalyzing}
                disabled={!inputText.trim()}
                fullWidth
                size="lg"
                icon={Brain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">AI Predictions</h2>
            </div>

            {predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div 
                    key={index} 
                    className={`bg-white/5 rounded-xl p-6 border ${getConfidenceBorder(prediction.confidence)} transition-all duration-300 hover:bg-white/10`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <h3 className="font-semibold text-white text-xl mb-2 lg:mb-0">
                        {prediction.algorithm}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                          {Math.round(prediction.confidence * 100)}%
                        </span>
                        <div className="w-24 bg-gray-600 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceGradient(prediction.confidence)} transition-all duration-500`}
                            style={{ width: `${prediction.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {prediction.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6 border border-white/10">
                  <Brain className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready for Analysis</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  Enter encrypted text to see AI-powered algorithm predictions
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Text Analysis Details */}
        {inputText && (
          <Card variant="gradient" className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">Text Analysis Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-blue-400 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Basic Statistics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Length:</span>
                    <span className="text-white font-medium">{inputText.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unique chars:</span>
                    <span className="text-white font-medium">{new Set(inputText).size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Whitespace:</span>
                    <span className="text-white font-medium">{(inputText.match(/\s/g) || []).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Character Types
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Letters:</span>
                    <span className="text-white font-medium">{(inputText.match(/[a-zA-Z]/g) || []).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Numbers:</span>
                    <span className="text-white font-medium">{(inputText.match(/[0-9]/g) || []).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Special:</span>
                    <span className="text-white font-medium">{(inputText.match(/[^a-zA-Z0-9\s]/g) || []).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-cyan-400 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Pattern Detection
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    Base64 pattern: {/^[A-Za-z0-9+/]*={0,2}$/.test(inputText) ? 'Yes' : 'No'}
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    Hex pattern: {/^[0-9A-Fa-f]+$/.test(inputText) ? 'Yes' : 'No'}
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    Only letters: {/^[A-Za-z\s]+$/.test(inputText) ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}