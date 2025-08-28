
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversionSettings, CHARACTER_SETS, DEFAULT_SETTINGS } from '@/types/ascii-converter';
import { RotateCcw, Save } from 'lucide-react';

interface SettingsPanelProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  onSavePreset?: () => void;
}

export function SettingsPanel({ 
  settings, 
  onSettingsChange, 
  onSavePreset 
}: SettingsPanelProps) {
  const [customCharSet, setCustomCharSet] = useState(settings.characterSet);

  const updateSetting = <K extends keyof ConversionSettings>(
    key: K,
    value: ConversionSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetToDefaults = () => {
    onSettingsChange(DEFAULT_SETTINGS);
    setCustomCharSet(DEFAULT_SETTINGS.characterSet);
  };

  const handleCharacterSetChange = (value: string) => {
    if (value === 'custom') {
      updateSetting('characterSet', customCharSet);
    } else {
      const charSet = CHARACTER_SETS[value as keyof typeof CHARACTER_SETS];
      updateSetting('characterSet', charSet);
      setCustomCharSet(charSet);
    }
  };

  const getCurrentCharSetKey = (): string => {
    for (const [key, value] of Object.entries(CHARACTER_SETS)) {
      if (value === settings.characterSet) {
        return key;
      }
    }
    return 'custom';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conversion Settings</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {onSavePreset && (
              <Button variant="outline" size="sm" onClick={onSavePreset}>
                <Save className="h-4 w-4 mr-2" />
                Save Preset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            {/* Output Width */}
            <div className="space-y-2">
              <Label>Output Width: {settings.width} characters</Label>
              <Slider
                value={[settings.width]}
                onValueChange={([value]) => updateSetting('width', value)}
                min={20}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center space-x-2">
              <Switch
                id="aspect-ratio"
                checked={settings.maintainAspectRatio}
                onCheckedChange={(checked) => updateSetting('maintainAspectRatio', checked)}
              />
              <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
            </div>

            {/* Reverse Mapping */}
            <div className="flex items-center space-x-2">
              <Switch
                id="reverse-mapping"
                checked={settings.reverseMapping}
                onCheckedChange={(checked) => updateSetting('reverseMapping', checked)}
              />
              <Label htmlFor="reverse-mapping">Reverse density mapping</Label>
            </div>

            {/* Color Mode */}
            <div className="space-y-2">
              <Label>Color Mode</Label>
              <Select
                value={settings.colorMode}
                onValueChange={(value: 'grayscale' | 'color') => 
                  updateSetting('colorMode', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">Grayscale (Traditional ASCII)</SelectItem>
                  <SelectItem value="color">Color (Preserve Original Colors)</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Current: {settings.colorMode} mode
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Brightness */}
            <div className="space-y-2">
              <Label>Brightness: {settings.brightness > 0 ? '+' : ''}{settings.brightness}</Label>
              <Slider
                value={[settings.brightness]}
                onValueChange={([value]) => updateSetting('brightness', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <Label>Contrast: {settings.contrast > 0 ? '+' : ''}{settings.contrast}</Label>
              <Slider
                value={[settings.contrast]}
                onValueChange={([value]) => updateSetting('contrast', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Gamma */}
            <div className="space-y-2">
              <Label>Gamma: {settings.gamma.toFixed(1)}</Label>
              <Slider
                value={[settings.gamma]}
                onValueChange={([value]) => updateSetting('gamma', value)}
                min={0.1}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Sampling Algorithm */}
            <div className="space-y-2">
              <Label>Sampling Algorithm</Label>
              <Select
                value={settings.samplingAlgorithm}
                onValueChange={(value: 'nearest' | 'bilinear' | 'bicubic') => 
                  updateSetting('samplingAlgorithm', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest Neighbor</SelectItem>
                  <SelectItem value="bilinear">Bilinear</SelectItem>
                  <SelectItem value="bicubic">Bicubic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-6 mt-6">
            {/* Character Set Selection */}
            <div className="space-y-2">
              <Label>Character Set</Label>
              <Select
                value={getCurrentCharSetKey()}
                onValueChange={handleCharacterSetChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default ( .:-=+*#%@)</SelectItem>
                  <SelectItem value="numbers">Numbers (0123456789)</SelectItem>
                  <SelectItem value="letters">Letters (a-z)</SelectItem>
                  <SelectItem value="extended">Extended ( ░▒▓█)</SelectItem>
                  <SelectItem value="blocks">Blocks ( ▁▂▃▄▅▆▇█)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Character Set */}
            <div className="space-y-2">
              <Label>Custom Characters</Label>
              <Input
                value={customCharSet}
                onChange={(e) => {
                  setCustomCharSet(e.target.value);
                  if (getCurrentCharSetKey() === 'custom') {
                    updateSetting('characterSet', e.target.value);
                  }
                }}
                placeholder="Enter characters from light to dark"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Characters should be ordered from lightest to darkest density
              </p>
            </div>

            {/* Character Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                {settings.characterSet.split('').map((char, index) => (
                  <span key={index} className="mr-1">
                    {char === ' ' ? '·' : char}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
