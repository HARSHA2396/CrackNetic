export class OptimizedSteganography {
  // Optimized LSB Steganography with chunked processing
  static async hideTextInImageOptimized(
    imageData: ImageData, 
    text: string, 
    password?: string,
    onProgress?: (progress: number) => void
  ): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      try {
        let processedText = text;
        
        // Optional encryption before hiding
        if (password) {
          processedText = this.simpleEncrypt(text, password);
        }
        
        const binaryText = processedText.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110'; // End marker
        
        if (binaryText.length > imageData.data.length / 4 * 3) {
          throw new Error('Text too long for image capacity');
        }
        
        const newData = new Uint8ClampedArray(imageData.data);
        let binaryIndex = 0;
        
        // Process in chunks to prevent blocking
        const chunkSize = 5000; // Process 5k pixels at a time
        let pixelIndex = 0;
        
        const processChunk = () => {
          const endIndex = Math.min(pixelIndex + chunkSize * 4, newData.length);
          
          for (let i = pixelIndex; i < endIndex && binaryIndex < binaryText.length; i += 4) {
            // Modify the least significant bit of each color channel (R, G, B)
            for (let channel = 0; channel < 3 && binaryIndex < binaryText.length; channel++) {
              const bit = parseInt(binaryText[binaryIndex]);
              newData[i + channel] = (newData[i + channel] & 0xFE) | bit;
              binaryIndex++;
            }
          }
          
          pixelIndex = endIndex;
          
          // Update progress
          if (onProgress) {
            const progress = Math.min(100, (pixelIndex / newData.length) * 100);
            onProgress(progress);
          }
          
          if (pixelIndex < newData.length && binaryIndex < binaryText.length) {
            // Continue processing in next frame
            setTimeout(processChunk, 1);
          } else {
            // Processing complete
            resolve(new ImageData(newData, imageData.width, imageData.height));
          }
        };
        
        processChunk();
      } catch (error) {
        reject(new Error(`Steganography encoding failed: ${(error as Error).message}`));
      }
    });
  }
  
  static async extractTextFromImageOptimized(
    imageData: ImageData, 
    password?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        let binaryText = '';
        const endMarker = '1111111111111110';
        
        // Process in chunks to prevent blocking
        const chunkSize = 5000; // Process 5k pixels at a time
        let pixelIndex = 0;
        
        const processChunk = () => {
          const endIndex = Math.min(pixelIndex + chunkSize * 4, imageData.data.length);
          
          for (let i = pixelIndex; i < endIndex; i += 4) {
            // Extract the least significant bit from each color channel (R, G, B)
            for (let channel = 0; channel < 3; channel++) {
              const bit = imageData.data[i + channel] & 1;
              binaryText += bit.toString();
              
              // Check for end marker
              if (binaryText.endsWith(endMarker)) {
                const textBinary = binaryText.slice(0, -endMarker.length);
                let extractedText = textBinary.match(/.{8}/g)?.map(byte => 
                  String.fromCharCode(parseInt(byte, 2))
                ).join('') || '';
                
                // Optional decryption after extraction
                if (password && extractedText) {
                  try {
                    extractedText = this.simpleDecrypt(extractedText, password);
                  } catch {
                    reject(new Error('Invalid password or corrupted data'));
                    return;
                  }
                }
                
                resolve(extractedText);
                return;
              }
            }
          }
          
          pixelIndex = endIndex;
          
          // Update progress
          if (onProgress) {
            const progress = Math.min(100, (pixelIndex / imageData.data.length) * 100);
            onProgress(progress);
          }
          
          if (pixelIndex < imageData.data.length) {
            // Continue processing in next frame
            setTimeout(processChunk, 1);
          } else {
            // Processing complete, no text found
            resolve('');
          }
        };
        
        processChunk();
      } catch (error) {
        reject(new Error(`Steganography decoding failed: ${(error as Error).message}`));
      }
    });
  }

  // Advanced LSB with chunked processing
  static async hideTextInImageAdvancedOptimized(
    imageData: ImageData, 
    text: string, 
    bitsPerChannel: number = 1,
    password?: string,
    onProgress?: (progress: number) => void
  ): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      try {
        if (bitsPerChannel < 1 || bitsPerChannel > 4) {
          throw new Error('Bits per channel must be between 1 and 4');
        }
        
        let processedText = text;
        if (password) {
          processedText = this.simpleEncrypt(text, password);
        }
        
        const binaryText = processedText.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110';
        
        const capacity = imageData.data.length / 4 * 3 * bitsPerChannel;
        if (binaryText.length > capacity) {
          throw new Error(`Text too long for image capacity with ${bitsPerChannel} bits per channel`);
        }
        
        const newData = new Uint8ClampedArray(imageData.data);
        let binaryIndex = 0;
        
        // Process in chunks
        const chunkSize = 2500; // Smaller chunks for advanced processing
        let pixelIndex = 0;
        
        const processChunk = () => {
          const endIndex = Math.min(pixelIndex + chunkSize * 4, newData.length);
          
          for (let i = pixelIndex; i < endIndex && binaryIndex < binaryText.length; i += 4) {
            for (let channel = 0; channel < 3 && binaryIndex < binaryText.length; channel++) {
              let channelValue = newData[i + channel];
              
              // Clear the least significant bits
              channelValue &= (0xFF << bitsPerChannel);
              
              // Set the new bits
              let newBits = 0;
              for (let bit = 0; bit < bitsPerChannel && binaryIndex < binaryText.length; bit++) {
                newBits |= (parseInt(binaryText[binaryIndex]) << bit);
                binaryIndex++;
              }
              
              newData[i + channel] = channelValue | newBits;
            }
          }
          
          pixelIndex = endIndex;
          
          // Update progress
          if (onProgress) {
            const progress = Math.min(100, (pixelIndex / newData.length) * 100);
            onProgress(progress);
          }
          
          if (pixelIndex < newData.length && binaryIndex < binaryText.length) {
            setTimeout(processChunk, 1);
          } else {
            resolve(new ImageData(newData, imageData.width, imageData.height));
          }
        };
        
        processChunk();
      } catch (error) {
        reject(new Error(`Advanced steganography encoding failed: ${(error as Error).message}`));
      }
    });
  }

  // Spread spectrum with chunked processing
  static async hideTextInImageSpreadSpectrumOptimized(
    imageData: ImageData, 
    text: string, 
    key: string,
    onProgress?: (progress: number) => void
  ): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      try {
        const pseudoRandomSequence = this.generatePseudoRandomSequence(key, imageData.data.length / 4);
        const binaryText = text.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110';
        
        const newData = new Uint8ClampedArray(imageData.data);
        let binaryIndex = 0;
        
        // Process in chunks
        const chunkSize = 2500;
        let sequenceIndex = 0;
        
        const processChunk = () => {
          const endIndex = Math.min(sequenceIndex + chunkSize, pseudoRandomSequence.length);
          
          for (let i = sequenceIndex; i < endIndex && binaryIndex < binaryText.length; i++) {
            const pixelIndex = pseudoRandomSequence[i] * 4;
            const channel = i % 3; // R, G, or B
            
            if (pixelIndex + channel < newData.length) {
              const bit = parseInt(binaryText[binaryIndex]);
              newData[pixelIndex + channel] = (newData[pixelIndex + channel] & 0xFE) | bit;
              binaryIndex++;
            }
          }
          
          sequenceIndex = endIndex;
          
          // Update progress
          if (onProgress) {
            const progress = Math.min(100, (sequenceIndex / pseudoRandomSequence.length) * 100);
            onProgress(progress);
          }
          
          if (sequenceIndex < pseudoRandomSequence.length && binaryIndex < binaryText.length) {
            setTimeout(processChunk, 1);
          } else {
            resolve(new ImageData(newData, imageData.width, imageData.height));
          }
        };
        
        processChunk();
      } catch (error) {
        reject(new Error(`Spread spectrum steganography failed: ${(error as Error).message}`));
      }
    });
  }

  // Helper methods (same as before but static)
  private static simpleEncrypt(text: string, password: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = password.charCodeAt(i % password.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
  }
  
  private static simpleDecrypt(text: string, password: string): string {
    return this.simpleEncrypt(text, password); // XOR is its own inverse
  }
  
  private static generatePseudoRandomSequence(seed: string, length: number): number[] {
    const sequence: number[] = [];
    let hash = 0;
    
    // Simple hash function for seed
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff;
    }
    
    // Linear congruential generator
    let current = Math.abs(hash);
    for (let i = 0; i < length; i++) {
      current = (current * 1664525 + 1013904223) % 4294967296;
      sequence.push(Math.floor((current / 4294967296) * length));
    }
    
    return sequence;
  }

  // Utility methods
  static calculateCapacity(imageData: ImageData, bitsPerChannel: number = 1): number {
    return Math.floor((imageData.data.length / 4 * 3 * bitsPerChannel - 16) / 8); // -16 for end marker
  }
  
  static analyzeImage(imageData: ImageData): {
    width: number;
    height: number;
    totalPixels: number;
    capacity: number;
    averageColor: { r: number; g: number; b: number };
  } {
    const totalPixels = imageData.width * imageData.height;
    const capacity = this.calculateCapacity(imageData);
    
    let totalR = 0, totalG = 0, totalB = 0;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      totalR += imageData.data[i];
      totalG += imageData.data[i + 1];
      totalB += imageData.data[i + 2];
    }
    
    return {
      width: imageData.width,
      height: imageData.height,
      totalPixels,
      capacity,
      averageColor: {
        r: Math.round(totalR / totalPixels),
        g: Math.round(totalG / totalPixels),
        b: Math.round(totalB / totalPixels)
      }
    };
  }
  
  static createImageFromFile(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          resolve(imageData);
        } else {
          reject(new Error('Failed to get image data'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  static imageDataToDataURL(imageData: ImageData, format: string = 'image/png'): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx?.putImageData(imageData, 0, 0);
    return canvas.toDataURL(format);
  }
}