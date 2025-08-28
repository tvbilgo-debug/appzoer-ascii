
"use client";

import { useCallback, useState, useMemo } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ASCIIConverter } from '@/lib/ascii-converter';
import { ImageInfo } from '@/types/ascii-converter';

interface ImageUploadProps {
  onImageSelect: (file: File, info: ImageInfo) => void;
  onImageRemove: () => void;
  selectedImage?: File;
  imageInfo?: ImageInfo;
}

export function ImageUpload({ 
  onImageSelect, 
  onImageRemove, 
  selectedImage, 
  imageInfo 
}: ImageUploadProps) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Create converter instance with useMemo to avoid recreation
  const converter = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new ASCIIConverter();
    }
    return null;
  }, []);

  const handleFileSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !converter) return;

    setError('');
    setLoading(true);

    try {
      // Validate file
      if (!converter.validateImageFile(file)) {
        throw new Error('Invalid file type or size. Please use JPEG, PNG, GIF, BMP, TIFF, or WebP files under 10MB.');
      }

      // Get image info
      const info = await converter.getImageInfo(file);
      onImageSelect(file, info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedImage && imageInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{selectedImage.name}</h3>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>Dimensions: {imageInfo.width} × {imageInfo.height}</p>
                <p>Size: {formatFileSize(imageInfo.size)}</p>
                <p>Type: {imageInfo.type}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onImageRemove}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onImageRemove();
                  // Clear any error state
                  setError('');
                }}
                className="flex-shrink-0"
                title="Clear and start fresh"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-4">
              <Upload className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-lg font-medium">
                  {loading ? 'Processing...' : isDragActive ? 'Drop image here' : 'Upload Image'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {loading ? 'Please wait...' : 'Drag & drop or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: JPEG, PNG, GIF, BMP, TIFF, WebP (max 10MB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
