import { AlgorithmPrediction } from '../types/crypto';
import { MLTrainingSystem } from './mlTrainingSystem';

export class EnhancedAlgorithmPrediction {
  static predictAlgorithm(text: string): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    // Use ML prediction first
    const mlPrediction = MLTrainingSystem.predictWithML(text);
    if (mlPrediction.confidence > 0.3) {
      predictions.push({
        algorithm: `${mlPrediction.algorithm} (ML)`,
        confidence: mlPrediction.confidence,
        reasoning: `Machine learning model prediction based on ${MLTrainingSystem.getModelStats().training_count} training examples`
      });
    }
    
    // Analyze text characteristics
    const analysis = this.analyzeText(text);
    
    // Base64 detection
    if (this.isBase64(text)) {
      predictions.push({
        algorithm: 'Base64',
        confidence: 0.95,
        reasoning: 'Perfect Base64 character set and padding pattern'
      });
    }
    
    // Hexadecimal detection
    if (this.isHexadecimal(text)) {
      predictions.push({
        algorithm: 'Hexadecimal',
        confidence: 0.9,
        reasoning: 'Contains only hexadecimal characters with even length'
      });
    }
    
    // Binary detection
    if (this.isBinary(text)) {
      predictions.push({
        algorithm: 'Binary',
        confidence: 0.95,
        reasoning: 'Contains only binary digits (0 and 1)'
      });
    }
    
    // URL encoding detection
    if (this.isUrlEncoded(text)) {
      predictions.push({
        algorithm: 'URL Encoding',
        confidence: 0.85,
        reasoning: 'Contains percent-encoded characters'
      });
    }
    
    // AES/DES detection (CryptoJS format)
    if (this.isSymmetricEncrypted(text)) {
      predictions.push({
        algorithm: 'AES/DES (CryptoJS)',
        confidence: 0.8,
        reasoning: 'Contains CryptoJS salt marker or matches encrypted format'
      });
    }
    
    // RSA detection
    if (this.isRSAEncrypted(text)) {
      predictions.push({
        algorithm: 'RSA',
        confidence: 0.85,
        reasoning: 'Matches RSA encrypted format pattern'
      });
    }
    
    // Classical cipher detection
    const classicalPredictions = this.predictClassicalCiphers(text, analysis);
    predictions.push(...classicalPredictions);
    
    // Hash detection
    const hashPredictions = this.predictHashAlgorithms(text);
    predictions.push(...hashPredictions);
    
    // Encoding detection
    const encodingPredictions = this.predictEncodingAlgorithms(text);
    predictions.push(...encodingPredictions);
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  }
  
  // Create training data for ML system
  static createTrainingData(
    inputText: string, 
    predictedAlgorithm: string, 
    actualAlgorithm: string, 
    confidence: number,
    userFeedback: 'correct' | 'incorrect'
  ): void {
    const features = MLTrainingSystem.extractFeatures(inputText);
    const isCorrect = userFeedback === 'correct';
    
    MLTrainingSystem.trainModel({
      input_text: inputText,
      predicted_algorithm: predictedAlgorithm,
      actual_algorithm: actualAlgorithm,
      confidence,
      features,
      is_correct: isCorrect,
      user_feedback: userFeedback
    });
  }
  
  // Get ML model statistics
  static getMLStats() {
    return MLTrainingSystem.getModelStats();
  }
  
  private static analyzeText(text: string) {
    return {
      length: text.length,
      uniqueChars: new Set(text).size,
      hasUppercase: /[A-Z]/.test(text),
      hasLowercase: /[a-z]/.test(text),
      hasNumbers: /[0-9]/.test(text),
      hasSpecialChars: /[^a-zA-Z0-9\s]/.test(text),
      hasWhitespace: /\s/.test(text),
      entropy: this.calculateEntropy(text),
      letterFrequency: this.analyzeLetterFrequency(text),
      characterDistribution: this.analyzeCharacterDistribution(text)
    };
  }
  
  private static isBase64(text: string): boolean {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(text) && text.length % 4 === 0 && text.length > 0;
  }
  
  private static isHexadecimal(text: string): boolean {
    const hexRegex = /^[0-9A-Fa-f]+$/;
    return hexRegex.test(text) && text.length % 2 === 0 && text.length > 0;
  }
  
  private static isBinary(text: string): boolean {
    const binaryRegex = /^[01\s]+$/;
    return binaryRegex.test(text) && text.replace(/\s/g, '').length % 8 === 0;
  }
  
  private static isUrlEncoded(text: string): boolean {
    return /%[0-9A-Fa-f]{2}/.test(text);
  }
  
  private static isSymmetricEncrypted(text: string): boolean {
    return text.includes('U2FsdGVkX1') || /^[A-Za-z0-9+/=]{40,}$/.test(text);
  }
  
  private static isRSAEncrypted(text: string): boolean {
    return text.startsWith('RSA_ENCRYPTED:') || 
           text.includes('-----BEGIN') || 
           (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text));
  }
  
  private static predictClassicalCiphers(text: string, analysis: any): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    // Caesar cipher detection
    if (/^[A-Za-z\s]+$/.test(text) && analysis.letterFrequency.variance > 0.02) {
      predictions.push({
        algorithm: 'Caesar Cipher',
        confidence: 0.6,
        reasoning: 'Text contains only letters with unusual frequency distribution'
      });
    }
    
    // Vigenère cipher detection
    if (/^[A-Za-z]+$/.test(text) && analysis.entropy > 3.5 && analysis.entropy < 4.5) {
      predictions.push({
        algorithm: 'Vigenère Cipher',
        confidence: 0.55,
        reasoning: 'Moderate entropy suggests polyalphabetic substitution'
      });
    }
    
    // XOR cipher detection
    if (text.includes('\x00') || /[\x01-\x1F]/.test(text)) {
      predictions.push({
        algorithm: 'XOR Cipher',
        confidence: 0.7,
        reasoning: 'Contains control characters typical of XOR operations'
      });
    }
    
    // ROT13 detection
    if (/^[A-Za-z\s]+$/.test(text)) {
      const rot13Test = text.replace(/[a-zA-Z]/g, (char) => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
      });
      
      if (this.isReadableText(rot13Test)) {
        predictions.push({
          algorithm: 'ROT13',
          confidence: 0.8,
          reasoning: 'ROT13 decryption produces readable text'
        });
      }
    }
    
    // Atbash detection
    if (/^[A-Za-z\s]+$/.test(text)) {
      predictions.push({
        algorithm: 'Atbash Cipher',
        confidence: 0.4,
        reasoning: 'Text pattern suggests possible Atbash substitution'
      });
    }
    
    return predictions;
  }
  
  private static predictHashAlgorithms(text: string): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    if (/^[a-f0-9]+$/i.test(text)) {
      switch (text.length) {
        case 32:
          predictions.push({
            algorithm: 'MD5',
            confidence: 0.9,
            reasoning: '32 hexadecimal characters match MD5 hash length'
          });
          break;
        case 40:
          predictions.push({
            algorithm: 'SHA-1',
            confidence: 0.9,
            reasoning: '40 hexadecimal characters match SHA-1 hash length'
          });
          break;
        case 56:
          predictions.push({
            algorithm: 'SHA-224',
            confidence: 0.9,
            reasoning: '56 hexadecimal characters match SHA-224 hash length'
          });
          break;
        case 64:
          predictions.push({
            algorithm: 'SHA-256',
            confidence: 0.9,
            reasoning: '64 hexadecimal characters match SHA-256 hash length'
          });
          break;
        case 96:
          predictions.push({
            algorithm: 'SHA-384',
            confidence: 0.9,
            reasoning: '96 hexadecimal characters match SHA-384 hash length'
          });
          break;
        case 128:
          predictions.push({
            algorithm: 'SHA-512',
            confidence: 0.9,
            reasoning: '128 hexadecimal characters match SHA-512 hash length'
          });
          break;
      }
    }
    
    // bcrypt detection
    if (/^\$2[aby]?\$\d{2}\$/.test(text)) {
      predictions.push({
        algorithm: 'bcrypt',
        confidence: 0.95,
        reasoning: 'Matches bcrypt hash format with salt and rounds'
      });
    }
    
    // PBKDF2 detection
    if (text.includes('pbkdf2') || /^[A-Za-z0-9+/=]{40,}$/.test(text)) {
      predictions.push({
        algorithm: 'PBKDF2',
        confidence: 0.6,
        reasoning: 'Format suggests PBKDF2 key derivation'
      });
    }
    
    return predictions;
  }
  
  private static predictEncodingAlgorithms(text: string): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    // Base32 detection
    if (/^[A-Z2-7]+=*$/i.test(text) && text.length % 8 === 0) {
      predictions.push({
        algorithm: 'Base32',
        confidence: 0.85,
        reasoning: 'Matches Base32 character set and padding'
      });
    }
    
    // Base58 detection
    if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(text)) {
      predictions.push({
        algorithm: 'Base58',
        confidence: 0.7,
        reasoning: 'Matches Base58 character set (no 0, O, I, l)'
      });
    }
    
    // ASCII detection
    if (/^\d+(\s+\d+)*$/.test(text)) {
      const numbers = text.split(/\s+/).map(n => parseInt(n));
      if (numbers.every(n => n >= 32 && n <= 126)) {
        predictions.push({
          algorithm: 'ASCII',
          confidence: 0.8,
          reasoning: 'Space-separated numbers in printable ASCII range'
        });
      }
    }
    
    // HTML entity detection
    if (/&[a-zA-Z]+;|&#\d+;/.test(text)) {
      predictions.push({
        algorithm: 'HTML Entities',
        confidence: 0.9,
        reasoning: 'Contains HTML entity references'
      });
    }
    
    return predictions;
  }
  
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
  
  private static analyzeCharacterDistribution(text: string) {
    const distribution = {
      letters: (text.match(/[a-zA-Z]/g) || []).length,
      numbers: (text.match(/[0-9]/g) || []).length,
      symbols: (text.match(/[^a-zA-Z0-9\s]/g) || []).length,
      whitespace: (text.match(/\s/g) || []).length
    };
    
    return distribution;
  }
  
  private static isReadableText(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return false;
    
    const commonWords = new Set([
      'the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that',
      'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at',
      'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but'
    ]);
    
    const commonWordCount = words.filter(word => commonWords.has(word)).length;
    return (commonWordCount / words.length) > 0.1;
  }
}

export function predictAlgorithmEnhanced(text: string): AlgorithmPrediction[] {
  return EnhancedAlgorithmPrediction.predictAlgorithm(text);
}