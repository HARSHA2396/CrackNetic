// Machine Learning Training System for Algorithm Prediction
export interface TrainingData {
  id: string;
  input_text: string;
  predicted_algorithm: string;
  actual_algorithm: string;
  confidence: number;
  features: TextFeatures;
  is_correct: boolean;
  user_feedback: 'correct' | 'incorrect';
  created_at: Date;
}

export interface TextFeatures {
  length: number;
  entropy: number;
  character_distribution: {
    letters: number;
    numbers: number;
    symbols: number;
    whitespace: number;
  };
  base64_score: number;
  hex_score: number;
  binary_score: number;
  hash_score: number;
  cipher_score: number;
  unique_chars: number;
  repeated_patterns: number;
  vowel_ratio: number;
  consonant_ratio: number;
  special_char_ratio: number;
}

export interface MLModel {
  weights: { [key: string]: number };
  bias: number;
  algorithm_weights: { [algorithm: string]: { [feature: string]: number } };
  training_count: number;
  accuracy: number;
  last_updated: Date;
}

export class MLTrainingSystem {
  private static readonly STORAGE_KEY = 'securecrypt_ml_model';
  private static readonly TRAINING_DATA_KEY = 'securecrypt_training_data';
  
  // Initialize or load existing model
  static getModel(): MLModel {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load ML model:', error);
      }
    }
    
    // Return default model
    return {
      weights: {},
      bias: 0,
      algorithm_weights: {},
      training_count: 0,
      accuracy: 0,
      last_updated: new Date()
    };
  }
  
  // Save model to localStorage
  static saveModel(model: MLModel): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(model));
    } catch (error) {
      console.error('Failed to save ML model:', error);
    }
  }
  
  // Extract features from text
  static extractFeatures(text: string): TextFeatures {
    const length = text.length;
    const uniqueChars = new Set(text).size;
    
    // Character distribution
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const whitespace = (text.match(/\s/g) || []).length;
    
    // Calculate entropy
    const entropy = this.calculateEntropy(text);
    
    // Pattern scores
    const base64_score = this.calculateBase64Score(text);
    const hex_score = this.calculateHexScore(text);
    const binary_score = this.calculateBinaryScore(text);
    const hash_score = this.calculateHashScore(text);
    const cipher_score = this.calculateCipherScore(text);
    
    // Linguistic features
    const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
    const consonants = (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
    
    // Pattern detection
    const repeated_patterns = this.detectRepeatedPatterns(text);
    
    return {
      length,
      entropy,
      character_distribution: {
        letters: letters / length,
        numbers: numbers / length,
        symbols: symbols / length,
        whitespace: whitespace / length
      },
      base64_score,
      hex_score,
      binary_score,
      hash_score,
      cipher_score,
      unique_chars: uniqueChars / length,
      repeated_patterns,
      vowel_ratio: vowels / (vowels + consonants || 1),
      consonant_ratio: consonants / (vowels + consonants || 1),
      special_char_ratio: symbols / length
    };
  }
  
  // Calculate entropy of text
  private static calculateEntropy(text: string): number {
    const freq: { [key: string]: number } = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    let entropy = 0;
    const length = text.length;
    
    for (const count of Object.values(freq)) {
      const p = count / length;
      entropy -= p * Math.log2(p);
    }
    
    return entropy;
  }
  
  // Calculate Base64 likelihood score
  private static calculateBase64Score(text: string): number {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(text)) return 0;
    
    let score = 0.5; // Base score for matching pattern
    
    // Check length (should be multiple of 4)
    if (text.length % 4 === 0) score += 0.3;
    
    // Check padding
    const padding = (text.match(/=/g) || []).length;
    if (padding <= 2) score += 0.2;
    
    return Math.min(1, score);
  }
  
  // Calculate hexadecimal likelihood score
  private static calculateHexScore(text: string): number {
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (!hexRegex.test(text)) return 0;
    
    let score = 0.6; // Base score for matching pattern
    
    // Check even length
    if (text.length % 2 === 0) score += 0.4;
    
    return Math.min(1, score);
  }
  
  // Calculate binary likelihood score
  private static calculateBinaryScore(text: string): number {
    const binaryRegex = /^[01\s]+$/;
    if (!binaryRegex.test(text)) return 0;
    
    const cleanText = text.replace(/\s/g, '');
    let score = 0.5;
    
    // Check if length is multiple of 8
    if (cleanText.length % 8 === 0) score += 0.5;
    
    return Math.min(1, score);
  }
  
  // Calculate hash likelihood score
  private static calculateHashScore(text: string): number {
    if (!/^[a-f0-9]+$/i.test(text)) return 0;
    
    const commonHashLengths = [32, 40, 56, 64, 96, 128]; // MD5, SHA1, SHA224, SHA256, SHA384, SHA512
    const length = text.length;
    
    if (commonHashLengths.includes(length)) {
      return 0.9;
    }
    
    return 0.3; // Partial score for hex-only text
  }
  
  // Calculate cipher likelihood score
  private static calculateCipherScore(text: string): number {
    let score = 0;
    
    // Check for typical cipher characteristics
    const hasOnlyLetters = /^[A-Za-z\s]+$/.test(text);
    if (hasOnlyLetters) score += 0.3;
    
    // Check letter frequency distribution
    const letterFreq = this.analyzeLetterFrequency(text);
    if (letterFreq.variance > 0.02) score += 0.4;
    
    // Check for unusual patterns
    const hasRepeatedChars = /(.)\1{3,}/.test(text);
    if (!hasRepeatedChars) score += 0.3;
    
    return Math.min(1, score);
  }
  
  // Analyze letter frequency
  private static analyzeLetterFrequency(text: string): { variance: number } {
    const frequencies = new Array(26).fill(0);
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
    
    for (const char of cleanText) {
      frequencies[char.charCodeAt(0) - 97]++;
    }
    
    const total = cleanText.length;
    if (total === 0) return { variance: 0 };
    
    const normalizedFreqs = frequencies.map(freq => freq / total);
    const average = 1 / 26;
    const variance = normalizedFreqs.reduce((sum, freq) => sum + Math.pow(freq - average, 2), 0) / 26;
    
    return { variance };
  }
  
  // Detect repeated patterns
  private static detectRepeatedPatterns(text: string): number {
    const patterns: { [key: string]: number } = {};
    let patternCount = 0;
    
    // Check for 2-4 character patterns
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= text.length - len; i++) {
        const pattern = text.substr(i, len);
        patterns[pattern] = (patterns[pattern] || 0) + 1;
        
        if (patterns[pattern] === 2) {
          patternCount++;
        }
      }
    }
    
    return patternCount / text.length;
  }
  
  // Predict algorithm using trained model
  static predictWithML(text: string): { algorithm: string; confidence: number; features: TextFeatures } {
    const features = this.extractFeatures(text);
    const model = this.getModel();
    
    if (model.training_count === 0) {
      // Fallback to rule-based prediction if no training data
      return this.ruleBasedPrediction(text, features);
    }
    
    const scores: { [algorithm: string]: number } = {};
    
    // Calculate scores for each algorithm
    for (const [algorithm, weights] of Object.entries(model.algorithm_weights)) {
      let score = 0;
      
      // Calculate weighted feature score
      for (const [feature, weight] of Object.entries(weights)) {
        const featureValue = this.getFeatureValue(features, feature);
        score += featureValue * weight;
      }
      
      scores[algorithm] = score;
    }
    
    // Find best match
    const bestAlgorithm = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    const maxScore = Math.max(...Object.values(scores));
    const confidence = Math.min(1, Math.max(0, maxScore));
    
    return {
      algorithm: bestAlgorithm || 'Unknown',
      confidence,
      features
    };
  }
  
  // Rule-based fallback prediction
  private static ruleBasedPrediction(text: string, features: TextFeatures): { algorithm: string; confidence: number; features: TextFeatures } {
    if (features.base64_score > 0.8) {
      return { algorithm: 'Base64', confidence: features.base64_score, features };
    }
    
    if (features.hex_score > 0.8) {
      if (features.hash_score > 0.8) {
        return { algorithm: 'Hash Function', confidence: features.hash_score, features };
      }
      return { algorithm: 'Hexadecimal', confidence: features.hex_score, features };
    }
    
    if (features.binary_score > 0.8) {
      return { algorithm: 'Binary', confidence: features.binary_score, features };
    }
    
    if (features.cipher_score > 0.6) {
      return { algorithm: 'Classical Cipher', confidence: features.cipher_score, features };
    }
    
    return { algorithm: 'Unknown', confidence: 0.3, features };
  }
  
  // Get feature value by name
  private static getFeatureValue(features: TextFeatures, featureName: string): number {
    switch (featureName) {
      case 'length': return Math.log(features.length + 1) / 10; // Normalized
      case 'entropy': return features.entropy / 8; // Normalized
      case 'letters': return features.character_distribution.letters;
      case 'numbers': return features.character_distribution.numbers;
      case 'symbols': return features.character_distribution.symbols;
      case 'whitespace': return features.character_distribution.whitespace;
      case 'base64_score': return features.base64_score;
      case 'hex_score': return features.hex_score;
      case 'binary_score': return features.binary_score;
      case 'hash_score': return features.hash_score;
      case 'cipher_score': return features.cipher_score;
      case 'unique_chars': return features.unique_chars;
      case 'repeated_patterns': return features.repeated_patterns;
      case 'vowel_ratio': return features.vowel_ratio;
      case 'consonant_ratio': return features.consonant_ratio;
      case 'special_char_ratio': return features.special_char_ratio;
      default: return 0;
    }
  }
  
  // Train model with user feedback
  static trainModel(trainingData: Omit<TrainingData, 'id' | 'created_at'>): void {
    const model = this.getModel();
    const { input_text, actual_algorithm, is_correct, features } = trainingData;
    
    // Update algorithm weights
    if (!model.algorithm_weights[actual_algorithm]) {
      model.algorithm_weights[actual_algorithm] = {};
    }
    
    const learningRate = 0.01;
    const reward = is_correct ? 1 : -0.5;
    
    // Update weights for each feature
    const featureNames = [
      'length', 'entropy', 'letters', 'numbers', 'symbols', 'whitespace',
      'base64_score', 'hex_score', 'binary_score', 'hash_score', 'cipher_score',
      'unique_chars', 'repeated_patterns', 'vowel_ratio', 'consonant_ratio', 'special_char_ratio'
    ];
    
    for (const featureName of featureNames) {
      const featureValue = this.getFeatureValue(features, featureName);
      
      if (!model.algorithm_weights[actual_algorithm][featureName]) {
        model.algorithm_weights[actual_algorithm][featureName] = 0;
      }
      
      // Update weight using gradient descent
      model.algorithm_weights[actual_algorithm][featureName] += 
        learningRate * reward * featureValue;
    }
    
    // Update training statistics
    model.training_count++;
    model.last_updated = new Date();
    
    // Calculate accuracy (simplified)
    const storedTrainingData = this.getTrainingData();
    const correctPredictions = storedTrainingData.filter(d => d.is_correct).length;
    model.accuracy = correctPredictions / storedTrainingData.length;
    
    // Save updated model
    this.saveModel(model);
    
    // Store training data
    this.saveTrainingData({
      ...trainingData,
      id: crypto.randomUUID(),
      created_at: new Date()
    });
  }
  
  // Get stored training data
  static getTrainingData(): TrainingData[] {
    const stored = localStorage.getItem(this.TRAINING_DATA_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load training data:', error);
      }
    }
    return [];
  }
  
  // Save training data
  static saveTrainingData(data: TrainingData): void {
    const existing = this.getTrainingData();
    existing.push(data);
    
    // Keep only last 1000 training examples
    const limited = existing.slice(-1000);
    
    try {
      localStorage.setItem(this.TRAINING_DATA_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save training data:', error);
    }
  }
  
  // Get model statistics
  static getModelStats(): {
    training_count: number;
    accuracy: number;
    algorithms_learned: string[];
    last_updated: Date;
  } {
    const model = this.getModel();
    return {
      training_count: model.training_count,
      accuracy: model.accuracy,
      algorithms_learned: Object.keys(model.algorithm_weights),
      last_updated: model.last_updated
    };
  }
  
  // Reset model (for testing or fresh start)
  static resetModel(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TRAINING_DATA_KEY);
  }
}