import React, { useState } from 'react';
import { Search, Brain, TrendingUp, Info, Sparkles, Target, Zap } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Textarea } from '../../components/UI/Textarea';
import { FeedbackButton } from '../../components/UI/FeedbackButton';
import { Header } from '../../components/Layout/Header';
import { EnhancedAlgorithmPrediction } from '../../utils/enhancedAlgorithmPrediction';
import { AlgorithmPrediction } from '../../types/crypto';

export function AlgorithmPredictionPage() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState<AlgorithmPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlStats, setMlStats] = useState(EnhancedAlgorithmPrediction.getMLStats());

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay with progress
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      const results = EnhancedAlgorithmPrediction.predictAlgorithm(inputText);
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

  const handleFeedback = (prediction: AlgorithmPrediction, isCorrect: boolean) => {
    try {
      const actualAlgorithm = prediction.algorithm.replace(' (ML)', '');
      
      EnhancedAlgorithmPrediction.createTrainingData(
        inputText,
        prediction.algorithm,
        actualAlgorithm,
        prediction.confidence,
        isCorrect ? 'correct' : 'incorrect'
      );
      
      setMlStats(EnhancedAlgorithmPrediction.getMLStats());
    } catch (error) {
      console.error('Failed to save feedback:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Header />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Brain className="h-12 w-12 text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-accent-400 animate-bounce-subtle" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              AI Algorithm Prediction
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto">
              Advanced machine learning analysis to identify encryption algorithms from ciphertext patterns
            </p>
          </div>

          {/* ML Statistics */}
          <Card variant="gradient" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center">
                <Brain className="h-6 w-6 mr-3 text-purple-400" />
                AI Model Status
              </h2>
              <div className="flex items-center space-x-2 bg-purple-500/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-300">Learning Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-purple-400 mb-1">{mlStats.training_count}</div>
                <div className="text-sm text-gray-400">Training Examples</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">
                  {mlStats.accuracy ? Math.round(mlStats.accuracy * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-1">{mlStats.algorithms_learned.length}</div>
                <div className="text-sm text-gray-400">Algorithms</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-accent-400 mb-1">
                  {mlStats.training_count > 0 ? 'Active' : 'Ready'}
                </div>
                <div className="text-sm text-gray-400">Status</div>
              </div>
            </div>

            {mlStats.training_count > 0 && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-sm flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <strong>AI-Powered:</strong> This model learns from your feedback to improve predictions.
                  Last updated: {new Date(mlStats.last_updated).toLocaleDateString()}
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Section */}
            <Card variant="glass">
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
                <Search className="h-6 w-6 mr-3 text-primary-400" />
                Text Analysis
              </h2>

              <div className="space-y-6">
                <Textarea
                  label="Encrypted/Encoded Text"
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your encrypted or encoded text here for AI analysis..."
                  rows={8}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    AI-enhanced pattern recognition with continuous learning
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    loading={isAnalyzing}
                    disabled={!inputText.trim()}
                    size="lg"
                    icon={Brain}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Section */}
            <Card variant="glass">
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
                <Target className="h-6 w-6 mr-3 text-accent-400" />
                AI Predictions
              </h2>

              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div 
                      key={index} 
                      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 lg:p-6 border ${getConfidenceBorder(prediction.confidence)} transition-all duration-300 hover:bg-white/10`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <h3 className="font-semibold text-white text-lg lg:text-xl flex items-center mb-2 lg:mb-0">
                          {prediction.algorithm.includes('(ML)') && (
                            <Brain className="h-5 w-5 mr-2 text-purple-400" />
                          )}
                          {prediction.algorithm}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                          <div className="w-20 lg:w-24 bg-gray-600 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full bg-gradient-to-r ${getConfidenceGradient(prediction.confidence)} transition-all duration-500`}
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm lg:text-base mb-4 leading-relaxed">
                        {prediction.reasoning}
                      </p>
                      
                      <FeedbackButton
                        onFeedback={(isCorrect) => handleFeedback(prediction, isCorrect)}
                        className="mt-3"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 lg:py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/5 rounded-2xl mb-6 border border-white/10">
                    <Brain className="h-8 w-8 lg:h-10 lg:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Ready for Analysis</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Enter encrypted text to see AI-powered algorithm predictions with confidence scoring
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Text Analysis Details */}
          {inputText && (
            <Card variant="gradient" className="mt-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-blue-400" />
                Advanced Text Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-blue-400 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Basic Statistics
                  </h3>
                  <div className="space-y-2 text-sm">
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
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-purple-400 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Character Types
                  </h3>
                  <div className="space-y-2 text-sm">
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
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-accent-400 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    AI Features
                  </h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                      Entropy analysis
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                      Pattern recognition
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                      Statistical modeling
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                      Continuous learning
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
            <Card variant="glass">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-3 text-purple-400" />
                AI Detection Methods
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-purple-400 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Machine Learning
                  </h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Feature extraction and analysis</li>
                    <li>• Pattern recognition algorithms</li>
                    <li>• Continuous learning from feedback</li>
                    <li>• Adaptive confidence scoring</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-blue-400 mb-2">Statistical Analysis</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Entropy and randomness measurement</li>
                    <li>• Character frequency analysis</li>
                    <li>• Pattern distribution assessment</li>
                    <li>• Linguistic feature detection</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card variant="glass">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Target className="h-5 w-5 mr-3 text-accent-400" />
                How AI Learning Works
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-accent-400 mb-2">Feedback Learning</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Your feedback trains the model in real-time</li>
                    <li>• Correct predictions strengthen algorithm weights</li>
                    <li>• Incorrect predictions adjust feature importance</li>
                    <li>• Model accuracy improves with more data</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-medium text-green-400 mb-2">Privacy & Security</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• All learning happens locally in your browser</li>
                    <li>• No data sent to external servers</li>
                    <li>• Model weights stored in local storage</li>
                    <li>• You control your training data</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}