import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Eye, EyeOff, Settings, Info, Save, History } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Textarea } from '../../components/UI/Textarea';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Header } from '../../components/Layout/Header';
import { OptimizedSteganography } from '../../utils/optimizedSteganography';
import { steganographyService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const methodOptions = [
  { value: 'lsb', label: 'LSB (Least Significant Bit)' },
  { value: 'advanced-lsb', label: 'Advanced LSB (Multi-bit)' },
  { value: 'spread-spectrum', label: 'Spread Spectrum' }
];

const bitsPerChannelOptions = [
  { value: '1', label: '1 bit per channel' },
  { value: '2', label: '2 bits per channel' },
  { value: '3', label: '3 bits per channel' },
  { value: '4', label: '4 bits per channel' }
];

export function EnhancedSteganographyPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'hide' | 'extract'>('hide');
  const [method, setMethod] = useState('lsb');
  const [bitsPerChannel, setBitsPerChannel] = useState('1');
  const [password, setPassword] = useState('');
  const [spreadSpectrumKey, setSpreadSpectrumKey] = useState('');
  const [textToHide, setTextToHide] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageName, setOriginalImageName] = useState('');
  const [steganographicImage, setSteganographicImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setError('');
        setOriginalImageName(file.name);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = e.target?.result as string;
          setOriginalImage(imageUrl);
          setSteganographicImage(null);
          setExtractedText('');
          
          // Analyze image
          try {
            const imageData = await OptimizedSteganography.createImageFromFile(file);
            const analysis = OptimizedSteganography.analyzeImage(imageData);
            setImageAnalysis(analysis);
          } catch (error) {
            console.error('Image analysis failed:', error);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setError('Failed to load image');
      }
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleHideText = async () => {
    if (!originalImage || !textToHide) return;

    setIsProcessing(true);
    setError('');
    setProgress(0);
    
    try {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) throw new Error('Failed to get image data');

          let stegoImageData: ImageData;

          switch (method) {
            case 'lsb':
              stegoImageData = await OptimizedSteganography.hideTextInImageOptimized(
                imageData,
                textToHide, 
                password || undefined,
                setProgress
              );
              break;
            case 'advanced-lsb':
              stegoImageData = await OptimizedSteganography.hideTextInImageAdvancedOptimized(
                imageData,
                textToHide, 
                parseInt(bitsPerChannel),
                password || undefined,
                setProgress
              );
              break;
            case 'spread-spectrum':
              stegoImageData = await OptimizedSteganography.hideTextInImageSpreadSpectrumOptimized(
                imageData,
                textToHide, 
                spreadSpectrumKey || 'defaultkey',
                setProgress
              );
              break;
            default:
              throw new Error('Unknown steganography method');
          }

          const stegoDataUrl = OptimizedSteganography.imageDataToDataURL(stegoImageData);
          setSteganographicImage(stegoDataUrl);

          // Save to database if user is logged in
          if (user) {
            try {
              await steganographyService.saveSteganography({
                operation: 'hide',
                method,
                text_hidden: textToHide,
                image_name: originalImageName
              });
            } catch (dbError) {
              console.error('Failed to save to database:', dbError);
            }
          }
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setIsProcessing(false);
          setProgress(0);
        }
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
        setProgress(0);
      };
      img.src = originalImage;
    } catch (error) {
      setError('Error processing image');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleExtractText = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError('');
    setProgress(0);
    
    try {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) throw new Error('Failed to get image data');

          let extractedMessage: string;

          switch (method) {
            case 'lsb':
              extractedMessage = await OptimizedSteganography.extractTextFromImageOptimized(
                imageData,
                password || undefined,
                setProgress
              );
              break;
            case 'advanced-lsb':
              // For advanced LSB extraction, we need the same method as encoding
              extractedMessage = await OptimizedSteganography.extractTextFromImageOptimized(
                imageData,
                password || undefined,
                setProgress
              );
              break;
            case 'spread-spectrum':
              // For spread spectrum, we need the same key
              extractedMessage = await OptimizedSteganography.extractTextFromImageOptimized(
                imageData,
                undefined,
                setProgress
              );
              break;
            default:
              throw new Error('Unknown steganography method');
          }

          setExtractedText(extractedMessage || 'No hidden text found');

          // Save to database if user is logged in
          if (user && extractedMessage) {
            try {
              await steganographyService.saveSteganography({
                operation: 'extract',
                method,
                text_extracted: extractedMessage,
                image_name: originalImageName
              });
            } catch (dbError) {
              console.error('Failed to save to database:', dbError);
            }
          }
        } catch (error) {
          setExtractedText(`Error: ${(error as Error).message}`);
        } finally {
          setIsProcessing(false);
          setProgress(0);
        }
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
        setProgress(0);
      };
      img.src = originalImage;
    } catch (error) {
      setError('Error processing image');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    if (steganographicImage) {
      try {
        const response = await fetch(steganographicImage);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `steganographic-image-${method}.png`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        setError('Failed to download image');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Enhanced Steganography</h1>
            <p className="text-gray-400 text-lg">
              Advanced image steganography with multiple methods and optimized performance
            </p>
          </div>

          {/* Mode and Method Selection */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-green-400" />
              Configuration
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setMode('hide')}
                    variant={mode === 'hide' ? 'primary' : 'secondary'}
                    icon={EyeOff}
                  >
                    Hide Text
                  </Button>
                  <Button
                    onClick={() => setMode('extract')}
                    variant={mode === 'extract' ? 'primary' : 'secondary'}
                    icon={Eye}
                  >
                    Extract Text
                  </Button>
                </div>

                <Select
                  label="Steganography Method"
                  value={method}
                  onChange={setMethod}
                  options={methodOptions}
                />

                {method === 'advanced-lsb' && (
                  <Select
                    label="Bits per Channel"
                    value={bitsPerChannel}
                    onChange={setBitsPerChannel}
                    options={bitsPerChannelOptions}
                  />
                )}

                {method === 'spread-spectrum' && (
                  <Input
                    label="Spread Spectrum Key"
                    value={spreadSpectrumKey}
                    onChange={setSpreadSpectrumKey}
                    placeholder="Enter key for spread spectrum method"
                  />
                )}

                <Input
                  label="Password (Optional)"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Optional password for encryption"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Method Information</h3>
                <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-300">
                  {method === 'lsb' && (
                    <ul className="space-y-1">
                      <li>• Modifies least significant bit of each pixel</li>
                      <li>• Invisible changes to human eye</li>
                      <li>• Good capacity and security balance</li>
                      <li>• Optimized for large images</li>
                    </ul>
                  )}
                  {method === 'advanced-lsb' && (
                    <ul className="space-y-1">
                      <li>• Uses multiple bits per color channel</li>
                      <li>• Higher capacity than standard LSB</li>
                      <li>• Slight quality reduction with more bits</li>
                      <li>• Configurable bit depth (1-4 bits)</li>
                    </ul>
                  )}
                  {method === 'spread-spectrum' && (
                    <ul className="space-y-1">
                      <li>• Spreads data across random pixels</li>
                      <li>• Requires key for extraction</li>
                      <li>• More secure against detection</li>
                      <li>• Resistant to image modifications</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isProcessing && (
              <div className="mt-4">
                <ProgressBar progress={progress} />
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Processing image... {Math.round(progress)}% complete
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-green-400" />
                {mode === 'hide' ? 'Hide Text in Image' : 'Extract Text from Image'}
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
                        <p className="text-sm text-gray-400 mb-2">{originalImageName}</p>
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

                {/* Image Analysis */}
                {imageAnalysis && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Image Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div>Dimensions: {imageAnalysis.width} × {imageAnalysis.height}</div>
                      <div>Pixels: {imageAnalysis.totalPixels.toLocaleString()}</div>
                      <div>Capacity: {imageAnalysis.capacity} characters</div>
                      <div>
                        Avg Color: RGB({imageAnalysis.averageColor.r}, {imageAnalysis.averageColor.g}, {imageAnalysis.averageColor.b})
                      </div>
                    </div>
                  </div>
                )}

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
                    <Button
                      onClick={() => navigator.clipboard.writeText(steganographicImage)}
                      variant="secondary"
                    >
                      Copy Data URL
                    </Button>
                  </div>
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                    <p className="text-green-400 text-sm">
                      <strong>Success:</strong> Text has been hidden using {method.toUpperCase()} method. 
                      The image looks identical but contains your secret message.
                      {user && <span className="block mt-1">Operation saved to your history.</span>}
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
                  {extractedText !== 'No hidden text found' && !extractedText.startsWith('Error:') && (
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => navigator.clipboard.writeText(extractedText)}
                        size="sm"
                        variant="secondary"
                      >
                        Copy Text
                      </Button>
                      <Button
                        onClick={() => {
                          const blob = new Blob([extractedText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'extracted-text.txt';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        size="sm"
                        variant="secondary"
                        icon={Download}
                      >
                        Download as File
                      </Button>
                    </div>
                  )}
                  {user && extractedText !== 'No hidden text found' && !extractedText.startsWith('Error:') && (
                    <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                      <p className="text-blue-400 text-sm">
                        <Save className="inline h-4 w-4 mr-1" />
                        Operation saved to your history.
                      </p>
                    </div>
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

          {/* Performance Information */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Optimizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Chunked Processing</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Processes large images in small chunks</li>
                  <li>• Prevents browser freezing and timeouts</li>
                  <li>• Real-time progress updates</li>
                  <li>• Handles images up to 50MB efficiently</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary-400 mb-2">Database Integration</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Automatic operation history for logged-in users</li>
                  <li>• Secure storage of steganography records</li>
                  <li>• Track hidden and extracted text</li>
                  <li>• Method and image name tracking</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <h2 className="text-xl font-semibold text-white mb-4">Steganography Methods</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">LSB (Least Significant Bit)</h3>
                  <p className="text-sm text-gray-400">
                    The most common method that modifies the least significant bit of each color channel.
                    Provides good balance between capacity and invisibility.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">Advanced LSB</h3>
                  <p className="text-sm text-gray-400">
                    Uses multiple bits per channel for higher capacity. More bits mean more data but
                    slightly more visible changes to the image.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-2">Spread Spectrum</h3>
                  <p className="text-sm text-gray-400">
                    Distributes data across random pixels using a key. More secure and resistant to
                    detection but requires the same key for extraction.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-white mb-4">Security Features</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-accent-400 mb-2">Password Protection</h3>
                  <p className="text-sm text-gray-400">
                    Optional password encryption adds an extra layer of security. Text is encrypted
                    before hiding and decrypted after extraction.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-accent-400 mb-2">Capacity Analysis</h3>
                  <p className="text-sm text-gray-400">
                    Automatic calculation of image capacity helps determine how much text can be hidden
                    based on image size and selected method.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-accent-400 mb-2">Error Detection</h3>
                  <p className="text-sm text-gray-400">
                    Built-in end markers and error handling ensure reliable text extraction and
                    detect corrupted or missing data.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}