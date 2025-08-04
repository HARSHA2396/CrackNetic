import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Copy, Download, ChevronDown, ChevronRight, Key } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { 
  encryptText, 
  decryptText, 
  hashText, 
  encodeText, 
  decodeText,
  getAvailableAlgorithms,
  validateAlgorithmKey 
} from '../../utils/comprehensiveCryptoAlgorithms';
import { CryptoResult, HashResult, EncodingResult } from '../../types/crypto';

interface AlgorithmCategory {
  id: string;
  title: string;
  icon: string;
  algorithms: Algorithm[];
}

interface Algorithm {
  id: string;
  name: string;
  type: 'encrypt' | 'hash' | 'encode';
  needsKey: boolean;
  keyPlaceholder?: string;
  keyDescription?: string;
}

const algorithmCategories: AlgorithmCategory[] = [
  {
    id: 'symmetric',
    title: 'Modern Symmetric Ciphers',
    icon: '🔐',
    algorithms: [
      { id: 'aes', name: 'AES (Advanced Encryption Standard)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key/password', keyDescription: 'Secret key for AES encryption (any length)' },
      { id: 'aes-128', name: 'AES-128', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES-128 key', keyDescription: '128-bit key (16 characters recommended)' },
      { id: 'aes-192', name: 'AES-192', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES-192 key', keyDescription: '192-bit key (24 characters recommended)' },
      { id: 'aes-256', name: 'AES-256', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES-256 key', keyDescription: '256-bit key (32 characters recommended)' },
      { id: 'aes-ecb', name: 'AES-ECB', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key', keyDescription: 'AES in Electronic Codebook mode' },
      { id: 'aes-cbc', name: 'AES-CBC', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key', keyDescription: 'AES in Cipher Block Chaining mode' },
      { id: 'aes-cfb', name: 'AES-CFB', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key', keyDescription: 'AES in Cipher Feedback mode' },
      { id: 'aes-ofb', name: 'AES-OFB', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key', keyDescription: 'AES in Output Feedback mode' },
      { id: 'aes-ctr', name: 'AES-CTR', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES key', keyDescription: 'AES in Counter mode' },
      { id: 'aes-gcm', name: 'AES-GCM', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter AES-GCM key', keyDescription: 'Authenticated encryption key' },
      { id: 'des', name: 'DES (Data Encryption Standard)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter DES key', keyDescription: '64-bit key (8 characters)' },
      { id: '3des', name: '3DES (Triple DES)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter 3DES key', keyDescription: '192-bit key (24 characters)' },
      { id: 'blowfish', name: 'Blowfish', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Blowfish key', keyDescription: 'Variable length key (4-56 bytes)' },
      { id: 'twofish', name: 'Twofish', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Twofish key', keyDescription: 'Up to 256-bit key' },
      { id: 'idea', name: 'IDEA', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter IDEA key', keyDescription: '128-bit key for IDEA cipher' },
      { id: 'cast5', name: 'CAST5', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter CAST5 key', keyDescription: 'Variable length key (40-128 bits)' },
      { id: 'rc5', name: 'RC5', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter RC5 key', keyDescription: 'Variable length key' },
      { id: 'rc6', name: 'RC6', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter RC6 key', keyDescription: 'Variable length key' },
      { id: 'serpent', name: 'Serpent', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Serpent key', keyDescription: '128, 192, or 256-bit key' },
      { id: 'camellia', name: 'Camellia', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Camellia key', keyDescription: '128, 192, or 256-bit key' },
      { id: 'rc4', name: 'RC4', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter RC4 key', keyDescription: 'Variable length key (1-256 bytes)' },
      { id: 'chacha20', name: 'ChaCha20', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter ChaCha20 key', keyDescription: '256-bit key (32 characters)' },
      { id: 'salsa20', name: 'Salsa20', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Salsa20 key', keyDescription: '256-bit key (32 characters)' },
      { id: 'seal', name: 'SEAL', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter SEAL key', keyDescription: 'Stream cipher key' },
      { id: 'a51', name: 'A5/1 (GSM)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter A5/1 key', keyDescription: 'GSM encryption key' },
      { id: 'a52', name: 'A5/2 (GSM)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter A5/2 key', keyDescription: 'GSM encryption key' },
      { id: 'grain', name: 'Grain', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Grain key', keyDescription: 'Stream cipher key' },
      { id: 'mickey', name: 'MICKEY', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter MICKEY key', keyDescription: 'Stream cipher key' },
      { id: 'vernam', name: 'Vernam (One-Time Pad)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter OTP key', keyDescription: 'Key must be as long as plaintext' },
    ]
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric Encryption',
    icon: '🔑',
    algorithms: [
      { id: 'rsa', name: 'RSA', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter RSA public/private key', keyDescription: 'RSA public key for encryption, private key for decryption' },
      { id: 'elgamal', name: 'ElGamal', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter ElGamal key', keyDescription: 'ElGamal public/private key' },
      { id: 'ecc', name: 'ECC (Elliptic Curve)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter ECC key', keyDescription: 'Elliptic curve public/private key' },
      { id: 'paillier', name: 'Paillier', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Paillier key', keyDescription: 'Paillier public/private key' },
      { id: 'knapsack', name: 'Knapsack', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Knapsack key', keyDescription: 'Knapsack public/private key' },
      { id: 'kyber', name: 'Kyber (Post-Quantum)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Kyber key', keyDescription: 'Post-quantum encryption key' },
      { id: 'dilithium', name: 'Dilithium (Post-Quantum)', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter Dilithium key', keyDescription: 'Post-quantum signature key' },
      { id: 'ntru', name: 'NTRU', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter NTRU key', keyDescription: 'Lattice-based encryption key' },
    ]
  },
  {
    id: 'classical',
    title: 'Classical Ciphers',
    icon: '🧠',
    algorithms: [
      { id: 'caesar', name: 'Caesar Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter shift value (1-25)', keyDescription: 'Number of positions to shift (default: 13)' },
      { id: 'atbash', name: 'Atbash Cipher', type: 'encrypt', needsKey: false, keyDescription: 'Hebrew alphabet substitution cipher' },
      { id: 'rot13', name: 'ROT13', type: 'encrypt', needsKey: false, keyDescription: 'Fixed Caesar cipher with shift of 13' },
      { id: 'monoalphabetic', name: 'Monoalphabetic Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter 26-letter key', keyDescription: 'Substitution alphabet (26 unique letters)' },
      { id: 'vigenere', name: 'Vigenère Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter keyword', keyDescription: 'Keyword for polyalphabetic substitution' },
      { id: 'beaufort', name: 'Beaufort Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter keyword', keyDescription: 'Keyword for Beaufort cipher' },
      { id: 'autokey', name: 'Autokey Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter initial key', keyDescription: 'Initial key for autokey cipher' },
      { id: 'playfair', name: 'Playfair Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter keyword', keyDescription: 'Keyword for 5x5 cipher square' },
      { id: 'hill', name: 'Hill Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter key matrix', keyDescription: 'Key for matrix-based cipher' },
      { id: 'adfgx', name: 'ADFGX Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter key1,key2', keyDescription: 'Two keys separated by comma' },
      { id: 'bacon', name: 'Bacon\'s Cipher', type: 'encrypt', needsKey: false, keyDescription: 'Binary encoding of letters' },
      { id: 'railfence', name: 'Rail Fence Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter number of rails', keyDescription: 'Number of rails for zigzag pattern' },
      { id: 'columnar', name: 'Columnar Transposition', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter keyword', keyDescription: 'Keyword for column ordering' },
      { id: 'scytale', name: 'Scytale Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter diameter', keyDescription: 'Diameter of the scytale rod' },
      { id: 'route', name: 'Route Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter rows,cols,route', keyDescription: 'Grid dimensions and route pattern' },
      { id: 'xor', name: 'XOR Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter XOR key', keyDescription: 'Key for XOR operation (any length)' },
      { id: 'affine', name: 'Affine Cipher', type: 'encrypt', needsKey: true, keyPlaceholder: 'Enter a,b values (e.g., 5,8)', keyDescription: 'Two integers: a (coprime to 26) and b' },
    ]
  },
  {
    id: 'encoding',
    title: 'Encoding Schemes',
    icon: '🔄',
    algorithms: [
      { id: 'base64', name: 'Base64', type: 'encode', needsKey: false, keyDescription: 'Binary-to-text encoding scheme' },
      { id: 'base32', name: 'Base32', type: 'encode', needsKey: false, keyDescription: '32-character alphabet encoding' },
      { id: 'base58', name: 'Base58', type: 'encode', needsKey: false, keyDescription: 'Bitcoin-style encoding (no 0, O, I, l)' },
      { id: 'base85', name: 'Base85 (ASCII85)', type: 'encode', needsKey: false, keyDescription: 'High-density binary encoding' },
      { id: 'hex', name: 'Hexadecimal', type: 'encode', needsKey: false, keyDescription: 'Base-16 representation' },
      { id: 'binary', name: 'Binary', type: 'encode', needsKey: false, keyDescription: 'Base-2 representation' },
      { id: 'octal', name: 'Octal', type: 'encode', needsKey: false, keyDescription: 'Base-8 representation' },
      { id: 'ascii', name: 'ASCII Converter', type: 'encode', needsKey: false, keyDescription: 'Character code conversion' },
      { id: 'url', name: 'URL Encode/Decode', type: 'encode', needsKey: false, keyDescription: 'Percent encoding for URLs' },
      { id: 'html', name: 'HTML Entities', type: 'encode', needsKey: false, keyDescription: 'HTML character entity encoding' },
    ]
  },
  {
    id: 'hash',
    title: 'Hash Functions (One-Way)',
    icon: '🔒',
    algorithms: [
      { id: 'md5', name: 'MD5', type: 'hash', needsKey: false, keyDescription: '128-bit hash (deprecated for security)' },
      { id: 'sha1', name: 'SHA-1', type: 'hash', needsKey: false, keyDescription: '160-bit hash (deprecated for security)' },
      { id: 'sha224', name: 'SHA-224', type: 'hash', needsKey: false, keyDescription: '224-bit hash function' },
      { id: 'sha256', name: 'SHA-256', type: 'hash', needsKey: false, keyDescription: '256-bit hash (recommended)' },
      { id: 'sha384', name: 'SHA-384', type: 'hash', needsKey: false, keyDescription: '384-bit hash function' },
      { id: 'sha512', name: 'SHA-512', type: 'hash', needsKey: false, keyDescription: '512-bit hash function' },
      { id: 'sha3-256', name: 'SHA3-256', type: 'hash', needsKey: false, keyDescription: 'SHA-3 256-bit hash' },
      { id: 'blake2b', name: 'BLAKE2b', type: 'hash', needsKey: false, keyDescription: 'High-speed cryptographic hash' },
      { id: 'ripemd160', name: 'RIPEMD-160', type: 'hash', needsKey: false, keyDescription: '160-bit hash used in Bitcoin' },
      { id: 'whirlpool', name: 'Whirlpool', type: 'hash', needsKey: false, keyDescription: '512-bit hash function' },
      { id: 'hmac-sha256', name: 'HMAC-SHA256', type: 'hash', needsKey: true, keyPlaceholder: 'Enter HMAC key', keyDescription: 'Keyed-hash message authentication code' },
      { id: 'pbkdf2', name: 'PBKDF2', type: 'hash', needsKey: true, keyPlaceholder: 'Enter salt', keyDescription: 'Password-based key derivation function' },
      { id: 'bcrypt', name: 'bcrypt', type: 'hash', needsKey: false, keyDescription: 'Adaptive hash function for passwords' },
    ]
  }
];

export function EncryptDecrypt() {
  const [inputText, setInputText] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [key, setKey] = useState('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt' | 'encode' | 'decode' | 'hash'>('encrypt');
  const [result, setResult] = useState<CryptoResult | HashResult | EncodingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['symmetric']);
  const [keyError, setKeyError] = useState('');

  // Get algorithm from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam) {
      const foundAlgorithm = algorithmCategories
        .flatMap(cat => cat.algorithms)
        .find(alg => alg.id === algorithmParam);
      if (foundAlgorithm) {
        setSelectedAlgorithm(foundAlgorithm);
        setOperation(foundAlgorithm.type === 'hash' ? 'hash' : foundAlgorithm.type === 'encode' ? 'encode' : 'encrypt');
      }
    }
  }, []);

  // Validate key when algorithm or key changes
  useEffect(() => {
    if (selectedAlgorithm && selectedAlgorithm.needsKey) {
      const validation = validateAlgorithmKey(selectedAlgorithm.id, key);
      setKeyError(validation.valid ? '' : validation.error || '');
    } else {
      setKeyError('');
    }
  }, [selectedAlgorithm, key]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectAlgorithm = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setKey('');
    setResult(null);
    setKeyError('');
    if (algorithm.type === 'hash') {
      setOperation('hash');
    } else if (algorithm.type === 'encode') {
      setOperation('encode');
    } else {
      setOperation('encrypt');
    }
  };

  const handleProcess = async () => {
    if (!inputText || !selectedAlgorithm) {
      return;
    }

    // Validate key if required
    if (selectedAlgorithm.needsKey) {
      const validation = validateAlgorithmKey(selectedAlgorithm.id, key);
      if (!validation.valid) {
        setKeyError(validation.error || 'Invalid key');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let processResult: CryptoResult | HashResult | EncodingResult;

    if (selectedAlgorithm.type === 'hash') {
      processResult = hashText(inputText, selectedAlgorithm.id, key);
    } else if (selectedAlgorithm.type === 'encode') {
      processResult = operation === 'encode' 
        ? encodeText(inputText, selectedAlgorithm.id)
        : decodeText(inputText, selectedAlgorithm.id);
    } else {
      processResult = operation === 'encrypt' 
        ? encryptText(inputText, selectedAlgorithm.id, key)
        : decryptText(inputText, selectedAlgorithm.id, key);
    }
    
    setResult(processResult);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    const textToCopy = 'hash' in result! ? result.hash : 'result' in result! ? result.result : '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const handleDownload = () => {
    const textToDownload = 'hash' in result! ? result.hash : 'result' in result! ? result.result : '';
    if (textToDownload) {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${operation}-result.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getOperationButtons = () => {
    if (!selectedAlgorithm) return null;

    if (selectedAlgorithm.type === 'hash') {
      return (
        <Button
          onClick={() => setOperation('hash')}
          variant="primary"
          className="w-full"
        >
          Generate Hash
        </Button>
      );
    }

    if (selectedAlgorithm.type === 'encode') {
      return (
        <div className="flex space-x-4">
          <Button
            onClick={() => setOperation('encode')}
            variant={operation === 'encode' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            Encode
          </Button>
          <Button
            onClick={() => setOperation('decode')}
            variant={operation === 'decode' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            Decode
          </Button>
        </div>
      );
    }

    return (
      <div className="flex space-x-4">
        <Button
          onClick={() => setOperation('encrypt')}
          variant={operation === 'encrypt' ? 'primary' : 'secondary'}
          className="flex-1"
        >
          Encrypt
        </Button>
        <Button
          onClick={() => setOperation('decrypt')}
          variant={operation === 'decrypt' ? 'primary' : 'secondary'}
          className="flex-1"
        >
          Decrypt
        </Button>
      </div>
    );
  };

  const getResultLabel = () => {
    if (!result || !selectedAlgorithm) return '';
    
    if ('hash' in result) {
      return `Hash generated using: ${selectedAlgorithm.name}`;
    }
    
    if (selectedAlgorithm.type === 'encode') {
      return `${operation === 'encode' ? 'Encoded' : 'Decoded'} using: ${selectedAlgorithm.name}`;
    }
    
    return `${operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} using: ${selectedAlgorithm.name}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Algorithm Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Select Algorithm</h2>
            
            <div className="space-y-2">
              {algorithmCategories.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);
                
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.algorithms.map((algorithm) => (
                          <button
                            key={algorithm.id}
                            onClick={() => selectAlgorithm(algorithm)}
                            className={`block w-full px-3 py-1.5 text-sm text-left rounded transition-colors ${
                              selectedAlgorithm?.id === algorithm.id
                                ? 'text-primary-400 bg-primary-600/20 border border-primary-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{algorithm.name}</span>
                              {algorithm.needsKey && <Key className="h-3 w-3" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Encryption & Decryption</h1>
              <p className="text-gray-400 text-lg">
                {selectedAlgorithm 
                  ? `Selected: ${selectedAlgorithm.name}`
                  : 'Select an algorithm from the sidebar to get started'
                }
              </p>
            </div>

            {selectedAlgorithm ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card>
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary-400" />
                    Input Configuration
                  </h2>

                  <div className="space-y-6">
                    {getOperationButtons()}

                    {/* Key Input */}
                    {selectedAlgorithm.needsKey && (
                      <div>
                        <Input
                          label="Key/Password"
                          value={key}
                          onChange={setKey}
                          placeholder={selectedAlgorithm.keyPlaceholder || 'Enter key'}
                          error={keyError}
                        />
                        {selectedAlgorithm.keyDescription && (
                          <p className="mt-1 text-xs text-gray-400">
                            {selectedAlgorithm.keyDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Algorithm Description */}
                    {selectedAlgorithm.keyDescription && !selectedAlgorithm.needsKey && (
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-300">
                          <strong>About:</strong> {selectedAlgorithm.keyDescription}
                        </p>
                      </div>
                    )}

                    <Textarea
                      label={`Text to ${operation === 'hash' ? 'hash' : operation}`}
                      value={inputText}
                      onChange={setInputText}
                      placeholder={`Enter text to ${operation === 'hash' ? 'hash' : operation}...`}
                      rows={6}
                    />

                    <Button
                      onClick={handleProcess}
                      loading={isProcessing}
                      disabled={!inputText || (selectedAlgorithm.needsKey && (!key || keyError))}
                      className="w-full"
                      size="lg"
                      icon={operation === 'encrypt' ? Lock : operation === 'hash' ? Lock : Unlock}
                    >
                      {operation === 'hash' ? 'Generate Hash' : 
                       operation === 'encode' ? 'Encode Text' :
                       operation === 'decode' ? 'Decode Text' :
                       operation === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
                    </Button>
                  </div>
                </Card>

                {/* Result Section */}
                <Card>
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Unlock className="h-5 w-5 mr-2 text-accent-400" />
                    Result
                  </h2>

                  {result ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {getResultLabel()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleCopy}
                            size="sm"
                            variant="secondary"
                            icon={Copy}
                          >
                            Copy
                          </Button>
                          <Button
                            onClick={handleDownload}
                            size="sm"
                            variant="secondary"
                            icon={Download}
                          >
                            Download
                          </Button>
                        </div>
                      </div>

                      {result.success ? (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
                            {'hash' in result ? result.hash : result.result}
                          </pre>
                        </div>
                      ) : (
                        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
                          <p className="text-red-400 text-sm">
                            <strong>Error:</strong> {result.error}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                        <Lock className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400">
                        Enter text and configure settings to see results
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <Card>
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-6">
                    <Lock className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Select an Algorithm</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Choose an encryption algorithm, cipher, encoding scheme, or hash function from the sidebar to get started.
                    Algorithms marked with a key icon require a key or password.
                  </p>
                </div>
              </Card>
            )}

            {/* Key Information Card */}
            {selectedAlgorithm && (
              <Card className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Algorithm Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-primary-400 mb-2">Key Requirements</h3>
                    {selectedAlgorithm.needsKey ? (
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• This algorithm requires a key or password</li>
                        <li>• {selectedAlgorithm.keyDescription}</li>
                        <li>• Key strength affects security level</li>
                        <li>• Use strong, unique keys for production</li>
                      </ul>
                    ) : (
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• This algorithm doesn't require a key</li>
                        <li>• {selectedAlgorithm.keyDescription}</li>
                        <li>• Operation is deterministic</li>
                        <li>• Same input always produces same output</li>
                      </ul>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-400 mb-2">Security Notes</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• All operations run locally in your browser</li>
                      <li>• No data is sent to external servers</li>
                      <li>• Keys and text are not stored permanently</li>
                      <li>• Use strong keys for sensitive data</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}