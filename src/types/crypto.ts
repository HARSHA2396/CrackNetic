export interface CryptoResult {
  success: boolean;
  result?: string;
  algorithm: string;
  error?: string;
}

export interface HashResult {
  success: boolean;
  hash?: string;
  algorithm: string;
  error?: string;
}

export interface EncodingResult {
  success: boolean;
  result?: string;
  algorithm: string;
  error?: string;
}

export interface BruteForceResult {
  algorithm: string;
  result: string;
  confidence: number;
  isReadable: boolean;
}

export interface AlgorithmPrediction {
  algorithm: string;
  confidence: number;
  reasoning: string;
}

export interface CryptoKey {
  id: string;
  name: string;
  type: 'AES' | 'RSA' | 'DES';
  size: number;
  createdAt: Date;
  publicKey?: string;
  privateKey?: string;
}