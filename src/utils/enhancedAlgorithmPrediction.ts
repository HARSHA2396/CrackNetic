import { AlgorithmPrediction } from '../types/crypto';
import { MLTrainingSystem } from './mlTrainingSystem';

export class EnhancedAlgorithmPrediction {
  static predictAlgorithm(text: string): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    // Use ML prediction first if available
    try {
      const mlPrediction = MLTrainingSystem.predictWithML(text);
      if (mlPrediction.confidence > 0.2) {
        predictions.push({
          algorithm: `${mlPrediction.algorithm} (ML)`,
          confidence: mlPrediction.confidence,
          reasoning: `Machine learning model prediction based on ${MLTrainingSystem.getModelStats().training_count} training examples`
        });
      }
    } catch (error) {
      console.log('ML prediction not available, using rule-based');
    }
    
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
        reasoning: 'Contains only binary digits (0 and 1) with proper byte alignment'
      });
    }
    
    // URL encoding detection
    if (this.isUrlEncoded(text)) {
      predictions.push({
        algorithm: 'URL Encoding',
        confidence: 0.85,
        reasoning: 'Contains percent-encoded characters (%XX format)'
      });
    }
    
    // Hash function detection
    const hashPrediction = this.detectHashAlgorithm(text);
    if (hashPrediction) {
      predictions.push(hashPrediction);
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
        reasoning: 'Matches RSA encrypted format or PEM structure'
      });
    }
    
    // Classical cipher detection
    const classicalPredictions = this.predictClassicalCiphers(text);
    predictions.push(...classicalPredictions);
    
    // Base32 detection
    if (this.isBase32(text)) {
      predictions.push({
        algorithm: 'Base32',
        confidence: 0.85,
        reasoning: 'Matches Base32 character set (A-Z, 2-7) with proper padding'
      });
    }
    
    // Base58 detection
    if (this.isBase58(text)) {
      predictions.push({
        algorithm: 'Base58',
        confidence: 0.8,
        reasoning: 'Matches Base58 character set (excludes 0, O, I, l for clarity)'
      });
    }
    
    // ASCII detection
    if (this.isASCII(text)) {
      predictions.push({
        algorithm: 'ASCII',
        confidence: 0.8,
        reasoning: 'Space-separated numbers in printable ASCII range (32-126)'
      });
    }
    
    // HTML entity detection
    if (this.isHTMLEncoded(text)) {
      predictions.push({
        algorithm: 'HTML Entities',
        confidence: 0.9,
        reasoning: 'Contains HTML entity references (&amp;, &lt;, etc.)'
      });
    }
    
    // If no strong predictions, add generic ones
    if (predictions.length === 0 || predictions.every(p => p.confidence < 0.5)) {
      predictions.push({
        algorithm: 'Unknown/Custom Cipher',
        confidence: 0.3,
        reasoning: 'Text pattern does not match known algorithm signatures'
      });
    }
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
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
    const cleanText = text.replace(/\s/g, '');
    return binaryRegex.test(text) && cleanText.length % 8 === 0 && cleanText.length > 0;
  }
  
  private static isUrlEncoded(text: string): boolean {
    return /%[0-9A-Fa-f]{2}/.test(text);
  }
  
  private static isBase32(text: string): boolean {
    const base32Regex = /^[A-Z2-7]+=*$/;
    return base32Regex.test(text) && text.length % 8 === 0;
  }
  
  private static isBase58(text: string): boolean {
    const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    return base58Regex.test(text) && text.length > 0;
  }
  
  private static isASCII(text: string): boolean {
    if (!/^\d+(\s+\d+)*$/.test(text)) return false;
    const numbers = text.split(/\s+/).map(n => parseInt(n));
    return numbers.every(n => n >= 32 && n <= 126) && numbers.length > 1;
  }
  
  private static isHTMLEncoded(text: string): boolean {
    return /&[a-zA-Z]+;|&#\d+;/.test(text);
  }
  
  private static isSymmetricEncrypted(text: string): boolean {
    return text.includes('U2FsdGVkX1') || /^[A-Za-z0-9+/=]{40,}$/.test(text);
  }
  
  private static isRSAEncrypted(text: string): boolean {
    return text.startsWith('RSA_ENCRYPTED:') || 
           text.includes('-----BEGIN') || 
           (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text));
  }
  
  private static detectHashAlgorithm(text: string): AlgorithmPrediction | null {
    if (!/^[a-f0-9]+$/i.test(text)) return null;
    
    const hashLengths: { [key: number]: { algorithm: string; confidence: number } } = {
      32: { algorithm: 'MD5', confidence: 0.9 },
      40: { algorithm: 'SHA-1', confidence: 0.9 },
      56: { algorithm: 'SHA-224', confidence: 0.9 },
      64: { algorithm: 'SHA-256', confidence: 0.9 },
      96: { algorithm: 'SHA-384', confidence: 0.9 },
      128: { algorithm: 'SHA-512', confidence: 0.9 }
    };
    
    const match = hashLengths[text.length];
    if (match) {
      return {
        algorithm: match.algorithm,
        confidence: match.confidence,
        reasoning: `${text.length} hexadecimal characters match ${match.algorithm} hash length`
      };
    }
    
    return null;
  }
  
  private static predictClassicalCiphers(text: string): AlgorithmPrediction[] {
    const predictions: AlgorithmPrediction[] = [];
    
    // Caesar cipher detection
    if (/^[A-Za-z\s]+$/.test(text)) {
      const analysis = this.analyzeLetterFrequency(text);
      if (analysis.variance > 0.02) {
        predictions.push({
          algorithm: 'Caesar Cipher',
          confidence: 0.6,
          reasoning: 'Text contains only letters with unusual frequency distribution suggesting substitution'
        });
      }
    }
    
    // Vigenère cipher detection
    if (/^[A-Za-z]+$/.test(text)) {
      const entropy = this.calculateEntropy(text);
      if (entropy > 3.5 && entropy < 4.5) {
        predictions.push({
          algorithm: 'Vigenère Cipher',
          confidence: 0.55,
          reasoning: 'Moderate entropy suggests polyalphabetic substitution cipher'
        });
      }
    }
    
    // XOR cipher detection
    if (/[\x00-\x1F\x7F-\xFF]/.test(text)) {
      predictions.push({
        algorithm: 'XOR Cipher',
        confidence: 0.7,
        reasoning: 'Contains control characters or high-bit characters typical of XOR operations'
      });
    }
    
    // ROT13 detection (test if ROT13 produces readable text)
    if (/^[A-Za-z\s]+$/.test(text)) {
      const rot13Result = text.replace(/[a-zA-Z]/g, (char) => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
      });
      
      if (this.isReadableText(rot13Result)) {
        predictions.push({
          algorithm: 'ROT13',
          confidence: 0.8,
          reasoning: 'ROT13 transformation produces readable English text'
        });
      }
    }
    
    // Atbash detection
    if (/^[A-Za-z\s]+$/.test(text)) {
      const atbashResult = text.replace(/[a-zA-Z]/g, (char) => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        } else {
          return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
        }
      });
      
      if (this.isReadableText(atbashResult)) {
        predictions.push({
          algorithm: 'Atbash Cipher',
          confidence: 0.7,
          reasoning: 'Atbash transformation produces readable text'
        });
      }
    }
    
    // Rail Fence detection (look for patterns)
    if (/^[A-Za-z]+$/.test(text) && text.length > 10) {
      predictions.push({
        algorithm: 'Rail Fence Cipher',
        confidence: 0.4,
        reasoning: 'Text pattern suggests possible transposition cipher'
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
  
  private static isReadableText(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return false;
    
    const commonWords = new Set([
      'the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that',
      'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at',
      'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but',
      'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
      'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will',
      'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so',
      'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two',
      'more', 'very', 'what', 'know', 'just', 'first', 'get', 'over', 'think',
      'also', 'its', 'our', 'work', 'life', 'only', 'new', 'years', 'way',
      'may', 'say', 'come', 'could', 'now', 'than', 'my', 'well', 'people',
      'hello', 'world', 'test', 'message', 'secret', 'password', 'admin',
      'user', 'data', 'information', 'text', 'content', 'example', 'sample'
    ]);
    
    const commonWordCount = words.filter(word => commonWords.has(word)).length;
    return (commonWordCount / words.length) > 0.1;
  }
  
  // Create training data for ML system
  static createTrainingData(
    inputText: string, 
    predictedAlgorithm: string, 
    actualAlgorithm: string, 
    confidence: number,
    userFeedback: 'correct' | 'incorrect'
  ): void {
    try {
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
    } catch (error) {
      console.error('Failed to create training data:', error);
    }
  }
  
  // Get ML model statistics
  static getMLStats() {
    try {
      return MLTrainingSystem.getModelStats();
    } catch (error) {
      return {
        training_count: 0,
        accuracy: 0,
        algorithms_learned: [],
        last_updated: new Date()
      };
    }
  }
}

export function predictAlgorithmEnhanced(text: string): AlgorithmPrediction[] {
  return EnhancedAlgorithmPrediction.predictAlgorithm(text);
}