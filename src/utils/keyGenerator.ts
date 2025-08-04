import CryptoJS from 'crypto-js';
import { CryptoKey } from '../types/crypto';

export class KeyGenerator {
  static generateAESKey(size: 128 | 192 | 256 = 256): CryptoKey {
    const keySize = size / 8; // Convert bits to bytes
    const key = CryptoJS.lib.WordArray.random(keySize).toString();
    
    return {
      id: crypto.randomUUID(),
      name: `AES-${size} Key`,
      type: 'AES',
      size,
      createdAt: new Date(),
      publicKey: key,
    };
  }
  
  static generateDESKey(): CryptoKey {
    const key = CryptoJS.lib.WordArray.random(8).toString(); // 8 bytes for DES
    
    return {
      id: crypto.randomUUID(),
      name: 'DES Key',
      type: 'DES',
      size: 64,
      createdAt: new Date(),
      publicKey: key,
    };
  }
  
  static generateRSAKeyPair(keySize: 1024 | 2048 | 4096 = 2048): CryptoKey {
    // Note: This is a simplified RSA key generation for demo purposes
    // In production, you would use proper RSA libraries
    const publicExponent = 65537;
    const privateKey = CryptoJS.lib.WordArray.random(keySize / 8).toString();
    const publicKey = CryptoJS.lib.WordArray.random(keySize / 8).toString();
    
    return {
      id: crypto.randomUUID(),
      name: `RSA-${keySize} Key Pair`,
      type: 'RSA',
      size: keySize,
      createdAt: new Date(),
      publicKey,
      privateKey,
    };
  }
  
  static generateRandomPassword(length: number = 32, includeSymbols: boolean = true): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = includeSymbols ? chars + symbols : chars;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return password;
  }
  
  static exportKey(key: CryptoKey, format: 'json' | 'pem' | 'raw' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(key, null, 2);
      case 'pem':
        // Simplified PEM format for demo
        return `-----BEGIN ${key.type} PRIVATE KEY-----\n${key.privateKey || key.publicKey}\n-----END ${key.type} PRIVATE KEY-----`;
      case 'raw':
        return key.publicKey || '';
      default:
        return key.publicKey || '';
    }
  }
}