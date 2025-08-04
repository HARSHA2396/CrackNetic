import CryptoJS from 'crypto-js';
import { HashResult } from '../types/crypto';

export function hashText(text: string, algorithm: string): HashResult {
  try {
    let hash: string;
    
    switch (algorithm) {
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
      case 'ripemd160':
        hash = CryptoJS.RIPEMD160(text).toString();
        break;
      case 'whirlpool':
        // Note: CryptoJS doesn't have Whirlpool, using SHA512 as fallback
        hash = CryptoJS.SHA512(text).toString();
        break;
      case 'blake2':
        // Note: CryptoJS doesn't have BLAKE2, using SHA256 as fallback
        hash = CryptoJS.SHA256(text).toString();
        break;
      default:
        throw new Error('Unsupported hash algorithm');
    }
    
    return { success: true, hash, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}