import { BruteForceResult } from '../types/crypto';
import { encryptModernSymmetric, decryptModernSymmetric } from './modernSymmetricCiphers';
import { encryptClassical, decryptClassical } from './classicalCiphers';
import { encryptAsymmetric, decryptAsymmetric } from './asymmetricCiphers';
import { encodeTextEnhanced, decodeTextEnhanced } from './enhancedEncodingAlgorithms';

export class EnhancedBruteForce {
  private static readonly COMMON_KEYS = [
    'password', 'secret', 'key', 'admin', 'test', 'user', 'default',
    '123456', 'qwerty', 'abc123', 'password123', 'admin123',
    'crypto', 'cipher', 'encrypt', 'decode', 'hidden', 'private',
    'secure', 'confidential', 'top-secret', 'classified',
    'letmein', 'welcome', 'guest', 'root', 'toor', 'pass',
    'mypassword', 'secret123', 'password1', 'admin1',
    'hello', 'world', 'test123', 'demo', 'sample'
  ];

  private static readonly SYMMETRIC_ALGORITHMS = [
    'aes', 'aes-128', 'aes-192', 'aes-256', 'aes-ecb', 'aes-cbc', 'aes-cfb', 'aes-ofb', 'aes-ctr', 'aes-gcm',
    'des', '3des', 'blowfish', 'twofish', 'idea', 'cast5', 'rc5', 'rc6', 'serpent', 'camellia',
    'rc4', 'chacha20', 'salsa20', 'seal', 'a51', 'a52', 'grain', 'mickey', 'vernam'
  ];

  private static readonly ASYMMETRIC_ALGORITHMS = [
    'rsa', 'elgamal', 'ecc', 'paillier', 'knapsack', 'kyber', 'dilithium', 'ntru'
  ];

  private static readonly CLASSICAL_ALGORITHMS = [
    'caesar', 'atbash', 'rot13', 'monoalphabetic', 'vigenere', 'beaufort', 'autokey',
    'playfair', 'hill', 'adfgx', 'bacon', 'railfence', 'columnar', 'scytale', 'route',
    'xor', 'affine'
  ];

  private static readonly ENCODING_ALGORITHMS = [
    'base64', 'base32', 'base58', 'base85', 'base91',
    'hex', 'binary', 'octal', 'url', 'html', 'ascii',
    'punycode', 'quoted-printable', 'uuencode'
  ];

  static async bruteForceByCategory(
    text: string, 
    category: 'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all',
    providedKey?: string
  ): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    switch (category) {
      case 'symmetric':
        results.push(...await this.bruteForceSymmetric(text, providedKey));
        break;
      case 'asymmetric':
        results.push(...await this.bruteForceAsymmetric(text, providedKey));
        break;
      case 'classical':
        results.push(...await this.bruteForceClassical(text, providedKey));
        break;
      case 'encoding':
        results.push(...await this.bruteForceEncoding(text));
        break;
      case 'all':
        results.push(...await this.bruteForceAll(text, providedKey));
        break;
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  private static async bruteForceSymmetric(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];
    const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;

    for (const algorithm of this.SYMMETRIC_ALGORITHMS) {
      for (const key of keysToTry) {
        try {
          const decryptResult = decryptModernSymmetric(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
            results.push({
              algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
      }
    }

    return results;
  }

  private static async bruteForceAsymmetric(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];
    const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;

    for (const algorithm of this.ASYMMETRIC_ALGORITHMS) {
      for (const key of keysToTry) {
        try {
          const decryptResult = decryptAsymmetric(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
            results.push({
              algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
      }
    }

    return results;
  }

  private static async bruteForceClassical(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    // Caesar cipher with all possible shifts
    for (let shift = 1; shift < 26; shift++) {
      try {
        const decryptResult = decryptClassical(text, 'caesar', shift.toString());
        if (decryptResult.success && decryptResult.result) {
          const confidence = this.calculateReadabilityScore(decryptResult.result);
          results.push({
            algorithm: `Caesar (shift ${shift})`,
            result: decryptResult.result,
            confidence,
            isReadable: confidence > 0.3
          });
        }
      } catch (error) {
        // Skip failed attempts
      }
    }

    // Other classical ciphers with keys
    const classicalWithKeys = ['vigenere', 'beaufort', 'autokey', 'playfair', 'hill', 'adfgx', 'columnar', 'scytale', 'route', 'xor', 'affine', 'monoalphabetic'];
    for (const algorithm of classicalWithKeys) {
      const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
      
      for (const key of keysToTry) {
        try {
          const decryptResult = decryptClassical(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
            results.push({
              algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
      }
    }

    // Keyless classical ciphers
    const keylessAlgorithms = ['rot13', 'atbash', 'bacon'];
    for (const algorithm of keylessAlgorithms) {
      try {
        const decryptResult = decryptClassical(text, algorithm);
        if (decryptResult.success && decryptResult.result) {
          const confidence = this.calculateReadabilityScore(decryptResult.result);
          results.push({
            algorithm: algorithm.toUpperCase(),
            result: decryptResult.result,
            confidence,
            isReadable: confidence > 0.3
          });
        }
      } catch (error) {
        // Skip failed attempts
      }
    }

    // Rail fence with different rail counts
    for (let rails = 2; rails <= 10; rails++) {
      try {
        const decryptResult = decryptClassical(text, 'railfence', rails.toString());
        if (decryptResult.success && decryptResult.result) {
          const confidence = this.calculateReadabilityScore(decryptResult.result);
          results.push({
            algorithm: `Rail Fence (${rails} rails)`,
            result: decryptResult.result,
            confidence,
            isReadable: confidence > 0.3
          });
        }
      } catch (error) {
        // Skip failed attempts
      }
    }

    // If provided key is given, try it with affine cipher variations
    if (providedKey) {
      const affinePairs = [
        '5,8', '7,3', '9,2', '11,15', '15,20', '17,9', '19,13', '21,8', '23,7', '25,12'
      ];
      
      for (const params of affinePairs) {
        try {
          const decryptResult = decryptClassical(text, 'affine', params);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            results.push({
              algorithm: `Affine (${params})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
      }
    }

    return results;
  }

  private static async bruteForceEncoding(text: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    for (const algorithm of this.ENCODING_ALGORITHMS) {
      try {
        const decodeResult = decodeTextEnhanced(text, algorithm);
        if (decodeResult.success && decodeResult.result) {
          const confidence = this.calculateReadabilityScore(decodeResult.result);
          results.push({
            algorithm: algorithm.toUpperCase(),
            result: decodeResult.result,
            confidence,
            isReadable: confidence > 0.5
          });
        }
      } catch (error) {
        // Skip failed attempts
      }
    }

    return results;
  }

  private static async bruteForceAll(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    // Try encoding first (fastest)
    results.push(...await this.bruteForceEncoding(text));

    // Then classical ciphers
    results.push(...await this.bruteForceClassical(text, providedKey));

    // Then asymmetric ciphers
    results.push(...await this.bruteForceAsymmetric(text, providedKey));

    // Finally symmetric ciphers (slowest)
    results.push(...await this.bruteForceSymmetric(text, providedKey));

    return results;
  }

  private static calculateReadabilityScore(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return 0;

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
      'may', 'say', 'come', 'could', 'now', 'than', 'my', 'well', 'people'
    ]);

    const commonWordCount = words.filter(word => commonWords.has(word)).length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const hasNormalChars = /^[a-zA-Z0-9\s.,!?;:'"()\-]+$/.test(text);
    const hasReasonableLength = words.every(word => word.length <= 20);
    const hasVowels = /[aeiouAEIOU]/.test(text);

    let score = 0;
    score += (commonWordCount / words.length) * 0.4; // Common words boost
    score += Math.max(0, (10 - avgWordLength) / 10) * 0.2; // Reasonable word length
    score += hasNormalChars ? 0.2 : 0; // Normal characters
    score += hasReasonableLength ? 0.1 : 0; // No extremely long words
    score += hasVowels ? 0.1 : 0; // Contains vowels

    return Math.min(1, score);
  }

  static async bruteForceWithProgress(
    text: string,
    category: 'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all',
    onProgress?: (progress: number) => void,
    providedKey?: string
  ): Promise<BruteForceResult[]> {
    const totalSteps = this.calculateTotalSteps(category, providedKey);
    let currentStep = 0;

    const updateProgress = () => {
      currentStep++;
      if (onProgress) {
        onProgress((currentStep / totalSteps) * 100);
      }
    };

    const results: BruteForceResult[] = [];

    if (category === 'encoding' || category === 'all') {
      for (const algorithm of this.ENCODING_ALGORITHMS) {
        try {
          const decodeResult = decodeTextEnhanced(text, algorithm);
          if (decodeResult.success && decodeResult.result) {
            const confidence = this.calculateReadabilityScore(decodeResult.result);
            results.push({
              algorithm: algorithm.toUpperCase(),
              result: decodeResult.result,
              confidence,
              isReadable: confidence > 0.5
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
        updateProgress();
      }
    }

    if (category === 'classical' || category === 'all') {
      // Caesar cipher attempts
      for (let shift = 1; shift < 26; shift++) {
        try {
          const decryptResult = decryptClassical(text, 'caesar', shift.toString());
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            results.push({
              algorithm: `Caesar (shift ${shift})`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
        updateProgress();
      }

      // Other classical algorithms
      const classicalWithKeys = ['vigenere', 'xor', 'affine', 'playfair', 'hill'];
      for (const algorithm of classicalWithKeys) {
        const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
        
        for (const key of keysToTry) {
          try {
            const decryptResult = decryptClassical(text, algorithm, key);
            if (decryptResult.success && decryptResult.result) {
              const confidence = this.calculateReadabilityScore(decryptResult.result);
              const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
              results.push({
                algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
                result: decryptResult.result,
                confidence,
                isReadable: confidence > 0.3
              });
            }
          } catch (error) {
            // Skip failed attempts
          }
          updateProgress();
        }
      }

      // Keyless algorithms
      const keylessAlgorithms = ['rot13', 'atbash'];
      for (const algorithm of keylessAlgorithms) {
        try {
          const decryptResult = decryptClassical(text, algorithm);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            results.push({
              algorithm: algorithm.toUpperCase(),
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
        updateProgress();
      }

      // Rail fence variations
      for (let rails = 2; rails <= 10; rails++) {
        try {
          const decryptResult = decryptClassical(text, 'railfence', rails.toString());
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateReadabilityScore(decryptResult.result);
            results.push({
              algorithm: `Rail Fence (${rails} rails)`,
              result: decryptResult.result,
              confidence,
              isReadable: confidence > 0.3
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
        updateProgress();
      }
    }

    if (category === 'asymmetric' || category === 'all') {
      for (const algorithm of this.ASYMMETRIC_ALGORITHMS) {
        const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
        
        for (const key of keysToTry) {
          try {
            const decryptResult = decryptAsymmetric(text, algorithm, key);
            if (decryptResult.success && decryptResult.result) {
              const confidence = this.calculateReadabilityScore(decryptResult.result);
              const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
              results.push({
                algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
                result: decryptResult.result,
                confidence,
                isReadable: confidence > 0.3
              });
            }
          } catch (error) {
            // Skip failed attempts
          }
          updateProgress();
        }
      }
    }

    if (category === 'symmetric' || category === 'all') {
      for (const algorithm of this.SYMMETRIC_ALGORITHMS) {
        const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
        
        for (const key of keysToTry) {
          try {
            const decryptResult = decryptModernSymmetric(text, algorithm, key);
            if (decryptResult.success && decryptResult.result) {
              const confidence = this.calculateReadabilityScore(decryptResult.result);
              const keyLabel = providedKey && key === providedKey ? 'provided key' : `common key: ${key}`;
              results.push({
                algorithm: `${algorithm.toUpperCase()} (${keyLabel})`,
                result: decryptResult.result,
                confidence,
                isReadable: confidence > 0.3
              });
            }
          } catch (error) {
            // Skip failed attempts
          }
          updateProgress();
        }
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  private static calculateTotalSteps(category: 'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all', providedKey?: string): number {
    let steps = 0;
    const keyMultiplier = providedKey ? this.COMMON_KEYS.length + 1 : this.COMMON_KEYS.length;

    if (category === 'encoding' || category === 'all') {
      steps += this.ENCODING_ALGORITHMS.length;
    }

    if (category === 'classical' || category === 'all') {
      steps += 25; // Caesar shifts
      steps += 5 * keyMultiplier; // Classical with keys
      steps += 2; // Keyless algorithms
      steps += 9; // Rail fence variations
    }

    if (category === 'asymmetric' || category === 'all') {
      steps += this.ASYMMETRIC_ALGORITHMS.length * keyMultiplier;
    }

    if (category === 'symmetric' || category === 'all') {
      steps += this.SYMMETRIC_ALGORITHMS.length * keyMultiplier;
    }

    return steps;
  }
}

export function bruteForceDecryptEnhanced(
  text: string,
  category: 'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all' = 'all',
  providedKey?: string
): Promise<BruteForceResult[]> {
  return EnhancedBruteForce.bruteForceByCategory(text, category, providedKey);
}

export function bruteForceWithProgress(
  text: string,
  category: 'symmetric' | 'asymmetric' | 'classical' | 'encoding' | 'all' = 'all',
  onProgress?: (progress: number) => void,
  providedKey?: string
): Promise<BruteForceResult[]> {
  return EnhancedBruteForce.bruteForceWithProgress(text, category, onProgress, providedKey);
}