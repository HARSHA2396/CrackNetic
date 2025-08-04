import { EncodingResult } from '../types/crypto';

export class EnhancedEncodingAlgorithms {
  // Base85 (ASCII85) encoding
  static base85Encode(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let result = '';
    
    for (let i = 0; i < bytes.length; i += 4) {
      let value = 0;
      let count = 0;
      
      for (let j = 0; j < 4 && i + j < bytes.length; j++) {
        value = value * 256 + bytes[i + j];
        count++;
      }
      
      if (count < 4) {
        value *= Math.pow(256, 4 - count);
      }
      
      if (value === 0 && count === 4) {
        result += 'z';
      } else {
        const chars = [];
        for (let k = 0; k < 5; k++) {
          chars.unshift(String.fromCharCode(33 + (value % 85)));
          value = Math.floor(value / 85);
        }
        result += chars.slice(0, count + 1).join('');
      }
    }
    
    return result;
  }

  static base85Decode(text: string): string {
    const result: number[] = [];
    let i = 0;
    
    while (i < text.length) {
      if (text[i] === 'z') {
        result.push(0, 0, 0, 0);
        i++;
        continue;
      }
      
      let value = 0;
      let count = 0;
      
      for (let j = 0; j < 5 && i + j < text.length; j++) {
        value = value * 85 + (text.charCodeAt(i + j) - 33);
        count++;
      }
      
      const bytes = [];
      for (let k = 0; k < 4; k++) {
        bytes.unshift(value & 0xFF);
        value >>= 8;
      }
      
      result.push(...bytes.slice(0, count - 1));
      i += count;
    }
    
    return new TextDecoder().decode(new Uint8Array(result));
  }

  // Base91 encoding
  static base91Encode(text: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
    const bytes = new TextEncoder().encode(text);
    let result = '';
    let accumulator = 0;
    let bits = 0;
    
    for (const byte of bytes) {
      accumulator |= (byte << bits);
      bits += 8;
      
      if (bits > 13) {
        let value = accumulator & 8191;
        if (value > 88) {
          accumulator >>= 13;
          bits -= 13;
        } else {
          value = accumulator & 16383;
          accumulator >>= 14;
          bits -= 14;
        }
        result += alphabet[value % 91] + alphabet[Math.floor(value / 91)];
      }
    }
    
    if (bits > 0) {
      result += alphabet[accumulator % 91];
      if (bits > 7 || accumulator > 90) {
        result += alphabet[Math.floor(accumulator / 91)];
      }
    }
    
    return result;
  }

  static base91Decode(text: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
    const decodeTable: { [key: string]: number } = {};
    for (let i = 0; i < alphabet.length; i++) {
      decodeTable[alphabet[i]] = i;
    }
    
    const result: number[] = [];
    let accumulator = 0;
    let bits = 0;
    let value = -1;
    
    for (const char of text) {
      if (!(char in decodeTable)) continue;
      
      if (value === -1) {
        value = decodeTable[char];
      } else {
        value += decodeTable[char] * 91;
        accumulator |= (value << bits);
        bits += value > 88 ? 13 : 14;
        value = -1;
        
        while (bits > 7) {
          result.push(accumulator & 255);
          accumulator >>= 8;
          bits -= 8;
        }
      }
    }
    
    if (value !== -1) {
      accumulator |= (value << bits);
      result.push(accumulator & 255);
    }
    
    return new TextDecoder().decode(new Uint8Array(result));
  }

  // Punycode encoding
  static punycodeEncode(text: string): string {
    try {
      // Simplified punycode implementation
      return 'xn--' + btoa(text).replace(/[^a-zA-Z0-9]/g, '');
    } catch {
      throw new Error('Invalid input for Punycode encoding');
    }
  }

  static punycodeDecode(text: string): string {
    try {
      if (!text.startsWith('xn--')) {
        throw new Error('Invalid Punycode format');
      }
      return atob(text.slice(4));
    } catch {
      throw new Error('Invalid Punycode string');
    }
  }

  // Quoted-Printable encoding
  static quotedPrintableEncode(text: string): string {
    return text.replace(/[^\x20-\x7E]|[=]/g, (char) => {
      return '=' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    });
  }

  static quotedPrintableDecode(text: string): string {
    return text.replace(/=([0-9A-F]{2})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  }

  // UUEncoding
  static uuencode(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let result = '';
    
    for (let i = 0; i < bytes.length; i += 3) {
      const chunk = bytes.slice(i, i + 3);
      while (chunk.length < 3) chunk.push(0);
      
      const value = (chunk[0] << 16) | (chunk[1] << 8) | chunk[2];
      const encoded = [
        (value >> 18) & 63,
        (value >> 12) & 63,
        (value >> 6) & 63,
        value & 63
      ].map(n => String.fromCharCode(n + 32)).join('');
      
      result += encoded;
    }
    
    return result;
  }

  static uudecode(text: string): string {
    const result: number[] = [];
    
    for (let i = 0; i < text.length; i += 4) {
      const chunk = text.slice(i, i + 4);
      const values = chunk.split('').map(char => char.charCodeAt(0) - 32);
      
      const value = (values[0] << 18) | (values[1] << 12) | (values[2] << 6) | values[3];
      
      result.push((value >> 16) & 255);
      if (i + 4 <= text.length) result.push((value >> 8) & 255);
      if (i + 4 <= text.length) result.push(value & 255);
    }
    
    return new TextDecoder().decode(new Uint8Array(result));
  }
}

export function encodeTextEnhanced(text: string, algorithm: string): EncodingResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'base64':
        result = btoa(text);
        break;
      case 'base32':
        result = base32Encode(text);
        break;
      case 'base58':
        result = base58Encode(text);
        break;
      case 'base85':
      case 'ascii85':
        result = EnhancedEncodingAlgorithms.base85Encode(text);
        break;
      case 'base91':
        result = EnhancedEncodingAlgorithms.base91Encode(text);
        break;
      case 'hex':
      case 'hexadecimal':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
        break;
      case 'binary':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
        break;
      case 'octal':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(8).padStart(3, '0'))
          .join(' ');
        break;
      case 'url':
      case 'percent':
        result = encodeURIComponent(text);
        break;
      case 'html':
        result = text.replace(/[&<>"']/g, (char) => {
          const entities: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          };
          return entities[char];
        });
        break;
      case 'ascii':
        result = Array.from(text)
          .map(char => char.charCodeAt(0).toString())
          .join(' ');
        break;
      case 'punycode':
        result = EnhancedEncodingAlgorithms.punycodeEncode(text);
        break;
      case 'quoted-printable':
        result = EnhancedEncodingAlgorithms.quotedPrintableEncode(text);
        break;
      case 'uuencode':
        result = EnhancedEncodingAlgorithms.uuencode(text);
        break;
      default:
        throw new Error('Unsupported encoding algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

export function decodeTextEnhanced(text: string, algorithm: string): EncodingResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'base64':
        result = atob(text);
        break;
      case 'base32':
        result = base32Decode(text);
        break;
      case 'base58':
        result = base58Decode(text);
        break;
      case 'base85':
      case 'ascii85':
        result = EnhancedEncodingAlgorithms.base85Decode(text);
        break;
      case 'base91':
        result = EnhancedEncodingAlgorithms.base91Decode(text);
        break;
      case 'hex':
      case 'hexadecimal':
        result = text.match(/.{2}/g)?.map(hex => String.fromCharCode(parseInt(hex, 16))).join('') || '';
        break;
      case 'binary':
        result = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        break;
      case 'octal':
        result = text.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
        break;
      case 'url':
      case 'percent':
        result = decodeURIComponent(text);
        break;
      case 'html':
        result = text.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => {
          const entities: { [key: string]: string } = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
          };
          return entities[entity];
        });
        break;
      case 'ascii':
        result = text.split(' ').map(code => String.fromCharCode(parseInt(code))).join('');
        break;
      case 'punycode':
        result = EnhancedEncodingAlgorithms.punycodeDecode(text);
        break;
      case 'quoted-printable':
        result = EnhancedEncodingAlgorithms.quotedPrintableDecode(text);
        break;
      case 'uuencode':
        result = EnhancedEncodingAlgorithms.uudecode(text);
        break;
      default:
        throw new Error('Unsupported decoding algorithm');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

// Helper functions for Base32 and Base58 (from previous implementation)
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
  
  for (const char of text) {
    if (char === '1') bytes.unshift(0);
    else break;
  }
  
  return String.fromCharCode(...bytes);
}