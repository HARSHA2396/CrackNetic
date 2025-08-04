import CryptoJS from 'crypto-js';
import { CryptoResult, BruteForceResult, AlgorithmPrediction } from '../types/crypto';

// Basic Cipher Implementations
export class CryptoAlgorithms {
  static caesarCipher(text: string, shift: number, encrypt = true): string {
    const direction = encrypt ? shift : -shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + direction + 26) % 26) + start);
    });
  }

  static vigenereCipher(text: string, key: string, encrypt = true): string {
    const keyRepeated = key.repeat(Math.ceil(text.length / key.length));
    return text.replace(/[a-zA-Z]/g, (char, index) => {
      const start = char <= 'Z' ? 65 : 97;
      const shift = keyRepeated.charCodeAt(index) - 65;
      const direction = encrypt ? shift : -shift;
      return String.fromCharCode(((char.charCodeAt(0) - start + direction + 26) % 26) + start);
    });
  }

  static xorCipher(text: string, key: string): string {
    const keyRepeated = key.repeat(Math.ceil(text.length / key.length));
    return text.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ keyRepeated.charCodeAt(index))
    ).join('');
  }

  static base64Encode(text: string): string {
    return btoa(text);
  }

  static base64Decode(text: string): string {
    try {
      return atob(text);
    } catch {
      throw new Error('Invalid Base64 string');
    }
  }

  static aesEncrypt(text: string, password: string): string {
    return CryptoJS.AES.encrypt(text, password).toString();
  }

  static aesDecrypt(ciphertext: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid password or corrupted data');
    return originalText;
  }

  static desEncrypt(text: string, password: string): string {
    return CryptoJS.DES.encrypt(text, password).toString();
  }

  static desDecrypt(ciphertext: string, password: string): string {
    const bytes = CryptoJS.DES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid password or corrupted data');
    return originalText;
  }

  static tripleDesEncrypt(text: string, password: string): string {
    return CryptoJS.TripleDES.encrypt(text, password).toString();
  }

  static tripleDesDecrypt(ciphertext: string, password: string): string {
    const bytes = CryptoJS.TripleDES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid password or corrupted data');
    return originalText;
  }
}

export function encryptText(text: string, algorithm: string, key?: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm) {
      case 'caesar':
        result = CryptoAlgorithms.caesarCipher(text, 13, true);
        break;
      case 'vigenere':
        result = CryptoAlgorithms.vigenereCipher(text, key || 'KEY', true);
        break;
      case 'xor':
        result = CryptoAlgorithms.xorCipher(text, key || 'SECRET');
        break;
      case 'base64':
        result = CryptoAlgorithms.base64Encode(text);
        break;
      case 'aes':
        result = CryptoAlgorithms.aesEncrypt(text, key || 'defaultpassword');
        break;
      case 'des':
        result = CryptoAlgorithms.desEncrypt(text, key || 'defaultpassword');
        break;
      case '3des':
        result = CryptoAlgorithms.tripleDesEncrypt(text, key || 'defaultpassword');
        break;
      default:
        throw new Error('Unsupported algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

export function decryptText(text: string, algorithm: string, key?: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm) {
      case 'caesar':
        result = CryptoAlgorithms.caesarCipher(text, 13, false);
        break;
      case 'vigenere':
        result = CryptoAlgorithms.vigenereCipher(text, key || 'KEY', false);
        break;
      case 'xor':
        result = CryptoAlgorithms.xorCipher(text, key || 'SECRET');
        break;
      case 'base64':
        result = CryptoAlgorithms.base64Decode(text);
        break;
      case 'aes':
        result = CryptoAlgorithms.aesDecrypt(text, key || 'defaultpassword');
        break;
      case 'des':
        result = CryptoAlgorithms.desDecrypt(text, key || 'defaultpassword');
        break;
      case '3des':
        result = CryptoAlgorithms.tripleDesDecrypt(text, key || 'defaultpassword');
        break;
      default:
        throw new Error('Unsupported algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

export function bruteForceDecrypt(text: string): BruteForceResult[] {
  const algorithms = ['caesar', 'base64', 'vigenere', 'xor'];
  const commonKeys = ['key', 'password', 'secret', 'test', 'admin'];
  const results: BruteForceResult[] = [];

  algorithms.forEach(algorithm => {
    if (algorithm === 'caesar') {
      // Try all possible Caesar shifts
      for (let shift = 1; shift < 26; shift++) {
        try {
          const result = CryptoAlgorithms.caesarCipher(text, shift, false);
          const confidence = calculateReadabilityScore(result);
          results.push({
            algorithm: `Caesar (shift ${shift})`,
            result,
            confidence,
            isReadable: confidence > 0.3
          });
        } catch (error) {
          // Skip failed attempts
        }
      }
    } else if (algorithm === 'base64') {
      try {
        const result = CryptoAlgorithms.base64Decode(text);
        const confidence = calculateReadabilityScore(result);
        results.push({
          algorithm: 'Base64',
          result,
          confidence,
          isReadable: confidence > 0.5
        });
      } catch (error) {
        // Skip failed attempts
      }
    } else {
      // Try with common keys
      commonKeys.forEach(key => {
        try {
          const decryptResult = decryptText(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = calculateReadabilityScore(decryptResult.result);
            results.push({
              algorithm: `${algorithm.toUpperCase()} (key: ${key})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
      });
    }
  });

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function predictAlgorithm(text: string): AlgorithmPrediction[] {
  const predictions: AlgorithmPrediction[] = [];

  // Base64 detection
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(text) && text.length % 4 === 0) {
    predictions.push({
      algorithm: 'Base64',
      confidence: 0.9,
      reasoning: 'Matches Base64 character set and padding pattern'
    });
  }

  // AES/DES detection (CryptoJS format)
  if (text.includes('U2FsdGVkX1') || /^[A-Za-z0-9+/=]{40,}$/.test(text)) {
    predictions.push({
      algorithm: 'AES/DES',
      confidence: 0.8,
      reasoning: 'Contains CryptoJS salt marker or matches encrypted format'
    });
  }

  // Caesar cipher detection
  if (/^[A-Za-z\s]+$/.test(text)) {
    const letterFreq = analyzeLetterFrequency(text);
    if (letterFreq.variance > 0.02) {
      predictions.push({
        algorithm: 'Caesar Cipher',
        confidence: 0.6,
        reasoning: 'Text contains only letters with unusual frequency distribution'
      });
    }
  }

  // Hexadecimal detection
  if (/^[0-9A-Fa-f]+$/.test(text) && text.length % 2 === 0) {
    predictions.push({
      algorithm: 'Hexadecimal',
      confidence: 0.7,
      reasoning: 'Contains only hexadecimal characters with even length'
    });
  }

  // XOR detection
  if (text.includes('\x00') || /[\x01-\x1F]/.test(text)) {
    predictions.push({
      algorithm: 'XOR Cipher',
      confidence: 0.5,
      reasoning: 'Contains control characters typical of XOR operations'
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}

function calculateReadabilityScore(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return 0;

  const commonWords = new Set([
    'the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that',
    'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at'
  ]);

  const commonWordCount = words.filter(word => commonWords.has(word)).length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const hasNormalChars = /^[a-zA-Z0-9\s.,!?;:'"()-]+$/.test(text);

  let score = 0;
  score += (commonWordCount / words.length) * 0.4; // Common words boost
  score += Math.max(0, (8 - avgWordLength) / 8) * 0.3; // Reasonable word length
  score += hasNormalChars ? 0.3 : 0; // Normal characters

  return Math.min(1, score);
}

function analyzeLetterFrequency(text: string): { variance: number } {
  const frequencies = new Array(26).fill(0);
  const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
  
  for (const char of cleanText) {
    frequencies[char.charCodeAt(0) - 97]++;
  }
  
  const total = cleanText.length;
  if (total === 0) return { variance: 0 };
  
  const normalizedFreqs = frequencies.map(freq => freq / total);
  const average = 1 / 26; // Expected frequency for uniform distribution
  const variance = normalizedFreqs.reduce((sum, freq) => sum + Math.pow(freq - average, 2), 0) / 26;
  
  return { variance };
}