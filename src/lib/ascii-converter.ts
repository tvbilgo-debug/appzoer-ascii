

import { ConversionSettings, ImageInfo, DEFAULT_SETTINGS } from '@/types/ascii-converter';

export class ASCIIConverter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
  }

  async convertImageToASCII(
    imageFile: File,
    settings: ConversionSettings,
    onProgress?: (progress: number) => void
  ): Promise<{ ascii: string; colors?: string[][] }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const result = this.processImage(img, settings, onProgress);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(imageFile);
    });
  }

  private processImage(
    img: HTMLImageElement,
    settings: ConversionSettings,
    onProgress?: (progress: number) => void
  ): { ascii: string; colors?: string[][] } {
    const { width: targetWidth, maintainAspectRatio } = settings;
    
    // Calculate dimensions
    const aspectRatio = img.height / img.width;
    const outputWidth = Math.min(Math.max(targetWidth, 20), 200);
    const outputHeight = maintainAspectRatio 
      ? Math.round(outputWidth * aspectRatio * 0.5) // ASCII chars are taller than wide
      : Math.round(outputWidth * aspectRatio);

    // Set canvas size
    this.canvas.width = outputWidth;
    this.canvas.height = outputHeight;

    // Apply image adjustments and draw
    this.ctx.filter = this.buildFilter(settings);

    // Configure sampling algorithm
    switch (settings.samplingAlgorithm) {
      case 'nearest':
        this.ctx.imageSmoothingEnabled = false;
        break;
      case 'bicubic':
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        break;
      case 'bilinear':
      default:
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'medium';
        break;
    }

    this.ctx.drawImage(img, 0, 0, outputWidth, outputHeight);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, outputWidth, outputHeight);
    const pixels = imageData.data;

    // Convert to ASCII
    let ascii = '';
    const colors: string[][] = [];
    const baseCharSet = settings.characterSet && settings.characterSet.length > 0
      ? settings.characterSet
      : DEFAULT_SETTINGS.characterSet;
    const chars = settings.reverseMapping 
      ? baseCharSet.split('').reverse().join('')
      : baseCharSet;

    // Always generate color data for testing
    for (let y = 0; y < outputHeight; y++) {
      const rowColors: string[] = [];
      let rowAscii = '';
      
      for (let x = 0; x < outputWidth; x++) {
        const pixelIndex = (y * outputWidth + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        
        // Convert to grayscale
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        // Apply gamma correction with clamping for stability
        const gamma = Math.min(Math.max(settings.gamma, 0.1), 3.0);
        const correctedGray = Math.pow(gray / 255, gamma) * 255;
        
        // Map to character
        const charIndex = Math.floor((correctedGray / 255) * (chars.length - 1));
        rowAscii += chars[charIndex];
        
        // Always store color information for testing
        const colorHex = this.rgbToHex(r, g, b);
        rowColors.push(colorHex);
      }
      
      ascii += rowAscii + '\n';
      colors.push(rowColors);
      
      // Report progress
      if (onProgress) {
        onProgress((y / outputHeight) * 100);
      }
    }



    // Remove any default dashed lines and trim the result
    let result = ascii.trim();
    
    // Remove lines that are only dashes or similar repeated characters
    const lines = result.split('\n');
    const filteredLines: string[] = [];
    const filteredColors: string[][] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Skip empty lines
      if (!trimmedLine) return;
      // Skip lines that are only repeated dashes, equals, or similar characters
      if (/^[-=_]{10,}$/.test(trimmedLine)) return;
      
      filteredLines.push(line);
      if (colors[index]) {
        filteredColors.push(colors[index]);
      }
    });
    
    const finalAscii = filteredLines.join('\n');
    
    return {
      ascii: finalAscii,
      colors: filteredColors
    };
  }

  private buildFilter(settings: ConversionSettings): string {
    const filters = [];
    
    if (settings.brightness !== 0) {
      filters.push(`brightness(${100 + settings.brightness}%)`);
    }
    
    if (settings.contrast !== 0) {
      filters.push(`contrast(${100 + settings.contrast}%)`);
    }

    return filters.join(' ') || 'none';
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  getImageInfo(file: File): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for info'));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  validateImageFile(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return validTypes.includes(file.type) && file.size <= maxSize;
  }
}

