export class Steganography {
  static hideTextInImage(imageData: ImageData, text: string): ImageData {
    const binaryText = text.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('') + '1111111111111110'; // End marker
    
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
  }
  
  static extractTextFromImage(imageData: ImageData): string {
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
          return textBinary.match(/.{8}/g)?.map(byte => 
            String.fromCharCode(parseInt(byte, 2))
          ).join('') || '';
        }
      }
    }
    
    return '';
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
  
  static imageDataToDataURL(imageData: ImageData): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx?.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
}