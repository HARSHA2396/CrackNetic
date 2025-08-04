import { CryptoResult, HashResult, EncodingResult, BruteForceResult, AlgorithmPrediction } from '../types/crypto';
import { encryptModernSymmetric, decryptModernSymmetric } from './modernSymmetricCiphers';
import { encryptAsymmetric, decryptAsymmetric } from './asymmetricCiphers';
import { encryptClassical, decryptClassical } from './classicalCiphers';
import { hashTextEnhanced } from './enhancedHashAlgorithms';
import { encodeTextEnhanced, decodeTextEnhanced } from './enhancedEncodingAlgorithms';
import { bruteForceDecryptEnhanced, bruteForceWithProgress } from './enhancedBruteForce';
import { predictAlgorithmEnhanced } from './enhancedAlgorithmPrediction';

// Main encryption function that routes to appropriate algorithm type
export function encryptText(text: string, algorithm: string, key?: string): CryptoResult {
  const algo = algorithm.toLowerCase();
  
  // Symmetric algorithms
  const symmetricAlgos = [
    'aes', 'aes-128', 'aes-192', 'aes-256', 'aes-ecb', 'aes-cbc', 'aes-cfb', 'aes-ofb', 'aes-ctr', 'aes-gcm',
    'des', '3des', 'tripledes', 'blowfish', 'twofish', 'idea', 'cast5', 'rc5', 'rc6', 'serpent', 'camellia',
    'rc4', 'chacha20', 'salsa20', 'seal', 'a5/1', 'a51', 'a5/2', 'a52', 'grain', 'mickey',
    'vernam', 'otp', 'one-time-pad'
  ];
  
  // Asymmetric algorithms
  const asymmetricAlgos = [
    'rsa', 'ecc', 'elgamal', 'paillier', 'knapsack', 'kyber', 'dilithium', 'ntru'
  ];
  
  // Classical algorithms
  const classicalAlgos = [
    'caesar', 'atbash', 'rot13', 'monoalphabetic', 'vigenere', 'beaufort', 'autokey',
    'playfair', 'hill', 'adfgx', 'bacon', 'railfence', 'columnar', 'scytale', 'route',
    'xor', 'affine'
  ];
  
  if (symmetricAlgos.includes(algo)) {
    return encryptModernSymmetric(text, algorithm, key || 'defaultkey');
  } else if (asymmetricAlgos.includes(algo)) {
    return encryptAsymmetric(text, algorithm, key || 'defaultpublickey');
  } else if (classicalAlgos.includes(algo)) {
    return encryptClassical(text, algorithm, key);
  } else {
    return { success: false, algorithm, error: 'Unsupported encryption algorithm' };
  }
}

// Main decryption function that routes to appropriate algorithm type
export function decryptText(text: string, algorithm: string, key?: string): CryptoResult {
  const algo = algorithm.toLowerCase();
  
  const symmetricAlgos = [
    'aes', 'aes-128', 'aes-192', 'aes-256', 'aes-ecb', 'aes-cbc', 'aes-cfb', 'aes-ofb', 'aes-ctr', 'aes-gcm',
    'des', '3des', 'tripledes', 'blowfish', 'twofish', 'idea', 'cast5', 'rc5', 'rc6', 'serpent', 'camellia',
    'rc4', 'chacha20', 'salsa20', 'seal', 'a5/1', 'a51', 'a5/2', 'a52', 'grain', 'mickey',
    'vernam', 'otp', 'one-time-pad'
  ];
  
  const asymmetricAlgos = [
    'rsa', 'ecc', 'elgamal', 'paillier', 'knapsack', 'kyber', 'dilithium', 'ntru'
  ];
  
  const classicalAlgos = [
    'caesar', 'atbash', 'rot13', 'monoalphabetic', 'vigenere', 'beaufort', 'autokey',
    'playfair', 'hill', 'adfgx', 'bacon', 'railfence', 'columnar', 'scytale', 'route',
    'xor', 'affine'
  ];
  
  if (symmetricAlgos.includes(algo)) {
    return decryptModernSymmetric(text, algorithm, key || 'defaultkey');
  } else if (asymmetricAlgos.includes(algo)) {
    return decryptAsymmetric(text, algorithm, key || 'defaultprivatekey');
  } else if (classicalAlgos.includes(algo)) {
    return decryptClassical(text, algorithm, key);
  } else {
    return { success: false, algorithm, error: 'Unsupported decryption algorithm' };
  }
}

// Enhanced hash function
export function hashText(text: string, algorithm: string, key?: string): HashResult {
  return hashTextEnhanced(text, algorithm, key);
}

// Enhanced encoding functions
export function encodeText(text: string, algorithm: string): EncodingResult {
  return encodeTextEnhanced(text, algorithm);
}

export function decodeText(text: string, algorithm: string): EncodingResult {
  return decodeTextEnhanced(text, algorithm);
}

// Enhanced brute force function
export function bruteForceDecrypt(
  text: string,
  category: 'symmetric' | 'classical' | 'encoding' | 'all' = 'all'
): Promise<BruteForceResult[]> {
  return bruteForceDecryptEnhanced(text, category);
}

// Brute force with progress callback
export function bruteForceDecryptWithProgress(
  text: string,
  category: 'symmetric' | 'classical' | 'encoding' | 'all' = 'all',
  onProgress?: (progress: number) => void
): Promise<BruteForceResult[]> {
  return bruteForceWithProgress(text, category, onProgress);
}

// Enhanced algorithm prediction
export function predictAlgorithm(text: string): AlgorithmPrediction[] {
  return predictAlgorithmEnhanced(text);
}

// Get all available algorithms by category
export function getAvailableAlgorithms() {
  return {
    symmetric: [
      // AES variants
      { id: 'aes', name: 'AES (Advanced Encryption Standard)', needsKey: true },
      { id: 'aes-128', name: 'AES-128', needsKey: true },
      { id: 'aes-192', name: 'AES-192', needsKey: true },
      { id: 'aes-256', name: 'AES-256', needsKey: true },
      { id: 'aes-ecb', name: 'AES-ECB', needsKey: true },
      { id: 'aes-cbc', name: 'AES-CBC', needsKey: true },
      { id: 'aes-cfb', name: 'AES-CFB', needsKey: true },
      { id: 'aes-ofb', name: 'AES-OFB', needsKey: true },
      { id: 'aes-ctr', name: 'AES-CTR', needsKey: true },
      { id: 'aes-gcm', name: 'AES-GCM', needsKey: true },
      // Block ciphers
      { id: 'des', name: 'DES (Data Encryption Standard)', needsKey: true },
      { id: '3des', name: '3DES (Triple DES)', needsKey: true },
      { id: 'blowfish', name: 'Blowfish', needsKey: true },
      { id: 'twofish', name: 'Twofish', needsKey: true },
      { id: 'idea', name: 'IDEA (International Data Encryption Algorithm)', needsKey: true },
      { id: 'cast5', name: 'CAST5', needsKey: true },
      { id: 'rc5', name: 'RC5', needsKey: true },
      { id: 'rc6', name: 'RC6', needsKey: true },
      { id: 'serpent', name: 'Serpent', needsKey: true },
      { id: 'camellia', name: 'Camellia', needsKey: true },
      // Stream ciphers
      { id: 'rc4', name: 'RC4', needsKey: true },
      { id: 'chacha20', name: 'ChaCha20', needsKey: true },
      { id: 'salsa20', name: 'Salsa20', needsKey: true },
      { id: 'seal', name: 'SEAL', needsKey: true },
      { id: 'a51', name: 'A5/1 (GSM)', needsKey: true },
      { id: 'a52', name: 'A5/2 (GSM)', needsKey: true },
      { id: 'grain', name: 'Grain', needsKey: true },
      { id: 'mickey', name: 'MICKEY', needsKey: true },
      { id: 'vernam', name: 'Vernam Cipher (One-Time Pad)', needsKey: true }
    ],
    asymmetric: [
      { id: 'rsa', name: 'RSA', needsKey: true },
      { id: 'elgamal', name: 'ElGamal', needsKey: true },
      { id: 'ecc', name: 'ECC (Elliptic Curve Cryptography)', needsKey: true },
      { id: 'paillier', name: 'Paillier Cryptosystem', needsKey: true },
      { id: 'knapsack', name: 'Knapsack Cryptosystem', needsKey: true },
      // Post-quantum algorithms
      { id: 'kyber', name: 'Kyber (Post-Quantum)', needsKey: true },
      { id: 'dilithium', name: 'Dilithium (Post-Quantum)', needsKey: true },
      { id: 'ntru', name: 'NTRU (Lattice-based)', needsKey: true }
    ],
    classical: [
      // Substitution ciphers
      { id: 'caesar', name: 'Caesar Cipher', needsKey: false },
      { id: 'atbash', name: 'Atbash Cipher', needsKey: false },
      { id: 'rot13', name: 'ROT13', needsKey: false },
      { id: 'monoalphabetic', name: 'Monoalphabetic Cipher', needsKey: true },
      // Polyalphabetic ciphers
      { id: 'vigenere', name: 'Vigenère Cipher', needsKey: true },
      { id: 'beaufort', name: 'Beaufort Cipher', needsKey: true },
      { id: 'autokey', name: 'Autokey Cipher', needsKey: true },
      { id: 'playfair', name: 'Playfair Cipher', needsKey: true },
      { id: 'hill', name: 'Hill Cipher', needsKey: true },
      { id: 'adfgx', name: 'ADFGX Cipher', needsKey: true },
      { id: 'bacon', name: 'Bacon\'s Cipher', needsKey: false },
      // Transposition ciphers
      { id: 'railfence', name: 'Rail Fence Cipher', needsKey: true },
      { id: 'columnar', name: 'Columnar Transposition', needsKey: true },
      { id: 'scytale', name: 'Scytale Cipher', needsKey: true },
      { id: 'route', name: 'Route Cipher', needsKey: true },
      // Other
      { id: 'xor', name: 'XOR Cipher', needsKey: true },
      { id: 'affine', name: 'Affine Cipher', needsKey: true }
    ],
    hash: [
      { id: 'md5', name: 'MD5', needsKey: false },
      { id: 'sha1', name: 'SHA-1', needsKey: false },
      { id: 'sha224', name: 'SHA-224', needsKey: false },
      { id: 'sha256', name: 'SHA-256', needsKey: false },
      { id: 'sha384', name: 'SHA-384', needsKey: false },
      { id: 'sha512', name: 'SHA-512', needsKey: false },
      { id: 'sha3-224', name: 'SHA3-224', needsKey: false },
      { id: 'sha3-256', name: 'SHA3-256', needsKey: false },
      { id: 'sha3-384', name: 'SHA3-384', needsKey: false },
      { id: 'sha3-512', name: 'SHA3-512', needsKey: false },
      { id: 'keccak-256', name: 'Keccak-256', needsKey: false },
      { id: 'blake2b', name: 'BLAKE2b', needsKey: false },
      { id: 'blake3', name: 'BLAKE3', needsKey: false },
      { id: 'ripemd160', name: 'RIPEMD-160', needsKey: false },
      { id: 'whirlpool', name: 'Whirlpool', needsKey: false },
      { id: 'hmac-md5', name: 'HMAC-MD5', needsKey: true },
      { id: 'hmac-sha1', name: 'HMAC-SHA1', needsKey: true },
      { id: 'hmac-sha256', name: 'HMAC-SHA256', needsKey: true },
      { id: 'hmac-sha512', name: 'HMAC-SHA512', needsKey: true },
      { id: 'pbkdf2', name: 'PBKDF2', needsKey: true },
      { id: 'bcrypt', name: 'bcrypt', needsKey: false },
      { id: 'argon2', name: 'Argon2', needsKey: true }
    ],
    encoding: [
      { id: 'base64', name: 'Base64', needsKey: false },
      { id: 'base32', name: 'Base32', needsKey: false },
      { id: 'base58', name: 'Base58', needsKey: false },
      { id: 'base85', name: 'Base85 (ASCII85)', needsKey: false },
      { id: 'base91', name: 'Base91', needsKey: false },
      { id: 'hex', name: 'Hexadecimal', needsKey: false },
      { id: 'binary', name: 'Binary', needsKey: false },
      { id: 'octal', name: 'Octal', needsKey: false },
      { id: 'url', name: 'URL Encoding', needsKey: false },
      { id: 'html', name: 'HTML Entities', needsKey: false },
      { id: 'ascii', name: 'ASCII Converter', needsKey: false },
      { id: 'punycode', name: 'Punycode', needsKey: false },
      { id: 'quoted-printable', name: 'Quoted-Printable', needsKey: false },
      { id: 'uuencode', name: 'UUEncoding', needsKey: false }
    ]
  };
}

// Validate algorithm and key combination
export function validateAlgorithmKey(algorithm: string, key?: string): { valid: boolean; error?: string } {
  const allAlgorithms = getAvailableAlgorithms();
  const flatAlgorithms = [
    ...allAlgorithms.symmetric,
    ...allAlgorithms.asymmetric,
    ...allAlgorithms.classical,
    ...allAlgorithms.hash,
    ...allAlgorithms.encoding
  ];
  
  const algorithmInfo = flatAlgorithms.find(alg => alg.id === algorithm.toLowerCase());
  
  if (!algorithmInfo) {
    return { valid: false, error: 'Unknown algorithm' };
  }
  
  if (algorithmInfo.needsKey && (!key || key.trim() === '')) {
    return { valid: false, error: 'This algorithm requires a key' };
  }
  
  return { valid: true };
}

// Get algorithm category
export function getAlgorithmCategory(algorithm: string): string {
  const allAlgorithms = getAvailableAlgorithms();
  const algo = algorithm.toLowerCase();
  
  if (allAlgorithms.symmetric.some(a => a.id === algo)) return 'symmetric';
  if (allAlgorithms.asymmetric.some(a => a.id === algo)) return 'asymmetric';
  if (allAlgorithms.classical.some(a => a.id === algo)) return 'classical';
  if (allAlgorithms.hash.some(a => a.id === algo)) return 'hash';
  if (allAlgorithms.encoding.some(a => a.id === algo)) return 'encoding';
  
  return 'unknown';
}