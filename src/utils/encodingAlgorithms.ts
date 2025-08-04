import { EncodingResult } from '../types/crypto';

export function encodeText(text: string, algorithm: string): EncodingResult {
  try {
    let result: string;
    
    switch (algorithm) {
      case 'base64':
        result = btoa(text);
        break;
      case 'base32':
        result = base32Encode(text);
        break;
      case 'base58':
        result = base58Encode(text);
        break;
      case 'hex':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
        break;
      case 'binary':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
        break;
      case 'url':
        result = encodeURIComponent(text);
        break;
      case 'ascii':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString())
          .join(' ');
        break;
      default:
        throw new Error('Unsupported encoding algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

export function decodeText(text: string, algorithm: string): EncodingResult {
  try {
    let result: string;
    
    switch (algorithm) {
      case 'base64':
        result = atob(text);
        break;
      case 'base32':
        result = base32Decode(text);
        break;
      case 'base58':
        result = base58Decode(text);
        break;
      case 'hex':
        result = text.match(/.{2}/g)?.map(hex => String.fromCharCode(parseInt(hex, 16))).join('') || '';
        break;
      case 'binary':
        result = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        break;
      case 'url':
        result = decodeURIComponent(text);
        break;
      case 'ascii':
        result = text.split(' ').map(code => String.fromCharCode(parseInt(code))).join('');
        break;
      default:
        throw new Error('Unsupported decoding algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

function base32Encode(text: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    bits += text.charCodeAt(i).toString(2).padStart(8, '0');
  }
  
  while (bits.length % 5 !== 0) {
    bits += '0';
  }
  
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5);
    result += alphabet[parseInt(chunk, 2)];
  }
  
  return result;
}

function base32Decode(text: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const index = alphabet.indexOf(text[i]);
    if (index === -1) throw new Error('Invalid Base32 character');
    bits += index.toString(2).padStart(5, '0');
  }
  
  for (let i = 0; i < bits.length - 7; i += 8) {
    const byte = bits.substr(i, 8);
    if (byte.length === 8) {
      result += String.fromCharCode(parseInt(byte, 2));
    }
  }
  
  return result;
}

function base58Encode(text: string): string {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const bytes = Array.from(text).map(char => char.charCodeAt(0));
  
  let num = BigInt(0);
  for (const byte of bytes) {
    num = num * BigInt(256) + BigInt(byte);
  }
  
  let result = '';
  while (num > 0) {
    result = alphabet[Number(num % BigInt(58))] + result;
    num = num / BigInt(58);
  }
  
  // Handle leading zeros
  for (const byte of bytes) {
    if (byte === 0) result = '1' + result;
    else break;
  }
  
  return result;
}

function base58Decode(text: string): string {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  
  let num = BigInt(0);
  for (const char of text) {
    const index = alphabet.indexOf(char);
    if (index === -1) throw new Error('Invalid Base58 character');
    num = num * BigInt(58) + BigInt(index);
  }
  
  const bytes: number[] = [];
  while (num > 0) {
    bytes.unshift(Number(num % BigInt(256)));
    num = num / BigInt(256);
  }
  
  // Handle leading '1's
  for (const char of text) {
    if (char === '1') bytes.unshift(0);
    else break;
  }
  
  return String.fromCharCode(...bytes);
}