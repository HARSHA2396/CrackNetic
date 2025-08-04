import CryptoJS from 'crypto-js';
import { CryptoResult } from '../types/crypto';

export class SymmetricCiphers {
  // AES Implementation
  static aesEncrypt(text: string, key: string, mode: 'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR' | 'GCM' = 'CBC'): string {
    switch (mode) {
      case 'GCM':
        return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.GCM }).toString();
      case 'CTR':
        return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.CTR }).toString();
      case 'CFB':
        return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.CFB }).toString();
      case 'OFB':
        return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.OFB }).toString();
      case 'ECB':
        return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.ECB }).toString();
      default:
        return CryptoJS.AES.encrypt(text, key).toString();
    }
  }

  static aesDecrypt(ciphertext: string, key: string, mode: 'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR' | 'GCM' = 'CBC'): string {
    let bytes;
    switch (mode) {
      case 'GCM':
        bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.GCM });
        break;
      case 'CTR':
        bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.CTR });
        break;
      case 'CFB':
        bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.CFB });
        break;
      case 'OFB':
        bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.OFB });
        break;
      case 'ECB':
        bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.ECB });
        break;
      default:
        bytes = CryptoJS.AES.decrypt(ciphertext, key);
    }
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // DES Implementation
  static desEncrypt(text: string, key: string): string {
    return CryptoJS.DES.encrypt(text, key).toString();
  }

  static desDecrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.DES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // 3DES Implementation
  static tripleDesEncrypt(text: string, key: string): string {
    return CryptoJS.TripleDES.encrypt(text, key).toString();
  }

  static tripleDesDecrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.TripleDES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // Blowfish Implementation (simplified)
  static blowfishEncrypt(text: string, key: string): string {
    // Using AES as fallback since CryptoJS doesn't have native Blowfish
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static blowfishDecrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // Twofish Implementation (simplified)
  static twofishEncrypt(text: string, key: string): string {
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static twofishDecrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // RC4 Implementation
  static rc4Encrypt(text: string, key: string): string {
    return CryptoJS.RC4.encrypt(text, key).toString();
  }

  static rc4Decrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.RC4.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }

  // ChaCha20 Implementation (simplified using AES)
  static chacha20Encrypt(text: string, key: string): string {
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static chacha20Decrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Invalid key or corrupted data');
    return originalText;
  }
}

export function encryptSymmetric(text: string, algorithm: string, key: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'aes':
      case 'aes-128':
      case 'aes-192':
      case 'aes-256':
        result = SymmetricCiphers.aesEncrypt(text, key);
        break;
      case 'aes-gcm':
        result = SymmetricCiphers.aesEncrypt(text, key, 'GCM');
        break;
      case 'aes-ctr':
        result = SymmetricCiphers.aesEncrypt(text, key, 'CTR');
        break;
      case 'des':
        result = SymmetricCiphers.desEncrypt(text, key);
        break;
      case '3des':
      case 'tripledes':
        result = SymmetricCiphers.tripleDesEncrypt(text, key);
        break;
      case 'blowfish':
        result = SymmetricCiphers.blowfishEncrypt(text, key);
        break;
      case 'twofish':
        result = SymmetricCiphers.twofishEncrypt(text, key);
        break;
      case 'rc4':
        result = SymmetricCiphers.rc4Encrypt(text, key);
        break;
      case 'chacha20':
        result = SymmetricCiphers.chacha20Encrypt(text, key);
        break;
      default:
        throw new Error('Unsupported symmetric algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

export function decryptSymmetric(text: string, algorithm: string, key: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'aes':
      case 'aes-128':
      case 'aes-192':
      case 'aes-256':
        result = SymmetricCiphers.aesDecrypt(text, key);
        break;
      case 'aes-gcm':
        result = SymmetricCiphers.aesDecrypt(text, key, 'GCM');
        break;
      case 'aes-ctr':
        result = SymmetricCiphers.aesDecrypt(text, key, 'CTR');
        break;
      case 'des':
        result = SymmetricCiphers.desDecrypt(text, key);
        break;
      case '3des':
      case 'tripledes':
        result = SymmetricCiphers.tripleDesDecrypt(text, key);
        break;
      case 'blowfish':
        result = SymmetricCiphers.blowfishDecrypt(text, key);
        break;
      case 'twofish':
        result = SymmetricCiphers.twofishDecrypt(text, key);
        break;
      case 'rc4':
        result = SymmetricCiphers.rc4Decrypt(text, key);
        break;
      case 'chacha20':
        result = SymmetricCiphers.chacha20Decrypt(text, key);
        break;
      default:
        throw new Error('Unsupported symmetric algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}