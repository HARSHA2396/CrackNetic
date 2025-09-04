import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Textarea } from '../../components/UI/Textarea';
import { Header } from '../../components/Layout/Header';
import { Steganography } from '../../utils/steganography';

export function SteganographyPage() {
  const [mode, setMode] = useState<'hide' | 'extract'>('hide');
  const [textToHide, setTextToHide] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [steganographicImage, setSteganographicImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setOriginalImage(imageUrl);
        setSteganographicImage(null);
        setExtractedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHideText = async () => {
    if (!originalImage || !textToHide) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const stegoImageData = Steganography.hideTextInImage(imageData, textToHide);
          const stegoDataUrl = Steganography.imageDataToDataURL(stegoImageData);
          setSteganographicImage(stegoDataUrl);
        }
        setIsProcessing(false);
      };
      img.src = originalImage;
    } catch (error) {
      console.error('Error hiding text:', error);
      setIsProcessing(false);
    }
  };

  const handleExtractText = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const extractedMessage = Steganography.extractTextFromImage(imageData);
          setExtractedText(extractedMessage || 'No hidden text found');
        }
        setIsProcessing(false);
      };
      img.src = originalImage;
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedText('Error extracting text');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (steganographicImage) {
      const a = document.createElement('a');
      a.href = steganographicImage;
      a.download = 'steganographic-image.png';
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <ImageIcon className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Steganography
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hide secret messages within images or extract hidden text
          </p>
        </div>

        {/* Mode Selection */}
        <Card variant="glass" className="mb-8">
          <div className="flex justify-center">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <Button
                onClick={() => setMode('hide')}
                variant={mode === 'hide' ? 'primary' : 'secondary'}
                icon={EyeOff}
                className={`${mode === 'hide' ? '' : 'bg-transparent hover:bg-white/10'}`}
              >
                Hide Text in Image
              </Button>
              <Button
                onClick={() => setMode('extract')}
                variant={mode === 'extract' ? 'primary' : 'secondary'}
                icon={Eye}
                className={`${mode === 'extract' ? '' : 'bg-transparent hover:bg-white/10'}`}
              >
                Extract Text from Image
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                {mode === 'hide' ? 'Hide Text' : 'Extract Text'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/30 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {originalImage ? (
                    <div>
                      <img
                        src={originalImage}
                        alt="Original"
                        className="max-w-full max-h-48 mx-auto mb-4 rounded-xl"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="secondary"
                        size="sm"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="secondary"
                        icon={Upload}
                        size="lg"
                      >
                        Choose Image
                      </Button>
                      <p className="text-sm text-gray-400 mt-4">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Input for Hide Mode */}
              {mode === 'hide' && (
                <Textarea
                  label="Text to Hide"
                  value={textToHide}
                  onChange={setTextToHide}
                  placeholder="Enter the secret message to hide..."
                  rows={4}
                  required
                />
              )}

              {/* Action Button */}
              <Button
                onClick={mode === 'hide' ? handleHideText : handleExtractText}
                loading={isProcessing}
                disabled={!originalImage || (mode === 'hide' && !textToHide)}
                fullWidth
                size="lg"
                icon={mode === 'hide' ? EyeOff : Eye}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {mode === 'hide' ? 'Hide Text in Image' : 'Extract Hidden Text'}
              </Button>
            </div>
          </Card>

          {/* Result Section */}
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Result</h2>
            </div>

            {mode === 'hide' && steganographicImage ? (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src={steganographicImage}
                    alt="Steganographic"
                    className="max-w-full max-h-64 mx-auto rounded-xl"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleDownload}
                    icon={Download}
                    variant="accent"
                    size="lg"
                  >
                    Download Image
                  </Button>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 text-sm">
                    <strong>Success:</strong> Text has been hidden in the image. 
                    The image looks identical but contains your secret message.
                  </p>
                </div>
              </div>
            ) : mode === 'extract' && extractedText ? (
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Extracted Text:</h3>
                  <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">
                    {extractedText}
                  </pre>
                </div>
                {extractedText !== 'No hidden text found' && extractedText !== 'Error extracting text' && (
                  <Button
                    onClick={() => navigator.clipboard.writeText(extractedText)}
                    size="sm"
                    variant="secondary"
                    fullWidth
                  >
                    Copy Text
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6 border border-white/10">
                  {mode === 'hide' ? (
                    <EyeOff className="h-10 w-10 text-gray-400" />
                  ) : (
                    <Eye className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Process</h3>
                <p className="text-gray-400">
                  {mode === 'hide' 
                    ? 'Upload an image and enter text to hide'
                    : 'Upload an image to extract hidden text'
                  }
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Information Card */}
        <Card variant="gradient" className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">How Steganography Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-green-400 mb-4">LSB Method</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Modifies the least significant bit of each pixel</li>
                <li>• Changes are invisible to the human eye</li>
                <li>• Each character requires 8 pixels (RGB channels)</li>
                <li>• Includes end marker for proper extraction</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-cyan-400 mb-4">Security Features</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Hidden text is not visible in normal viewing</li>
                <li>• File size remains virtually unchanged</li>
                <li>• Works with PNG, JPG, and other formats</li>
                <li>• Can hide up to image capacity ÷ 8 characters</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}