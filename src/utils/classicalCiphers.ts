import { CryptoResult } from '../types/crypto';

export class ClassicalCiphers {
  // SUBSTITUTION CIPHERS
  
  // Caesar Cipher
  static caesarCipher(text: string, shift: number, encrypt = true): string {
    const direction = encrypt ? shift : -shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + direction + 26) % 26) + start);
    });
  }

  // Atbash Cipher
  static atbashCipher(text: string): string {
    return text.replace(/[a-zA-Z]/g, (char) => {
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      } else {
        return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      }
    });
  }

  // ROT13
  static rot13(text: string): string {
    return this.caesarCipher(text, 13);
  }

  // Monoalphabetic Cipher
  static monoalphabeticCipher(text: string, key: string, encrypt = true): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyAlphabet = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (keyAlphabet.length !== 26) {
      throw new Error('Key must contain all 26 letters');
    }
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const isUpper = char >= 'A' && char <= 'Z';
      const index = alphabet.indexOf(char.toUpperCase());
      if (index === -1) return char;
      
      const result = encrypt ? keyAlphabet[index] : alphabet[keyAlphabet.indexOf(char.toUpperCase())];
      return isUpper ? result : result.toLowerCase();
    });
  }

  // POLYALPHABETIC CIPHERS

  // Vigenère Cipher
  static vigenereCipher(text: string, key: string, encrypt = true): string {
    const keyRepeated = key.toUpperCase().repeat(Math.ceil(text.length / key.length));
    let keyIndex = 0;
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      const shift = keyRepeated.charCodeAt(keyIndex % keyRepeated.length) - 65;
      const direction = encrypt ? shift : -shift;
      keyIndex++;
      return String.fromCharCode(((char.charCodeAt(0) - start + direction + 26) % 26) + start);
    });
  }

  // Beaufort Cipher
  static beaufortCipher(text: string, key: string, encrypt = true): string {
    const keyRepeated = key.toUpperCase().repeat(Math.ceil(text.length / key.length));
    let keyIndex = 0;
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      const keyChar = keyRepeated.charCodeAt(keyIndex % keyRepeated.length) - 65;
      const textChar = char.charCodeAt(0) - start;
      keyIndex++;
      
      let result;
      if (encrypt) {
        result = (keyChar - textChar + 26) % 26;
      } else {
        result = (keyChar - textChar + 26) % 26;
      }
      
      return String.fromCharCode(result + start);
    });
  }

  // Autokey Cipher
  static autokeyCipher(text: string, key: string, encrypt = true): string {
    const cleanText = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const fullKey = (key + (encrypt ? cleanText : '')).toUpperCase();
    let keyIndex = 0;
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      const shift = fullKey.charCodeAt(keyIndex % fullKey.length) - 65;
      const direction = encrypt ? shift : -shift;
      keyIndex++;
      return String.fromCharCode(((char.charCodeAt(0) - start + direction + 26) % 26) + start);
    });
  }

  // Playfair Cipher
  static playfairCipher(text: string, key: string, encrypt = true): string {
    // Create 5x5 key square
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted, I/J treated as same
    const keySquare = this.createPlayfairKeySquare(key);
    
    // Prepare text
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Add padding and create digrams
    const digrams = [];
    for (let i = 0; i < cleanText.length; i += 2) {
      let pair = cleanText.substr(i, 2);
      if (pair.length === 1) pair += 'X';
      if (pair[0] === pair[1]) {
        pair = pair[0] + 'X';
        i--; // Reprocess the second character
      }
      digrams.push(pair);
    }
    
    // Process each digram
    return digrams.map(digram => {
      const pos1 = this.findInKeySquare(keySquare, digram[0]);
      const pos2 = this.findInKeySquare(keySquare, digram[1]);
      
      if (pos1.row === pos2.row) {
        // Same row - move horizontally
        const col1 = encrypt ? (pos1.col + 1) % 5 : (pos1.col + 4) % 5;
        const col2 = encrypt ? (pos2.col + 1) % 5 : (pos2.col + 4) % 5;
        return keySquare[pos1.row][col1] + keySquare[pos2.row][col2];
      } else if (pos1.col === pos2.col) {
        // Same column - move vertically
        const row1 = encrypt ? (pos1.row + 1) % 5 : (pos1.row + 4) % 5;
        const row2 = encrypt ? (pos2.row + 1) % 5 : (pos2.row + 4) % 5;
        return keySquare[row1][pos1.col] + keySquare[row2][pos2.col];
      } else {
        // Rectangle - swap columns
        return keySquare[pos1.row][pos2.col] + keySquare[pos2.row][pos1.col];
      }
    }).join('');
  }

  private static createPlayfairKeySquare(key: string): string[][] {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    const keyChars = [...new Set(key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I'))];
    const remainingChars = alphabet.split('').filter(char => !keyChars.includes(char));
    const allChars = [...keyChars, ...remainingChars];
    
    const square = [];
    for (let i = 0; i < 5; i++) {
      square.push(allChars.slice(i * 5, (i + 1) * 5));
    }
    return square;
  }

  private static findInKeySquare(square: string[][], char: string): { row: number; col: number } {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (square[row][col] === char) {
          return { row, col };
        }
      }
    }
    return { row: 0, col: 0 };
  }

  // Hill Cipher (2x2 matrix)
  static hillCipher(text: string, key: string, encrypt = true): string {
    // Parse key as 4 numbers for 2x2 matrix
    const keyNumbers = key.split(',').map(n => parseInt(n.trim()));
    if (keyNumbers.length !== 4) {
      throw new Error('Hill cipher key must be 4 numbers separated by commas (a,b,c,d)');
    }
    
    const [a, b, c, d] = keyNumbers;
    const det = (a * d - b * c) % 26;
    
    if (this.gcd(det, 26) !== 1) {
      throw new Error('Key matrix is not invertible');
    }
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const paddedText = cleanText.length % 2 === 0 ? cleanText : cleanText + 'X';
    
    let result = '';
    for (let i = 0; i < paddedText.length; i += 2) {
      const x1 = paddedText.charCodeAt(i) - 65;
      const x2 = paddedText.charCodeAt(i + 1) - 65;
      
      let y1, y2;
      if (encrypt) {
        y1 = (a * x1 + b * x2) % 26;
        y2 = (c * x1 + d * x2) % 26;
      } else {
        const detInv = this.modInverse(det, 26);
        const aInv = (d * detInv) % 26;
        const bInv = (-b * detInv + 26) % 26;
        const cInv = (-c * detInv + 26) % 26;
        const dInv = (a * detInv) % 26;
        
        y1 = (aInv * x1 + bInv * x2) % 26;
        y2 = (cInv * x1 + dInv * x2) % 26;
      }
      
      result += String.fromCharCode(y1 + 65) + String.fromCharCode(y2 + 65);
    }
    
    return result;
  }

  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private static modInverse(a: number, m: number): number {
    for (let i = 1; i < m; i++) {
      if ((a * i) % m === 1) return i;
    }
    return 1;
  }

  // ADFGX Cipher
  static adfgxCipher(text: string, key1: string, key2: string, encrypt = true): string {
    const adfgx = 'ADFGX';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Create 6x6 Polybius square with key1
    const square = this.createADFGXSquare(key1);
    
    if (encrypt) {
      // Step 1: Substitute using Polybius square
      let substituted = '';
      for (const char of text.toUpperCase().replace(/[^A-Z0-9]/g, '')) {
        const pos = this.findInADFGXSquare(square, char);
        substituted += adfgx[pos.row] + adfgx[pos.col];
      }
      
      // Step 2: Columnar transposition with key2
      return this.columnarTransposition(substituted, key2, true);
    } else {
      // Reverse: First undo transposition, then substitution
      const afterTransposition = this.columnarTransposition(text, key2, false);
      
      let result = '';
      for (let i = 0; i < afterTransposition.length; i += 2) {
        const row = adfgx.indexOf(afterTransposition[i]);
        const col = adfgx.indexOf(afterTransposition[i + 1]);
        result += square[row][col];
      }
      return result;
    }
  }

  private static createADFGXSquare(key: string): string[][] {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const keyChars = [...new Set(key.toUpperCase().replace(/[^A-Z0-9]/g, ''))];
    const remainingChars = alphabet.split('').filter(char => !keyChars.includes(char));
    const allChars = [...keyChars, ...remainingChars];
    
    const square = [];
    for (let i = 0; i < 6; i++) {
      square.push(allChars.slice(i * 6, (i + 1) * 6));
    }
    return square;
  }

  private static findInADFGXSquare(square: string[][], char: string): { row: number; col: number } {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (square[row][col] === char) {
          return { row, col };
        }
      }
    }
    return { row: 0, col: 0 };
  }

  // Bacon's Cipher
  static baconCipher(text: string, encrypt = true): string {
    const baconMap: { [key: string]: string } = {
      'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
      'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAB',
      'K': 'ABABA', 'L': 'ABABB', 'M': 'ABBAA', 'N': 'ABBAB', 'O': 'ABBBA',
      'P': 'ABBBB', 'Q': 'BAAAA', 'R': 'BAAAB', 'S': 'BAABA', 'T': 'BAABB',
      'U': 'BABAA', 'V': 'BABAB', 'W': 'BABBA', 'X': 'BABBB', 'Y': 'BBAAA', 'Z': 'BBAAB'
    };
    
    if (encrypt) {
      return text.toUpperCase().replace(/[A-Z]/g, char => baconMap[char] || char);
    } else {
      const reverseMap: { [key: string]: string } = {};
      Object.entries(baconMap).forEach(([char, code]) => reverseMap[code] = char);
      
      let result = '';
      for (let i = 0; i < text.length; i += 5) {
        const code = text.substr(i, 5);
        result += reverseMap[code] || code;
      }
      return result;
    }
  }

  // TRANSPOSITION CIPHERS

  // Rail Fence Cipher
  static railFenceCipher(text: string, rails: number, encrypt = true): string {
    if (rails <= 1) return text;
    
    if (encrypt) {
      const fence: string[][] = Array(rails).fill(null).map(() => []);
      let rail = 0;
      let direction = 1;
      
      for (const char of text) {
        fence[rail].push(char);
        rail += direction;
        
        if (rail === rails - 1 || rail === 0) {
          direction = -direction;
        }
      }
      
      return fence.flat().join('');
    } else {
      // Decryption
      const pattern: number[] = [];
      let rail = 0;
      let direction = 1;
      
      for (let i = 0; i < text.length; i++) {
        pattern.push(rail);
        rail += direction;
        
        if (rail === rails - 1 || rail === 0) {
          direction = -direction;
        }
      }
      
      const result = Array(text.length);
      let index = 0;
      
      for (let r = 0; r < rails; r++) {
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] === r) {
            result[i] = text[index++];
          }
        }
      }
      
      return result.join('');
    }
  }

  // Columnar Transposition
  static columnarTransposition(text: string, key: string, encrypt = true): string {
    const keyOrder = this.getKeyOrder(key);
    const cols = key.length;
    
    if (encrypt) {
      // Pad text to fill rectangle
      const paddedText = text + 'X'.repeat((cols - (text.length % cols)) % cols);
      const rows = paddedText.length / cols;
      
      // Create grid
      const grid: string[][] = [];
      for (let i = 0; i < rows; i++) {
        grid.push(paddedText.substr(i * cols, cols).split(''));
      }
      
      // Read columns in key order
      let result = '';
      for (const colIndex of keyOrder) {
        for (let row = 0; row < rows; row++) {
          result += grid[row][colIndex];
        }
      }
      return result;
    } else {
      // Decryption
      const rows = Math.ceil(text.length / cols);
      const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
      
      let index = 0;
      for (const colIndex of keyOrder) {
        for (let row = 0; row < rows; row++) {
          if (index < text.length) {
            grid[row][colIndex] = text[index++];
          }
        }
      }
      
      return grid.flat().join('').replace(/X+$/, '');
    }
  }

  private static getKeyOrder(key: string): number[] {
    const keyChars = key.split('').map((char, index) => ({ char, index }));
    keyChars.sort((a, b) => a.char.localeCompare(b.char));
    return keyChars.map(item => item.index);
  }

  // Scytale Cipher
  static scytaleCipher(text: string, diameter: number, encrypt = true): string {
    if (encrypt) {
      const paddedText = text + ' '.repeat((diameter - (text.length % diameter)) % diameter);
      const strips = Math.ceil(paddedText.length / diameter);
      
      let result = '';
      for (let i = 0; i < diameter; i++) {
        for (let j = 0; j < strips; j++) {
          const index = j * diameter + i;
          if (index < paddedText.length) {
            result += paddedText[index];
          }
        }
      }
      return result;
    } else {
      const strips = Math.ceil(text.length / diameter);
      const grid: string[][] = Array(strips).fill(null).map(() => Array(diameter).fill(''));
      
      let index = 0;
      for (let col = 0; col < diameter; col++) {
        for (let row = 0; row < strips; row++) {
          if (index < text.length) {
            grid[row][col] = text[index++];
          }
        }
      }
      
      return grid.flat().join('').trim();
    }
  }

  // Route Cipher
  static routeCipher(text: string, key: string, encrypt = true): string {
    // Key format: "rows,cols,route" e.g., "4,5,spiral"
    const [rows, cols, route] = key.split(',');
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    
    if (encrypt) {
      const paddedText = text + 'X'.repeat((numRows * numCols - text.length % (numRows * numCols)) % (numRows * numCols));
      const grid: string[][] = [];
      
      // Fill grid row by row
      for (let i = 0; i < numRows; i++) {
        grid.push(paddedText.substr(i * numCols, numCols).split(''));
      }
      
      // Read according to route
      return this.readGridByRoute(grid, route || 'spiral');
    } else {
      // For decryption, we need to reverse the route reading
      const grid: string[][] = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
      this.fillGridByRoute(grid, text, route || 'spiral');
      
      return grid.flat().join('').replace(/X+$/, '');
    }
  }

  private static readGridByRoute(grid: string[][], route: string): string {
    const rows = grid.length;
    const cols = grid[0].length;
    let result = '';
    
    switch (route) {
      case 'spiral':
        let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
        while (top <= bottom && left <= right) {
          for (let i = left; i <= right; i++) result += grid[top][i];
          top++;
          for (let i = top; i <= bottom; i++) result += grid[i][right];
          right--;
          if (top <= bottom) {
            for (let i = right; i >= left; i--) result += grid[bottom][i];
            bottom--;
          }
          if (left <= right) {
            for (let i = bottom; i >= top; i--) result += grid[i][left];
            left++;
          }
        }
        break;
      default:
        // Column-wise reading
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            result += grid[row][col];
          }
        }
    }
    
    return result;
  }

  private static fillGridByRoute(grid: string[][], text: string, route: string): void {
    const rows = grid.length;
    const cols = grid[0].length;
    let index = 0;
    
    switch (route) {
      case 'spiral':
        let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
        while (top <= bottom && left <= right && index < text.length) {
          for (let i = left; i <= right && index < text.length; i++) grid[top][i] = text[index++];
          top++;
          for (let i = top; i <= bottom && index < text.length; i++) grid[i][right] = text[index++];
          right--;
          if (top <= bottom) {
            for (let i = right; i >= left && index < text.length; i--) grid[bottom][i] = text[index++];
            bottom--;
          }
          if (left <= right) {
            for (let i = bottom; i >= top && index < text.length; i--) grid[i][left] = text[index++];
            left++;
          }
        }
        break;
      default:
        // Column-wise filling
        for (let col = 0; col < cols && index < text.length; col++) {
          for (let row = 0; row < rows && index < text.length; row++) {
            grid[row][col] = text[index++];
          }
        }
    }
  }

  // XOR Cipher
  static xorCipher(text: string, key: string): string {
    const keyRepeated = key.repeat(Math.ceil(text.length / key.length));
    return text.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ keyRepeated.charCodeAt(index))
    ).join('');
  }

  // Affine Cipher
  static affineCipher(text: string, a: number, b: number, encrypt = true): string {
    const modInverse = (a: number, m: number): number => {
      for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) return i;
      }
      return 1;
    };

    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      const x = char.charCodeAt(0) - start;
      let result;
      
      if (encrypt) {
        result = (a * x + b) % 26;
      } else {
        const aInv = modInverse(a, 26);
        result = (aInv * (x - b + 26)) % 26;
      }
      
      return String.fromCharCode(result + start);
    });
  }
}

// Main encryption function for classical ciphers
export function encryptClassical(text: string, algorithm: string, key?: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'caesar':
        const shift = key ? parseInt(key) || 13 : 13;
        result = ClassicalCiphers.caesarCipher(text, shift, true);
        break;
      case 'atbash':
        result = ClassicalCiphers.atbashCipher(text);
        break;
      case 'rot13':
        result = ClassicalCiphers.rot13(text);
        break;
      case 'monoalphabetic':
        result = ClassicalCiphers.monoalphabeticCipher(text, key || 'ZYXWVUTSRQPONMLKJIHGFEDCBA', true);
        break;
      case 'vigenere':
        result = ClassicalCiphers.vigenereCipher(text, key || 'KEY', true);
        break;
      case 'beaufort':
        result = ClassicalCiphers.beaufortCipher(text, key || 'KEY', true);
        break;
      case 'autokey':
        result = ClassicalCiphers.autokeyCipher(text, key || 'KEY', true);
        break;
      case 'playfair':
        result = ClassicalCiphers.playfairCipher(text, key || 'KEYWORD', true);
        break;
      case 'hill':
        result = ClassicalCiphers.hillCipher(text, key || '3,2,5,7', true);
        break;
      case 'adfgx':
        const [key1, key2] = (key || 'SECRET,KEYWORD').split(',');
        result = ClassicalCiphers.adfgxCipher(text, key1, key2, true);
        break;
      case 'bacon':
        result = ClassicalCiphers.baconCipher(text, true);
        break;
      case 'railfence':
        const rails = key ? parseInt(key) || 3 : 3;
        result = ClassicalCiphers.railFenceCipher(text, rails, true);
        break;
      case 'columnar':
        result = ClassicalCiphers.columnarTransposition(text, key || 'KEYWORD', true);
        break;
      case 'scytale':
        const diameter = key ? parseInt(key) || 4 : 4;
        result = ClassicalCiphers.scytaleCipher(text, diameter, true);
        break;
      case 'route':
        result = ClassicalCiphers.routeCipher(text, key || '4,5,spiral', true);
        break;
      case 'xor':
        result = ClassicalCiphers.xorCipher(text, key || 'SECRET');
        break;
      case 'affine':
        const [a, b] = (key || '5,8').split(',').map(n => parseInt(n.trim()) || 5);
        result = ClassicalCiphers.affineCipher(text, a, b, true);
        break;
      default:
        throw new Error('Unsupported classical cipher');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}

// Main decryption function for classical ciphers
export function decryptClassical(text: string, algorithm: string, key?: string): CryptoResult {
  try {
    let result: string;
    
    switch (algorithm.toLowerCase()) {
      case 'caesar':
        const shift = key ? parseInt(key) || 13 : 13;
        result = ClassicalCiphers.caesarCipher(text, shift, false);
        break;
      case 'atbash':
        result = ClassicalCiphers.atbashCipher(text);
        break;
      case 'rot13':
        result = ClassicalCiphers.rot13(text);
        break;
      case 'monoalphabetic':
        result = ClassicalCiphers.monoalphabeticCipher(text, key || 'ZYXWVUTSRQPONMLKJIHGFEDCBA', false);
        break;
      case 'vigenere':
        result = ClassicalCiphers.vigenereCipher(text, key || 'KEY', false);
        break;
      case 'beaufort':
        result = ClassicalCiphers.beaufortCipher(text, key || 'KEY', false);
        break;
      case 'autokey':
        result = ClassicalCiphers.autokeyCipher(text, key || 'KEY', false);
        break;
      case 'playfair':
        result = ClassicalCiphers.playfairCipher(text, key || 'KEYWORD', false);
        break;
      case 'hill':
        result = ClassicalCiphers.hillCipher(text, key || '3,2,5,7', false);
        break;
      case 'adfgx':
        const [key1, key2] = (key || 'SECRET,KEYWORD').split(',');
        result = ClassicalCiphers.adfgxCipher(text, key1, key2, false);
        break;
      case 'bacon':
        result = ClassicalCiphers.baconCipher(text, false);
        break;
      case 'railfence':
        const rails = key ? parseInt(key) || 3 : 3;
        result = ClassicalCiphers.railFenceCipher(text, rails, false);
        break;
      case 'columnar':
        result = ClassicalCiphers.columnarTransposition(text, key || 'KEYWORD', false);
        break;
      case 'scytale':
        const diameter = key ? parseInt(key) || 4 : 4;
        result = ClassicalCiphers.scytaleCipher(text, diameter, false);
        break;
      case 'route':
        result = ClassicalCiphers.routeCipher(text, key || '4,5,spiral', false);
        break;
      case 'xor':
        result = ClassicalCiphers.xorCipher(text, key || 'SECRET');
        break;
      case 'affine':
        const [a, b] = (key || '5,8').split(',').map(n => parseInt(n.trim()) || 5);
        result = ClassicalCiphers.affineCipher(text, a, b, false);
        break;
      default:
        throw new Error('Unsupported classical cipher');
    }
    
    return { success: true, result, algorithm };
  } catch (error) {
    return { success: false, algorithm, error: (error as Error).message };
  }
}