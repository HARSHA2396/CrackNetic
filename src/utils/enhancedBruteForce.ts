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
      case 'encoding':
        results.push(...await this.bruteForceEncoding(text));
        break;
      case 'classical':
        results.push(...await this.bruteForceClassical(text, providedKey));
        break;
      case 'symmetric':
        results.push(...await this.bruteForceSymmetric(text, providedKey));
        break;
      case 'asymmetric':
        results.push(...await this.bruteForceAsymmetric(text, providedKey));
        break;
      case 'all':
        results.push(...await this.bruteForceAll(text, providedKey));
        break;
    }

    return this.rankResultsByReadability(results);
  }

  private static async bruteForceEncoding(text: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    for (const algorithm of this.ENCODING_ALGORITHMS) {
      try {
        const decodeResult = decodeTextEnhanced(text, algorithm);
        if (decodeResult.success && decodeResult.result) {
          const confidence = this.calculateAdvancedReadabilityScore(decodeResult.result);
          results.push({
            algorithm: algorithm.toUpperCase(),
            result: decodeResult.result,
            confidence,
            isReadable: confidence > 0.4
          });
        }
      } catch (error) {
        // Skip failed attempts
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
          const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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

    // ROT13 (special case of Caesar)
    try {
      const decryptResult = decryptClassical(text, 'rot13');
      if (decryptResult.success && decryptResult.result) {
        const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
        results.push({
          algorithm: 'ROT13',
          result: decryptResult.result,
          confidence,
          isReadable: confidence > 0.3
        });
      }
    } catch (error) {
      // Skip failed attempts
    }

    // Atbash
    try {
      const decryptResult = decryptClassical(text, 'atbash');
      if (decryptResult.success && decryptResult.result) {
        const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
        results.push({
          algorithm: 'Atbash',
          result: decryptResult.result,
          confidence,
          isReadable: confidence > 0.3
        });
      }
    } catch (error) {
      // Skip failed attempts
    }

    // Rail fence with different rail counts
    for (let rails = 2; rails <= 10; rails++) {
      try {
        const decryptResult = decryptClassical(text, 'railfence', rails.toString());
        if (decryptResult.success && decryptResult.result) {
          const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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

    // Other classical ciphers with keys
    const classicalWithKeys = ['vigenere', 'beaufort', 'autokey', 'playfair', 'hill', 'adfgx', 'columnar', 'scytale', 'route', 'xor', 'affine', 'monoalphabetic'];
    for (const algorithm of classicalWithKeys) {
      const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
      
      for (const key of keysToTry) {
        try {
          const decryptResult = decryptClassical(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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

  private static async bruteForceSymmetric(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];
    const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;

    for (const algorithm of this.SYMMETRIC_ALGORITHMS) {
      for (const key of keysToTry) {
        try {
          const decryptResult = decryptModernSymmetric(text, algorithm, key);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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

  private static async bruteForceAll(text: string, providedKey?: string): Promise<BruteForceResult[]> {
    const results: BruteForceResult[] = [];

    // Try encoding first (fastest and most likely)
    results.push(...await this.bruteForceEncoding(text));

    // Then classical ciphers
    results.push(...await this.bruteForceClassical(text, providedKey));

    // Then symmetric ciphers
    results.push(...await this.bruteForceSymmetric(text, providedKey));

    // Finally asymmetric ciphers
    results.push(...await this.bruteForceAsymmetric(text, providedKey));

    return results;
  }

  private static calculateAdvancedReadabilityScore(text: string): number {
    if (!text || text.length === 0) return 0;

    // Clean text for analysis
    const cleanText = text.toLowerCase().trim();
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return 0;

    // Extended common English words list
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
      'user', 'data', 'information', 'text', 'content', 'example', 'sample',
      'name', 'time', 'person', 'year', 'government', 'day', 'man', 'world',
      'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work',
      'week', 'case', 'point', 'company', 'right', 'group', 'problem',
      'fact', 'money', 'lot', 'story', 'month', 'book', 'job', 'word',
      'business', 'issue', 'side', 'kind', 'head', 'house', 'service',
      'friend', 'father', 'power', 'hour', 'game', 'line', 'end', 'member',
      'law', 'car', 'city', 'community', 'name', 'president', 'team',
      'minute', 'idea', 'kid', 'body', 'back', 'parent', 'face', 'others',
      'level', 'office', 'door', 'health', 'person', 'art', 'war', 'history'
    ]);

    // Calculate various readability factors
    let score = 0;

    // 1. Common words ratio (40% weight)
    const commonWordCount = words.filter(word => commonWords.has(word)).length;
    const commonWordRatio = commonWordCount / words.length;
    score += commonWordRatio * 0.4;

    // 2. Average word length (20% weight) - English averages 4-5 characters
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const wordLengthScore = Math.max(0, 1 - Math.abs(avgWordLength - 4.5) / 10);
    score += wordLengthScore * 0.2;

    // 3. Character type distribution (15% weight)
    const hasNormalChars = /^[a-zA-Z0-9\s.,!?;:'"()\-]+$/.test(text);
    if (hasNormalChars) score += 0.15;

    // 4. Vowel presence and ratio (10% weight)
    const vowels = (cleanText.match(/[aeiou]/g) || []).length;
    const consonants = (cleanText.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;
    const vowelRatio = vowels / (vowels + consonants || 1);
    if (vowelRatio >= 0.2 && vowelRatio <= 0.5) score += 0.1; // Normal English vowel ratio

    // 5. Word length distribution (10% weight)
    const hasReasonableLength = words.every(word => word.length <= 20);
    if (hasReasonableLength) score += 0.1;

    // 6. Sentence structure indicators (5% weight)
    const hasSentenceStructure = /[.!?]/.test(text) || text.includes(' ');
    if (hasSentenceStructure) score += 0.05;

    // Bonus scoring for specific patterns
    // Names detection (like "harsha" vs "jnrnv")
    const hasProperNames = words.some(word => 
      word.length >= 3 && 
      /^[a-z]+$/.test(word) && 
      this.looksLikeName(word)
    );
    if (hasProperNames) score += 0.1;

    // Penalty for gibberish patterns
    const gibberishPenalty = this.calculateGibberishPenalty(words);
    score -= gibberishPenalty;

    return Math.min(1, Math.max(0, score));
  }

  private static looksLikeName(word: string): boolean {
    // Check if word has typical name characteristics
    const vowelCount = (word.match(/[aeiou]/g) || []).length;
    const consonantCount = word.length - vowelCount;
    
    // Names typically have good vowel/consonant balance
    const vowelRatio = vowelCount / word.length;
    
    // Check for common name patterns
    const commonNamePatterns = [
      /^[aeiou][a-z]*[aeiou]$/, // starts and ends with vowel
      /^[bcdfghjklmnpqrstvwxyz][aeiou][a-z]*$/, // consonant-vowel start
      /[aeiou][bcdfghjklmnpqrstvwxyz][aeiou]/, // vowel-consonant-vowel pattern
    ];
    
    const hasNamePattern = commonNamePatterns.some(pattern => pattern.test(word));
    
    return vowelRatio >= 0.2 && vowelRatio <= 0.6 && hasNamePattern;
  }

  private static calculateGibberishPenalty(words: string[]): number {
    let penalty = 0;
    
    for (const word of words) {
      // Penalty for words with no vowels
      if (word.length > 2 && !/[aeiou]/.test(word)) {
        penalty += 0.1;
      }
      
      // Penalty for repeated characters (like "jjjj")
      if (/(.)\1{2,}/.test(word)) {
        penalty += 0.15;
      }
      
      // Penalty for alternating consonants without vowels
      if (word.length > 3 && /^[bcdfghjklmnpqrstvwxyz]{3,}$/.test(word)) {
        penalty += 0.1;
      }
      
      // Penalty for very short "words" that are likely noise
      if (word.length === 1 && !/[aeiou]/.test(word)) {
        penalty += 0.05;
      }
    }
    
    return Math.min(0.5, penalty); // Cap penalty at 50%
  }

  private static rankResultsByReadability(results: BruteForceResult[]): BruteForceResult[] {
    return results.sort((a, b) => {
      // First sort by confidence score
      if (Math.abs(a.confidence - b.confidence) > 0.1) {
        return b.confidence - a.confidence;
      }
      
      // Then by readability
      if (a.isReadable !== b.isReadable) {
        return a.isReadable ? -1 : 1;
      }
      
      // Finally by result quality (prefer results with proper names, sentences)
      const aQuality = this.calculateResultQuality(a.result);
      const bQuality = this.calculateResultQuality(b.result);
      
      return bQuality - aQuality;
    });
  }

  private static calculateResultQuality(text: string): number {
    let quality = 0;
    
    // Check for proper capitalization
    if (/^[A-Z]/.test(text)) quality += 0.1;
    
    // Check for sentence endings
    if (/[.!?]$/.test(text.trim())) quality += 0.1;
    
    // Check for proper names (capitalized words)
    const capitalizedWords = (text.match(/\b[A-Z][a-z]+/g) || []).length;
    quality += Math.min(0.2, capitalizedWords * 0.05);
    
    // Check for common sentence structures
    if (/\b(is|are|was|were|have|has|will|would|can|could)\b/i.test(text)) {
      quality += 0.1;
    }
    
    return quality;
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
            const confidence = this.calculateAdvancedReadabilityScore(decodeResult.result);
            results.push({
              algorithm: algorithm.toUpperCase(),
              result: decodeResult.result,
              confidence,
              isReadable: confidence > 0.4
            });
          }
        } catch (error) {
          // Skip failed attempts
        }
        updateProgress();
        
        // Yield control to prevent blocking
        if (currentStep % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
    }

    if (category === 'classical' || category === 'all') {
      // Caesar cipher attempts
      for (let shift = 1; shift < 26; shift++) {
        try {
          const decryptResult = decryptClassical(text, 'caesar', shift.toString());
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
              const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
          
          // Yield control periodically
          if (currentStep % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
          }
        }
      }

      // Keyless algorithms
      const keylessAlgorithms = ['rot13', 'atbash'];
      for (const algorithm of keylessAlgorithms) {
        try {
          const decryptResult = decryptClassical(text, algorithm);
          if (decryptResult.success && decryptResult.result) {
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
            const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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

    if (category === 'symmetric' || category === 'all') {
      for (const algorithm of this.SYMMETRIC_ALGORITHMS) {
        const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
        
        for (const key of keysToTry) {
          try {
            const decryptResult = decryptModernSymmetric(text, algorithm, key);
            if (decryptResult.success && decryptResult.result) {
              const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
          
          // Yield control periodically
          if (currentStep % 15 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
          }
        }
      }
    }

    if (category === 'asymmetric' || category === 'all') {
      for (const algorithm of this.ASYMMETRIC_ALGORITHMS) {
        const keysToTry = providedKey ? [providedKey, ...this.COMMON_KEYS] : this.COMMON_KEYS;
        
        for (const key of keysToTry) {
          try {
            const decryptResult = decryptAsymmetric(text, algorithm, key);
            if (decryptResult.success && decryptResult.result) {
              const confidence = this.calculateAdvancedReadabilityScore(decryptResult.result);
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
          
          // Yield control periodically
          if (currentStep % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
          }
        }
      }
    }

    return this.rankResultsByReadability(results);
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

    if (category === 'symmetric' || category === 'all') {
      steps += this.SYMMETRIC_ALGORITHMS.length * keyMultiplier;
    }

    if (category === 'asymmetric' || category === 'all') {
      steps += this.ASYMMETRIC_ALGORITHMS.length * keyMultiplier;
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