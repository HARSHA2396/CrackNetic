import React, { useState } from 'react';
import { Search, Brain, TrendingUp, Info } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Textarea } from '../../components/UI/Textarea';
import { FeedbackButton } from '../../components/UI/FeedbackButton';
import { Header } from '../../components/Layout/Header';
import { predictAlgorithmEnhanced, EnhancedAlgorithmPrediction } from '../../utils/enhancedAlgorithmPrediction';
import { AlgorithmPrediction } from '../../types/crypto';

export function AlgorithmPredictionPage() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState<AlgorithmPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlStats, setMlStats] = useState(EnhancedAlgorithmPrediction.getMLStats());

  const handleAnalyze = async () => {
    if (!inputText) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = predictAlgorithmEnhanced(inputText);
    setPredictions(results);
    setIsAnalyzing(false);
  };

  const handleFeedback = (prediction: AlgorithmPrediction, isCorrect: boolean) => {
    // Extract the actual algorithm name from prediction
    const actualAlgorithm = prediction.algorithm.replace(' (ML)', '');
    
    // Create training data
    EnhancedAlgorithmPrediction.createTrainingData(
      inputText,
      prediction.algorithm,
      actualAlgorithm,
      prediction.confidence,
      isCorrect ? 'correct' : 'incorrect'
    );
    
    // Update ML stats
    setMlStats(EnhancedAlgorithmPrediction.getMLStats());
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    if (confidence >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-400';
    if (confidence >= 0.6) return 'bg-yellow-400';
    if (confidence >= 0.4) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">AI-Enhanced Algorithm Prediction</h1>
            <p className="text-gray-400 text-lg">
              Analyze encrypted text to predict the algorithm used with machine learning
            </p>
          </div>

          {/* ML Statistics */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              Machine Learning Model Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{mlStats.training_count}</div>
                <div className="text-sm text-gray-400">Training Examples</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {mlStats.accuracy ? Math.round(mlStats.accuracy * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{mlStats.algorithms_learned.length}</div>
                <div className="text-sm text-gray-400">Algorithms Learned</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-400">
                  {mlStats.training_count > 0 ? 'Active' : 'Learning'}
                </div>
                <div className="text-sm text-gray-400">Model Status</div>
              </div>
            </div>

            {mlStats.training_count > 0 && (
              <div className="mt-4 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-400 text-sm flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <strong>AI-Powered:</strong> This model learns from your feedback to improve predictions over time.
                  Last updated: {new Date(mlStats.last_updated).toLocaleDateString()}
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Search className="h-5 w-5 mr-2 text-purple-400" />
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    AI-enhanced pattern recognition with user feedback learning
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    loading={isAnalyzing}
                    disabled={!inputText}
                    size="lg"
                    icon={Brain}
                  >
                    Analyze with AI
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent-400" />
                AI Predictions
              </h2>

              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white text-lg flex items-center">
                          {prediction.algorithm.includes('(ML)') && (
                            <Brain className="h-4 w-4 mr-2 text-purple-400" />
                          )}
                          {prediction.algorithm}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getConfidenceBackground(prediction.confidence)}`}
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {prediction.reasoning}
                      </p>
                      
                      {/* Feedback buttons for learning */}
                      <FeedbackButton
                        onFeedback={(isCorrect) => handleFeedback(prediction, isCorrect)}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                    <Brain className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Enter encrypted text to see AI-powered algorithm predictions
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Text Analysis Details */}
          {inputText && (
            <Card className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Advanced Text Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">Basic Statistics</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Length: {inputText.length} characters</li>
                    <li>• Unique characters: {new Set(inputText).size}</li>
                    <li>• Whitespace: {(inputText.match(/\s/g) || []).length}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">Character Types</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Letters: {(inputText.match(/[a-zA-Z]/g) || []).length}</li>
                    <li>• Numbers: {(inputText.match(/[0-9]/g) || []).length}</li>
                    <li>• Special chars: {(inputText.match(/[^a-zA-Z0-9\s]/g) || []).length}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">AI Features</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Entropy analysis</li>
                    <li>• Pattern recognition</li>
                    <li>• Statistical modeling</li>
                    <li>• Continuous learning</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Algorithm Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">AI Detection Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Machine Learning
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Feature extraction and analysis</li>
                  <li>• Pattern recognition algorithms</li>
                  <li>• Continuous learning from feedback</li>
                  <li>• Adaptive confidence scoring</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Statistical Analysis</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Entropy and randomness measurement</li>
                  <li>• Character frequency analysis</li>
                  <li>• Pattern distribution assessment</li>
                  <li>• Linguistic feature detection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Signature Detection</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Algorithm-specific markers</li>
                  <li>• Format structure recognition</li>
                  <li>• Known pattern matching</li>
                  <li>• Multi-algorithm correlation</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Learning Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-accent-400" />
              How the AI Learns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Feedback Learning</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Your feedback trains the model in real-time</li>
                  <li>• Correct predictions strengthen algorithm weights</li>
                  <li>• Incorrect predictions adjust feature importance</li>
                  <li>• Model accuracy improves with more data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Privacy & Security</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• All learning happens locally in your browser</li>
                  <li>• No data is sent to external servers</li>
                  <li>• Model weights stored in local storage</li>
                  <li>• You control your training data</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}