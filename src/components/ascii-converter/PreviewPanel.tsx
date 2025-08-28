
"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, ZoomIn, ZoomOut, RotateCcw, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface PreviewPanelProps {
  originalImage?: File;
  asciiResult?: string;
  colorData?: string[][];
  isProcessing?: boolean;
  onClearResult?: () => void;
  colorMode?: 'grayscale' | 'color';
}

export function PreviewPanel({ 
  originalImage, 
  asciiResult, 
  colorData,
  isProcessing,
  onClearResult,
  colorMode = 'grayscale'
}: PreviewPanelProps) {
  const [fontSize, setFontSize] = useState(12);
  const [zoom, setZoom] = useState(100);
  const [imageUrl, setImageUrl] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const asciiContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{x: number; y: number} | null>(null);

  // Create object URL for the image when it changes
  React.useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setImageUrl(url);
      
      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl('');
    }
  }, [originalImage]);



  const copyToClipboard = async () => {
    if (!asciiResult) return;
    
    try {
      await navigator.clipboard.writeText(asciiResult);
      toast.success('ASCII art copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadAsText = () => {
    if (!asciiResult) return;
    
    const blob = new Blob([asciiResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ASCII art downloaded!');
    
    // Auto-refresh after download (clear the result)
    setTimeout(() => {
      if (onClearResult) {
        onClearResult();
      }
    }, 1000);
  };

  const downloadAsHTML = () => {
    if (!asciiResult) return;
    
    let htmlContent: string;
    
    if (colorData && colorData.length > 0) {
      // Color mode - create HTML with colored spans
      const lines = asciiResult.split('\n');
      let coloredAscii = '';
      
      for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const colors = colorData[y];
        
        if (colors) {
          for (let x = 0; x < line.length; x++) {
            const char = line[x];
            const color = colors[x];
            if (color) {
              coloredAscii += `<span style="color: ${color}">${char}</span>`;
            } else {
              coloredAscii += char;
            }
          }
        } else {
          coloredAscii += line;
        }
        coloredAscii += '\n';
      }
      
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>ASCII Art (Color)</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: ${fontSize}px;
            line-height: 1;
            white-space: pre;
            background: #000;
            padding: 20px;
            margin: 0;
        }
    </style>
</head>
<body>${coloredAscii}</body>
</html>`;
    } else {
      // Grayscale mode - traditional green on black
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>ASCII Art</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: ${fontSize}px;
            line-height: 1;
            white-space: pre;
            background: #000;
            color: #0f0;
            padding: 20px;
            margin: 0;
        }
    </style>
</head>
<body>${asciiResult}</body>
</html>`;
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('HTML file downloaded!');
    
    // Auto-refresh after download (clear the result)
    setTimeout(() => {
      if (onClearResult) {
        onClearResult();
      }
    }, 1000);
  };

  const copyHTMLToClipboard = async () => {
    if (!asciiResult) return;

    let htmlContent: string;
    
    if (colorData && colorData.length > 0) {
      // Color mode - create HTML with colored spans
      const lines = asciiResult.split('\n');
      let coloredAscii = '';
      
      for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const colors = colorData[y];
        
        if (colors) {
          for (let x = 0; x < line.length; x++) {
            const char = line[x];
            const color = colors[x];
            if (color) {
              coloredAscii += `<span style="color: ${color}">${char}</span>`;
            } else {
              coloredAscii += char;
            }
          }
        } else {
          coloredAscii += line;
        }
        coloredAscii += '\n';
      }
      
      htmlContent = `<!DOCTYPE html><html><head><title>ASCII Art (Color)</title><style>body{font-family:'Courier New',monospace;font-size:${fontSize}px;line-height:1;white-space:pre;background:#000;padding:20px;margin:0;}</style></head><body>${coloredAscii}</body></html>`;
    } else {
      // Grayscale mode - traditional green on black
      htmlContent = `<!DOCTYPE html><html><head><title>ASCII Art</title><style>body{font-family:'Courier New',monospace;font-size:${fontSize}px;line-height:1;white-space:pre;background:#000;color:#0f0;padding:20px;margin:0;}</style></head><body>${asciiResult}</body></html>`;
    }

    try {
      await navigator.clipboard.writeText(htmlContent);
      toast.success('HTML copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy HTML');
    }
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const step = 10;
    const next = delta > 0 ? Math.max(50, zoom - step) : Math.min(200, zoom + step);
    setZoom(next);
  };

  const beginDrag = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing';
  };

  const endDrag = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
    lastPosRef.current = null;
    (e.currentTarget as HTMLDivElement).style.cursor = 'grab';
  };

  const onDragMove = (container: HTMLDivElement | null) => (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !container || !lastPosRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    container.scrollLeft -= dx;
    container.scrollTop -= dy;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const resetView = () => {
    setFontSize(12);
    setZoom(100);
  };

  const renderColoredAscii = () => {
    if (!asciiResult) return null;
    
    // Always try to render with colors if color data is available
    if (colorData && colorData.length > 0) {
      const lines = asciiResult.split('\n');
      return lines.map((line, y) => {
        const colors = colorData[y];
        if (colors && colors.length > 0) {
          return (
            <div key={y} className="leading-none">
              {line.split('').map((char, x) => {
                const color = colors[x];
                return (
                  <span
                    key={x}
                    style={{ 
                      color: color || '#0f0',
                      textShadow: color ? 'none' : '0 0 2px #0f0'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        }
        return <div key={y} className="leading-none">{line}</div>;
      });
    }
    

    
    // Fallback to grayscale
    return <div className="leading-none">{asciiResult}</div>;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Preview</CardTitle>
            {colorData && colorData.length > 0 ? (
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                Color Mode Active
              </span>
            ) : (
              <span className="px-2 py-1 text-xs bg-gray-500 text-white rounded-full">
                Grayscale Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {asciiResult && (
              <>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAsText}>
                  <Download className="h-4 w-4 mr-2" />
                  TXT
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAsHTML}>
                  <Download className="h-4 w-4 mr-2" />
                  HTML
                </Button>
                <Button variant="outline" size="sm" onClick={copyHTMLToClipboard}>
                  <CopyCheck className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Controls */}
        {asciiResult && (
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Font Size:</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(8, fontSize - 1))}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-sm w-8 text-center">{fontSize}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm">Zoom:</Label>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={50}
                max={200}
                step={10}
                className="w-20"
              />
              <span className="text-sm w-12">{zoom}%</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Preview Content */}
        <Tabs defaultValue="side-by-side" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="ascii-only">ASCII Only</TabsTrigger>
          </TabsList>

          <TabsContent value="side-by-side" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Original Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Original Image</Label>
                <div
                  ref={imageContainerRef}
                  onWheel={handleWheelZoom}
                  onMouseDown={beginDrag}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  onMouseMove={onDragMove(imageContainerRef.current)}
                  className="border rounded-lg p-4 bg-muted/50 min-h-[300px] flex items-center justify-center overflow-auto"
                  style={{ cursor: 'grab' }}
                >
                  {imageUrl ? (
                    <div className="relative max-w-full max-h-[400px]" style={{ transform: `scale(${zoom / 100})` }}>
                      <Image
                        src={imageUrl}
                        alt="Original image for ASCII conversion"
                        width={400}
                        height={400}
                        className="max-w-full max-h-[400px] object-contain"
                        unoptimized // Since we're using blob URLs
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No image selected</p>
                  )}
                </div>
              </div>

              {/* ASCII Output */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">ASCII Art</Label>
                <div
                  ref={asciiContainerRef}
                  onWheel={handleWheelZoom}
                  onMouseDown={beginDrag}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  onMouseMove={onDragMove(asciiContainerRef.current)}
                  className={`border rounded-lg bg-black overflow-auto min-h-[300px] max-h-[400px] ${colorMode === 'color' ? '' : 'text-green-400'}`}
                  style={{ cursor: 'grab' }}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                        <p>Converting image...</p>
                      </div>
                    </div>
                  ) : asciiResult ? (
                    <div
                      className="p-4 font-mono overflow-hidden"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top left'
                      }}
                    >
                      {renderColoredAscii()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">ASCII art will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ascii-only" className="mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">ASCII Art</Label>
              <div className={`border rounded-lg bg-black overflow-auto ${colorMode === 'color' ? '' : 'text-green-400'}`}>
                {isProcessing ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                      <p>Converting image...</p>
                    </div>
                  </div>
                ) : asciiResult ? (
                  colorMode === 'color' ? (
                    <div
                      className="w-full h-96 p-4 font-mono overflow-auto"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {renderColoredAscii()}
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={asciiResult}
                      readOnly
                      className="w-full h-96 p-4 bg-transparent text-green-400 font-mono resize-none border-none outline-none leading-none"
                      style={{ fontSize: `${fontSize}px` }}
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">ASCII art will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
