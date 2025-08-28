"use client";

import { useState, useEffect, useMemo } from 'react';
import { ConverterLayout } from '@/components/layout/ConverterLayout';
import { ImageUpload } from '@/components/ascii-converter/ImageUpload';
import { SettingsPanel } from '@/components/ascii-converter/SettingsPanel';
import { PreviewPanel } from '@/components/ascii-converter/PreviewPanel';
import { BatchProcessor } from '@/components/ascii-converter/BatchProcessor';
import { PresetManager } from '@/components/ascii-converter/PresetManager';
import { TextToASCII } from '@/components/ascii-converter/TextToASCII';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ConversionSettings, ImageInfo, DEFAULT_SETTINGS } from '@/types/ascii-converter';
import { ASCIIConverter } from '@/lib/ascii-converter';
import { LocalStorage } from '@/lib/storage';
import { toast } from 'sonner';
import { Play, Zap, Settings, Download, Type, RotateCcw } from 'lucide-react';

export default function ConverterPage() {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageInfo, setImageInfo] = useState<ImageInfo>();
  const [settings, setSettings] = useState<ConversionSettings>(DEFAULT_SETTINGS);
  const [asciiResult, setAsciiResult] = useState<string>('');
  const [colorData, setColorData] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('converter');

  const converter = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new ASCIIConverter();
    }
    return null;
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedSettings = LocalStorage.loadLastSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
      const savedTab = typeof window !== 'undefined' ? localStorage.getItem('ascii-last-tab') : null;
      if (savedTab) setActiveTab(savedTab);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      LocalStorage.saveLastSettings(settings);
    }
  }, [settings, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('ascii-last-tab', activeTab);
    }
  }, [activeTab, isClient]);

  const handleImageSelect = (file: File, info: ImageInfo) => {
    setSelectedImage(file);
    setImageInfo(info);
    setAsciiResult('');
    setColorData([]);
  };

  const handleImageRemove = () => {
    setSelectedImage(undefined);
    setImageInfo(undefined);
    setAsciiResult('');
    setColorData([]);
  };

  const handleSettingsChange = (newSettings: ConversionSettings) => {
    setSettings(newSettings);
  };

  const convertImage = async () => {
    if (!selectedImage || !converter) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await converter.convertImageToASCII(
        selectedImage,
        settings,
        () => {}
      );
      
      setAsciiResult(result.ascii);
      setColorData(result.colors || []);
      
      toast.success('Image converted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadPreset = (presetSettings: ConversionSettings) => {
    setSettings(presetSettings);
  };

  const clearAsciiResult = () => {
    setAsciiResult('');
    setColorData([]);
  };

  const clearAllData = () => {
    setSelectedImage(undefined);
    setImageInfo(undefined);
    setAsciiResult('');
    setColorData([]);
    setSettings(DEFAULT_SETTINGS);
    toast.success('All data cleared!');
  };

  if (!isClient) {
    return (
      <ConverterLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Image to ASCII Converter</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Loading...</p>
          </div>
        </div>
      </ConverterLayout>
    );
  }

  return (
    <ConverterLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Image to ASCII Converter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Transform your images into stunning ASCII art with advanced customization options,
            batch processing, and professional-grade output controls.
          </p>
          <Button 
            variant="outline" 
            onClick={clearAllData}
            className="mx-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Image Converter
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text to ASCII
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Batch Processing
            </TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-6">
                <ImageUpload onImageSelect={handleImageSelect} onImageRemove={handleImageRemove} selectedImage={selectedImage} imageInfo={imageInfo} />
                <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
                <Button onClick={convertImage} disabled={!selectedImage || isProcessing || !converter} className="w-full" size="lg">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Convert to ASCII
                    </>
                  )}
                </Button>
              </div>
              <div className="xl:col-span-2">
                              <PreviewPanel
                originalImage={selectedImage}
                asciiResult={asciiResult}
                colorData={colorData}
                colorMode={settings.colorMode}
                isProcessing={isProcessing}
                onClearResult={clearAsciiResult}
              />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="batch">
            <BatchProcessor settings={settings} />
          </TabsContent>

          <TabsContent value="text">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TextToASCII onAsciiResult={setAsciiResult} />
              <div className="xl:col-span-1">
                <PreviewPanel 
                  originalImage={undefined} 
                  asciiResult={asciiResult} 
                  isProcessing={false}
                  onClearResult={clearAsciiResult}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets">
            <PresetManager currentSettings={settings} onLoadPreset={handleLoadPreset} />
          </TabsContent>
        </Tabs>
      </div>
    </ConverterLayout>
  );
}


