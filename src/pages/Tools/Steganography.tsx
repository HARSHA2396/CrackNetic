import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Eye, EyeOff } from 'lucide-react';
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
      // Convert image URL to ImageData
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Steganography</h1>
            <p className="text-gray-400 text-lg">
              Hide secret messages within images or extract hidden text
            </p>
          </div>

          {/* Mode Selection */}
          <Card className="mb-8">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setMode('hide')}
                variant={mode === 'hide' ? 'primary' : 'secondary'}
                icon={EyeOff}
              >
                Hide Text in Image
              </Button>
              <Button
                onClick={() => setMode('extract')}
                variant={mode === 'extract' ? 'primary' : 'secondary'}
                icon={Eye}
              >
                Extract Text from Image
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-green-400" />
                {mode === 'hide' ? 'Hide Text' : 'Extract Text'}
              </h2>

              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
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
                          className="max-w-full max-h-48 mx-auto mb-4 rounded"
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
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="secondary"
                          icon={Upload}
                        >
                          Choose Image
                        </Button>
                        <p className="text-sm text-gray-400 mt-2">
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
                  />
                )}

                {/* Action Button */}
                <Button
                  onClick={mode === 'hide' ? handleHideText : handleExtractText}
                  loading={isProcessing}
                  disabled={!originalImage || (mode === 'hide' && !textToHide)}
                  className="w-full"
                  size="lg"
                  icon={mode === 'hide' ? EyeOff : Eye}
                >
                  {mode === 'hide' ? 'Hide Text in Image' : 'Extract Hidden Text'}
                </Button>
              </div>
            </Card>

            {/* Result Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-accent-400" />
                Result
              </h2>

              {mode === 'hide' && steganographicImage ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={steganographicImage}
                      alt="Steganographic"
                      className="max-w-full max-h-64 mx-auto rounded"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={handleDownload}
                      icon={Download}
                      variant="accent"
                    >
                      Download Image
                    </Button>
                  </div>
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                    <p className="text-green-400 text-sm">
                      <strong>Success:</strong> Text has been hidden in the image. 
                      The image looks identical but contains your secret message.
                    </p>
                  </div>
                </div>
              ) : mode === 'extract' && extractedText ? (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Extracted Text:</h3>
                    <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">
                      {extractedText}
                    </pre>
                  </div>
                  {extractedText !== 'No hidden text found' && extractedText !== 'Error extracting text' && (
                    <Button
                      onClick={() => navigator.clipboard.writeText(extractedText)}
                      size="sm"
                      variant="secondary"
                    >
                      Copy Text
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                    {mode === 'hide' ? (
                      <EyeOff className="h-8 w-8 text-gray-400" />
                    ) : (
                      <Eye className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
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
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">How Steganography Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">LSB Method</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Modifies the least significant bit of each pixel</li>
                  <li>• Changes are invisible to the human eye</li>
                  <li>• Each character requires 8 pixels (RGB channels)</li>
                  <li>• Includes end marker for proper extraction</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Security Features</h3>
                <ul className="text-sm text-gray-400 space-y-1">
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
    </div>
  );
}