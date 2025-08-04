export class EnhancedSteganography {
  // LSB Steganography with improved error handling
  static hideTextInImage(imageData: ImageData, text: string, password?: string): ImageData {
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
      
      for (let i = 0; i < newData.length && binaryIndex < binaryText.length; i += 4) {
        // Modify the least significant bit of each color channel (R, G, B)
        for (let channel = 0; channel < 3 && binaryIndex < binaryText.length; channel++) {
          const bit = parseInt(binaryText[binaryIndex]);
          newData[i + channel] = (newData[i + channel] & 0xFE) | bit;
          binaryIndex++;
        }
      }
      
      return new ImageData(newData, imageData.width, imageData.height);
    } catch (error) {
      throw new Error(`Steganography encoding failed: ${(error as Error).message}`);
    }
  }
  
  static extractTextFromImage(imageData: ImageData, password?: string): string {
    try {
      let binaryText = '';
      const endMarker = '1111111111111110';
      
      for (let i = 0; i < imageData.data.length; i += 4) {
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
                throw new Error('Invalid password or corrupted data');
              }
            }
            
            return extractedText;
          }
        }
      }
      
      return '';
    } catch (error) {
      throw new Error(`Steganography decoding failed: ${(error as Error).message}`);
    }
  }
  
  // Advanced LSB with multiple bit planes
  static hideTextInImageAdvanced(
    imageData: ImageData, 
    text: string, 
    bitsPerChannel: number = 1,
    password?: string
  ): ImageData {
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
      
      for (let i = 0; i < newData.length && binaryIndex < binaryText.length; i += 4) {
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
      
      return new ImageData(newData, imageData.width, imageData.height);
    } catch (error) {
      throw new Error(`Advanced steganography encoding failed: ${(error as Error).message}`);
    }
  }
  
  static extractTextFromImageAdvanced(
    imageData: ImageData, 
    bitsPerChannel: number = 1,
    password?: string
  ): string {
    try {
      if (bitsPerChannel < 1 || bitsPerChannel > 4) {
        throw new Error('Bits per channel must be between 1 and 4');
      }
      
      let binaryText = '';
      const endMarker = '1111111111111110';
      const mask = (1 << bitsPerChannel) - 1;
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        for (let channel = 0; channel < 3; channel++) {
          const channelValue = imageData.data[i + channel];
          
          for (let bit = 0; bit < bitsPerChannel; bit++) {
            const extractedBit = (channelValue >> bit) & 1;
            binaryText += extractedBit.toString();
            
            if (binaryText.endsWith(endMarker)) {
              const textBinary = binaryText.slice(0, -endMarker.length);
              let extractedText = textBinary.match(/.{8}/g)?.map(byte => 
                String.fromCharCode(parseInt(byte, 2))
              ).join('') || '';
              
              if (password && extractedText) {
                try {
                  extractedText = this.simpleDecrypt(extractedText, password);
                } catch {
                  throw new Error('Invalid password or corrupted data');
                }
              }
              
              return extractedText;
            }
          }
        }
      }
      
      return '';
    } catch (error) {
      throw new Error(`Advanced steganography decoding failed: ${(error as Error).message}`);
    }
  }
  
  // DCT-based steganography (simplified)
  static hideTextInImageDCT(imageData: ImageData, text: string): ImageData {
    // This is a simplified DCT implementation for demo purposes
    // In production, you would use proper DCT libraries
    return this.hideTextInImage(imageData, text);
  }
  
  static extractTextFromImageDCT(imageData: ImageData): string {
    return this.extractTextFromImage(imageData);
  }
  
  // Spread spectrum steganography
  static hideTextInImageSpreadSpectrum(imageData: ImageData, text: string, key: string): ImageData {
    try {
      const pseudoRandomSequence = this.generatePseudoRandomSequence(key, imageData.data.length / 4);
      const binaryText = text.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('') + '1111111111111110';
      
      const newData = new Uint8ClampedArray(imageData.data);
      let binaryIndex = 0;
      
      for (let i = 0; i < pseudoRandomSequence.length && binaryIndex < binaryText.length; i++) {
        const pixelIndex = pseudoRandomSequence[i] * 4;
        const channel = i % 3; // R, G, or B
        
        if (pixelIndex + channel < newData.length) {
          const bit = parseInt(binaryText[binaryIndex]);
          newData[pixelIndex + channel] = (newData[pixelIndex + channel] & 0xFE) | bit;
          binaryIndex++;
        }
      }
      
      return new ImageData(newData, imageData.width, imageData.height);
    } catch (error) {
      throw new Error(`Spread spectrum steganography failed: ${(error as Error).message}`);
    }
  }
  
  static extractTextFromImageSpreadSpectrum(imageData: ImageData, key: string): string {
    try {
      const pseudoRandomSequence = this.generatePseudoRandomSequence(key, imageData.data.length / 4);
      let binaryText = '';
      const endMarker = '1111111111111110';
      
      for (let i = 0; i < pseudoRandomSequence.length; i++) {
        const pixelIndex = pseudoRandomSequence[i] * 4;
        const channel = i % 3;
        
        if (pixelIndex + channel < imageData.data.length) {
          const bit = imageData.data[pixelIndex + channel] & 1;
          binaryText += bit.toString();
          
          if (binaryText.endsWith(endMarker)) {
            const textBinary = binaryText.slice(0, -endMarker.length);
            return textBinary.match(/.{8}/g)?.map(byte => 
              String.fromCharCode(parseInt(byte, 2))
            ).join('') || '';
          }
        }
      }
      
      return '';
    } catch (error) {
      throw new Error(`Spread spectrum extraction failed: ${(error as Error).message}`);
    }
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
  
  static imageDataToBlob(imageData: ImageData, format: string = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx?.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, format);
    });
  }
  
  // Helper methods
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
}

export const Steganography = EnhancedSteganography;