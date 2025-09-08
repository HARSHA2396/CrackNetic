import React, { useState, useEffect } from 'react';
import { Binary, Copy, Download, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { encodeTextEnhanced, decodeTextEnhanced } from '../../utils/enhancedEncodingAlgorithms';
import { EncodingResult } from '../../types/crypto';

const encodingCategories = [
  {
    name: 'Base Encodings',
    algorithms: [
      { value: 'base64', label: 'Base64' },
      { value: 'base32', label: 'Base32' },
      { value: 'base58', label: 'Base58' },
      { value: 'base85', label: 'Base85 (ASCII85)' },
      { value: 'base91', label: 'Base91' },
    ]
  },
  {
    name: 'Number Systems',
    algorithms: [
      { value: 'hex', label: 'Hexadecimal' },
      { value: 'binary', label: 'Binary' },
      { value: 'octal', label: 'Octal' },
      { value: 'ascii', label: 'ASCII Converter' },
    ]
  },
  {
    name: 'Web Encodings',
    algorithms: [
      { value: 'url', label: 'URL Encoding' },
      { value: 'html', label: 'HTML Entities' },
      { value: 'punycode', label: 'Punycode' },
      { value: 'quoted-printable', label: 'Quoted-Printable' },
      { value: 'uuencode', label: 'UUEncoding' },
    ]
  }
];

const allEncodingAlgorithms = encodingCategories.flatMap(cat => cat.algorithms);

export function EncodingPage() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [result, setResult] = useState<EncodingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmParam = urlParams.get('algorithm');
    if (algorithmParam && allEncodingAlgorithms.find(alg => alg.value === algorithmParam)) {
      setAlgorithm(algorithmParam);
      const category = encodingCategories.find(cat => 
        cat.algorithms.some(alg => alg.value === algorithmParam)
      );
      if (category) {
        setSelectedCategory(category.name);
      }
    }
  }, []);

  const handleProcess = async () => {
    if (!inputText || !algorithm) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const processResult = operation === 'encode' 
      ? encodeTextEnhanced(inputText, algorithm)
      : decodeTextEnhanced(inputText, algorithm);
    
    setResult(processResult);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (result?.result) {
      navigator.clipboard.writeText(result.result);
    }
  };

  const handleDownload = () => {
    if (result?.result) {
      const blob = new Blob([result.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${operation}-result.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredAlgorithms = selectedCategory 
    ? encodingCategories.find(cat => cat.name === selectedCategory)?.algorithms || []
    : allEncodingAlgorithms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Binary className="h-12 w-12 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Encoding & Decoding
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Convert text between 14+ different encoding formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-indigo-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Operation Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <Button
                  onClick={() => setOperation('encode')}
                  variant={operation === 'encode' ? 'primary' : 'secondary'}
                  className={`flex-1 ${operation === 'encode' ? '' : 'bg-transparent hover:bg-white/10'}`}
                >
                  Encode
                </Button>
                <Button
                  onClick={() => setOperation('decode')}
                  variant={operation === 'decode' ? 'primary' : 'secondary'}
                  className={`flex-1 ${operation === 'decode' ? '' : 'bg-transparent hover:bg-white/10'}`}
                >
                  Decode
                </Button>
              </div>

              <Select
                label="Encoding Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: '', label: 'All Encodings (14+)' },
                  ...encodingCategories.map(cat => ({ value: cat.name, label: cat.name }))
                ]}
                placeholder="Select a category to filter encodings"
              />

              <Select
                label="Encoding Format"
                value={algorithm}
                onChange={setAlgorithm}
                options={filteredAlgorithms}
                placeholder={`Select from ${filteredAlgorithms.length} available formats`}
                required
              />

              <Textarea
                label={`Text to ${operation}`}
                value={inputText}
                onChange={setInputText}
                placeholder={`Enter text to ${operation}...`}
                rows={8}
                required
              />

              <Button
                onClick={handleProcess}
                loading={isProcessing}
                disabled={!inputText || !algorithm}
                fullWidth
                size="lg"
                icon={Binary}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
              >
                {operation === 'encode' ? 'Encode' : 'Decode'} Text
              </Button>
            </div>
          </Card>

          {/* Result Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Result</h2>
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Format: <span className="text-white font-medium">{result.algorithm.toUpperCase()}</span>
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
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
                    <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">
                      {result.result}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">
                      <strong>Error:</strong> {result.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6 border border-white/10">
                  <Binary className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Process</h3>
                <p className="text-gray-400">
                  Select an encoding format and enter text to see results
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Encoding Information */}
        <Card variant="gradient" className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Encoding Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {encodingCategories.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-4">{category.name}</h3>
                <div className="space-y-2">
                  {category.algorithms.map((alg) => (
                    <div key={alg.value} className="text-sm text-gray-400 flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                      {alg.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}