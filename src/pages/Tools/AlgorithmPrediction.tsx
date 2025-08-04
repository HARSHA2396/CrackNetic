import React, { useState } from 'react';
import { Search, Brain, TrendingUp, Info } from 'lucide-react';
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
    if (!inputText) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = predictAlgorithm(inputText);
    setPredictions(results);
    setIsAnalyzing(false);
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
            <h1 className="text-3xl font-bold text-white mb-4">Algorithm Prediction</h1>
            <p className="text-gray-400 text-lg">
              Analyze encrypted text to predict the algorithm used
            </p>
          </div>

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
                  placeholder="Paste your encrypted or encoded text here for analysis..."
                  rows={8}
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Analysis is based on pattern recognition
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    loading={isAnalyzing}
                    disabled={!inputText}
                    size="lg"
                    icon={Brain}
                  >
                    Analyze Text
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent-400" />
                Predictions
              </h2>

              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white text-lg">
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
                      <p className="text-gray-300 text-sm">
                        {prediction.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                    <Brain className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Enter encrypted text to see algorithm predictions
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Text Analysis Details */}
          {inputText && (
            <Card className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Text Analysis Details</h2>
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
                  <h3 className="font-medium text-primary-400 mb-2">Patterns</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Has padding: {inputText.includes('=') ? 'Yes' : 'No'}</li>
                    <li>• Only printable: {/^[\x20-\x7E]*$/.test(inputText) ? 'Yes' : 'No'}</li>
                    <li>• Base64 like: {/^[A-Za-z0-9+/]*={0,2}$/.test(inputText) ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Algorithm Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Detection Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Pattern Analysis</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Character set matching</li>
                  <li>• Length and padding patterns</li>
                  <li>• Format structure recognition</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Statistical Analysis</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Frequency distribution</li>
                  <li>• Entropy calculation</li>
                  <li>• Randomness assessment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Signature Detection</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Algorithm-specific markers</li>
                  <li>• Format identifiers</li>
                  <li>• Known patterns matching</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}