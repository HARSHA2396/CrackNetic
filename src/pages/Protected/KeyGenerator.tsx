import React, { useState, useEffect } from 'react';
import { Key, Download, Copy, Plus, Trash2, History, Save } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Input } from '../../components/UI/Input';
import { Header } from '../../components/Layout/Header';
import { KeyGenerator } from '../../utils/keyGenerator';
import { keyService, UserKey } from '../../lib/supabase';
import { CryptoKey } from '../../types/crypto';

const keyTypes = [
  { value: 'aes-128', label: 'AES-128' },
  { value: 'aes-192', label: 'AES-192' },
  { value: 'aes-256', label: 'AES-256' },
  { value: 'des', label: 'DES' },
  { value: 'rsa-1024', label: 'RSA-1024' },
  { value: 'rsa-2048', label: 'RSA-2048' },
  { value: 'rsa-4096', label: 'RSA-4096' },
];

const exportFormats = [
  { value: 'json', label: 'JSON' },
  { value: 'pem', label: 'PEM' },
  { value: 'raw', label: 'Raw' },
];

export function KeyGeneratorPage() {
  const [selectedKeyType, setSelectedKeyType] = useState('');
  const [customName, setCustomName] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<CryptoKey[]>([]);
  const [savedKeys, setSavedKeys] = useState<UserKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = async () => {
    try {
      const keys = await keyService.getUserKeys();
      setSavedKeys(keys);
    } catch (error) {
      console.error('Failed to load saved keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!selectedKeyType) return;

    setIsGenerating(true);
    
    // Simulate key generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let newKey: CryptoKey;

    switch (selectedKeyType) {
      case 'aes-128':
        newKey = KeyGenerator.generateAESKey(128);
        break;
      case 'aes-192':
        newKey = KeyGenerator.generateAESKey(192);
        break;
      case 'aes-256':
        newKey = KeyGenerator.generateAESKey(256);
        break;
      case 'des':
        newKey = KeyGenerator.generateDESKey();
        break;
      case 'rsa-1024':
        newKey = KeyGenerator.generateRSAKeyPair(1024);
        break;
      case 'rsa-2048':
        newKey = KeyGenerator.generateRSAKeyPair(2048);
        break;
      case 'rsa-4096':
        newKey = KeyGenerator.generateRSAKeyPair(4096);
        break;
      default:
        return;
    }

    if (customName) {
      newKey.name = customName;
    }

    setGeneratedKeys([newKey, ...generatedKeys]);
    setCustomName('');
    setSelectedKeyType('');
    setIsGenerating(false);
  };

  const handleSaveKey = async (key: CryptoKey) => {
    setIsSaving(true);
    try {
      await keyService.saveKey({
        name: key.name,
        key_type: key.type,
        key_size: key.size,
        public_key: key.publicKey || '',
        private_key: key.privateKey
      });
      
      // Remove from generated keys and reload saved keys
      setGeneratedKeys(generatedKeys.filter(k => k.id !== key.id));
      await loadSavedKeys();
    } catch (error) {
      console.error('Failed to save key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKey = (keyId: string) => {
    setGeneratedKeys(generatedKeys.filter(key => key.id !== keyId));
  };

  const handleDeleteSavedKey = async (keyId: string) => {
    try {
      await keyService.deleteKey(keyId);
      await loadSavedKeys();
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  };

  const handleCopyKey = (key: CryptoKey | UserKey, format: 'json' | 'pem' | 'raw' = 'raw') => {
    let exportedKey: string;
    
    if ('publicKey' in key) {
      // CryptoKey
      exportedKey = KeyGenerator.exportKey(key, format);
    } else {
      // UserKey
      if (format === 'json') {
        exportedKey = JSON.stringify(key, null, 2);
      } else if (format === 'pem') {
        exportedKey = `-----BEGIN ${key.key_type} PRIVATE KEY-----\n${key.private_key || key.public_key}\n-----END ${key.key_type} PRIVATE KEY-----`;
      } else {
        exportedKey = key.public_key;
      }
    }
    
    navigator.clipboard.writeText(exportedKey);
  };

  const handleDownloadKey = (key: CryptoKey | UserKey, format: 'json' | 'pem' | 'raw' = 'json') => {
    let exportedKey: string;
    let filename: string;
    
    if ('publicKey' in key) {
      // CryptoKey
      exportedKey = KeyGenerator.exportKey(key, format);
      filename = `${key.name.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    } else {
      // UserKey
      if (format === 'json') {
        exportedKey = JSON.stringify(key, null, 2);
      } else if (format === 'pem') {
        exportedKey = `-----BEGIN ${key.key_type} PRIVATE KEY-----\n${key.private_key || key.public_key}\n-----END ${key.key_type} PRIVATE KEY-----`;
      } else {
        exportedKey = key.public_key;
      }
      filename = `${key.name.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    }
    
    const blob = new Blob([exportedKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Key Generator</h1>
            <p className="text-gray-400 text-lg">
              Generate secure cryptographic keys for various algorithms
            </p>
          </div>

          {/* Key Generation Form */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-accent-400" />
              Generate New Key
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Key Type"
                value={selectedKeyType}
                onChange={setSelectedKeyType}
                options={keyTypes}
                placeholder="Select key type"
              />

              <Input
                label="Custom Name (Optional)"
                value={customName}
                onChange={setCustomName}
                placeholder="Enter custom key name"
              />

              <div className="flex items-end">
                <Button
                  onClick={handleGenerateKey}
                  loading={isGenerating}
                  disabled={!selectedKeyType}
                  className="w-full"
                  size="lg"
                  icon={Key}
                  variant="accent"
                >
                  Generate Key
                </Button>
              </div>
            </div>
          </Card>

          {/* Saved Keys */}
          {savedKeys.length > 0 && (
            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <History className="h-5 w-5 mr-2 text-primary-400" />
                Saved Keys ({savedKeys.length})
              </h2>

              <div className="space-y-4">
                {savedKeys.map((key) => (
                  <div key={key.id} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">{key.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>Type: <span className="text-accent-400">{key.key_type}</span></span>
                          <span>Size: <span className="text-accent-400">{key.key_size} bits</span></span>
                          <span>Created: <span className="text-accent-400">{new Date(key.created_at).toLocaleDateString()}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <Button
                          onClick={() => handleCopyKey(key)}
                          size="sm"
                          variant="secondary"
                          icon={Copy}
                        >
                          Copy
                        </Button>
                        <Button
                          onClick={() => handleDownloadKey(key)}
                          size="sm"
                          variant="secondary"
                          icon={Download}
                        >
                          Download
                        </Button>
                        <Button
                          onClick={() => handleDeleteSavedKey(key.id)}
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Public Key */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">
                            {key.key_type === 'RSA' ? 'Public Key' : 'Key'}
                          </label>
                          <div className="flex space-x-1">
                            {exportFormats.map(format => (
                              <Button
                                key={format.value}
                                onClick={() => handleCopyKey(key, format.value as any)}
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                              >
                                Copy {format.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded p-3">
                          <pre className="font-mono text-xs text-green-300 whitespace-pre-wrap break-all">
                            {key.public_key}
                          </pre>
                        </div>
                      </div>

                      {/* Private Key (for RSA) */}
                      {key.private_key && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">Private Key</label>
                            <div className="flex space-x-1">
                              {exportFormats.map(format => (
                                <Button
                                  key={format.value}
                                  onClick={() => handleDownloadKey(key, format.value as any)}
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  Save {format.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-800 rounded p-3">
                            <pre className="font-mono text-xs text-red-300 whitespace-pre-wrap break-all">
                              {key.private_key}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Generated Keys List */}
          {generatedKeys.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Key className="h-5 w-5 mr-2 text-accent-400" />
                Generated Keys ({generatedKeys.length})
              </h2>

              <div className="space-y-4">
                {generatedKeys.map((key) => (
                  <div key={key.id} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">{key.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>Type: <span className="text-accent-400">{key.type}</span></span>
                          <span>Size: <span className="text-accent-400">{key.size} bits</span></span>
                          <span>Created: <span className="text-accent-400">{key.createdAt.toLocaleDateString()}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <Button
                          onClick={() => handleSaveKey(key)}
                          loading={isSaving}
                          size="sm"
                          variant="accent"
                          icon={Save}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => handleCopyKey(key)}
                          size="sm"
                          variant="secondary"
                          icon={Copy}
                        >
                          Copy
                        </Button>
                        <Button
                          onClick={() => handleDownloadKey(key)}
                          size="sm"
                          variant="secondary"
                          icon={Download}
                        >
                          Download
                        </Button>
                        <Button
                          onClick={() => handleDeleteKey(key.id)}
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Public Key */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">
                            {key.type === 'RSA' ? 'Public Key' : 'Key'}
                          </label>
                          <div className="flex space-x-1">
                            {exportFormats.map(format => (
                              <Button
                                key={format.value}
                                onClick={() => handleCopyKey(key, format.value as any)}
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                              >
                                Copy {format.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded p-3">
                          <pre className="font-mono text-xs text-green-300 whitespace-pre-wrap break-all">
                            {key.publicKey}
                          </pre>
                        </div>
                      </div>

                      {/* Private Key (for RSA) */}
                      {key.privateKey && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">Private Key</label>
                            <div className="flex space-x-1">
                              {exportFormats.map(format => (
                                <Button
                                  key={format.value}
                                  onClick={() => handleDownloadKey(key, format.value as any)}
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  Save {format.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-800 rounded p-3">
                            <pre className="font-mono text-xs text-red-300 whitespace-pre-wrap break-all">
                              {key.privateKey}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* No Keys Message */}
          {generatedKeys.length === 0 && savedKeys.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                  <Key className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Keys Generated</h3>
                <p className="text-gray-400">
                  Generate your first cryptographic key using the form above
                </p>
              </div>
            </Card>
          )}

          {/* Security Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Security Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Key Security</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Keys are generated using cryptographically secure random sources</li>
                  <li>• All keys are generated locally in your browser</li>
                  <li>• Saved keys are stored securely in your account</li>
                  <li>• Download and backup keys for future use</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-accent-400 mb-2">Best Practices</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Use AES-256 for symmetric encryption</li>
                  <li>• Use RSA-2048 or higher for asymmetric encryption</li>
                  <li>• Store private keys securely and never share them</li>
                  <li>• Generate new keys regularly for enhanced security</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}