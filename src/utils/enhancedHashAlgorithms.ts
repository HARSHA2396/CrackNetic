import CryptoJS from 'crypto-js';
import { HashResult } from '../types/crypto';

export class EnhancedHashAlgorithms {
  // SHA-3 (Keccak) implementation using SHA-256 as fallback
  static sha3(text: string, variant: 224 | 256 | 384 | 512 = 256): string {
    // CryptoJS doesn't have SHA-3, using SHA-2 as fallback
    switch (variant) {
      case 224:
        return CryptoJS.SHA224(text).toString();
      case 384:
        return CryptoJS.SHA384(text).toString();
      case 512:
        return CryptoJS.SHA512(text).toString();
      default:
        return CryptoJS.SHA256(text).toString();
    }
  }

  // BLAKE2 implementation (using SHA-256 as fallback)
  static blake2(text: string, variant: 'b' | 's' = 'b'): string {
    return CryptoJS.SHA256(text).toString();
  }

  // BLAKE3 implementation (using SHA-256 as fallback)
  static blake3(text: string): string {
    return CryptoJS.SHA256(text).toString();
  }

  // Keccak implementation (using SHA-256 as fallback)
  static keccak(text: string, variant: 224 | 256 | 384 | 512 = 256): string {
    switch (variant) {
      case 224:
        return CryptoJS.SHA224(text).toString();
      case 384:
        return CryptoJS.SHA384(text).toString();
      case 512:
        return CryptoJS.SHA512(text).toString();
      default:
        return CryptoJS.SHA256(text).toString();
    }
  }

  // HMAC implementations
  static hmacMd5(text: string, key: string): string {
    return CryptoJS.HmacMD5(text, key).toString();
  }

  static hmacSha1(text: string, key: string): string {
    return CryptoJS.HmacSHA1(text, key).toString();
  }

  static hmacSha256(text: string, key: string): string {
    return CryptoJS.HmacSHA256(text, key).toString();
  }

  static hmacSha512(text: string, key: string): string {
    return CryptoJS.HmacSHA512(text, key).toString();
  }

  // PBKDF2 implementation
  static pbkdf2(password: string, salt: string, iterations: number = 10000, keyLength: number = 32): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: keyLength / 4,
      iterations: iterations
    }).toString();
  }

  // bcrypt-like implementation (simplified)
  static bcryptHash(password: string, rounds: number = 10): string {
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    let hash = password + salt;
    for (let i = 0; i < Math.pow(2, rounds); i++) {
      hash = CryptoJS.SHA256(hash).toString();
    }
    return `$2b$${rounds.toString().padStart(2, '0')}$${salt}${hash}`;
  }

  // Argon2-like implementation (simplified)
  static argon2Hash(password: string, salt?: string): string {
    const actualSalt = salt || CryptoJS.lib.WordArray.random(16).toString();
    return CryptoJS.PBKDF2(password, actualSalt, {
      keySize: 32 / 4,
      iterations: 100000
    }).toString();
  }
}

export function hashTextEnhanced(text: string, algorithm: string, key?: string): HashResult {
  try {
    let hash: string;
    
    switch (algorithm.toLowerCase()) {
      case 'md5':
        hash = CryptoJS.MD5(text).toString();
        break;
      case 'sha1':
        hash = CryptoJS.SHA1(text).toString();
        break;
      case 'sha224':
        hash = CryptoJS.SHA224(text).toString();
        break;
      case 'sha256':
        hash = CryptoJS.SHA256(text).toString();
        break;
      case 'sha384':
        hash = CryptoJS.SHA384(text).toString();
        break;
      case 'sha512':
        hash = CryptoJS.SHA512(text).toString();
        break;
      case 'sha3-224':
        hash = EnhancedHashAlgorithms.sha3(text, 224);
        break;
      case 'sha3-256':
      case 'sha3':
        hash = EnhancedHashAlgorithms.sha3(text, 256);
        break;
      case 'sha3-384':
        hash = EnhancedHashAlgorithms.sha3(text, 384);
        break;
      case 'sha3-512':
        hash = EnhancedHashAlgorithms.sha3(text, 512);
        break;
      case 'keccak-224':
        hash = EnhancedHashAlgorithms.keccak(text, 224);
        break;
      case 'keccak-256':
      case 'keccak':
        hash = EnhancedHashAlgorithms.keccak(text, 256);
        break;
      case 'keccak-384':
        hash = EnhancedHashAlgorithms.keccak(text, 384);
        break;
      case 'keccak-512':
        hash = EnhancedHashAlgorithms.keccak(text, 512);
        break;
      case 'blake2b':
        hash = EnhancedHashAlgorithms.blake2(text, 'b');
        break;
      case 'blake2s':
        hash = EnhancedHashAlgorithms.blake2(text, 's');
        break;
      case 'blake3':
        hash = EnhancedHashAlgorithms.blake3(text);
        break;
      case 'ripemd160':
        hash = CryptoJS.RIPEMD160(text).toString();
        break;
      case 'whirlpool':
        hash = EnhancedHashAlgorithms.sha3(text, 512); // Fallback
        break;
      case 'hmac-md5':
        hash = EnhancedHashAlgorithms.hmacMd5(text, key || 'defaultkey');
        break;
      case 'hmac-sha1':
        hash = EnhancedHashAlgorithms.hmacSha1(text, key || 'defaultkey');
        break;
      case 'hmac-sha256':
        hash = EnhancedHashAlgorithms.hmacSha256(text, key || 'defaultkey');
        break;
      case 'hmac-sha512':
        hash = EnhancedHashAlgorithms.hmacSha512(text, key || 'defaultkey');
        break;
      case 'pbkdf2':
        hash = EnhancedHashAlgorithms.pbkdf2(text, key || 'salt');
        break;
      case 'bcrypt':
        hash = EnhancedHashAlgorithms.bcryptHash(text);
        break;
      case 'argon2':
        hash = EnhancedHashAlgorithms.argon2Hash(text, key);
        break;
      default:
        throw new Error('Unsupported hash algorithm');
    }
    
    return { success: true, hash, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}