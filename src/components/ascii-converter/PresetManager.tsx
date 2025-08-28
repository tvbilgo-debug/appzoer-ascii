
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConversionPreset, ConversionSettings } from '@/types/ascii-converter';
import { LocalStorage } from '@/lib/storage';
import { Save, Trash2, Download, Upload, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PresetManagerProps {
  currentSettings: ConversionSettings;
  onLoadPreset: (settings: ConversionSettings) => void;
}

export function PresetManager({ currentSettings, onLoadPreset }: PresetManagerProps) {
  const [presets, setPresets] = useState<ConversionPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    const savedPresets = LocalStorage.loadPresets();
    setPresets(savedPresets);
  };

  const savePreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    const newPreset: ConversionPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      settings: { ...currentSettings },
      createdAt: new Date().toISOString()
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    LocalStorage.savePresets(updatedPresets);
    
    setNewPresetName('');
    setIsDialogOpen(false);
    toast.success('Preset saved successfully!');
  };

  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    setPresets(updatedPresets);
    LocalStorage.savePresets(updatedPresets);
    toast.success('Preset deleted');
  };

  const loadPreset = (preset: ConversionPreset) => {
    onLoadPreset(preset.settings);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const exportPresets = () => {
    const dataStr = LocalStorage.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-converter-presets-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Presets exported!');
  };

  const importPresets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = LocalStorage.importData(jsonData);
        
        if (success) {
          loadPresets();
          toast.success('Presets imported successfully!');
        } else {
          toast.error('Failed to import presets');
        }
      } catch (error) {
        toast.error('Invalid preset file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPresetSummary = (settings: ConversionSettings) => {
    return `${settings.width}ch, ${settings.characterSet.length} chars`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Presets</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Current Settings as Preset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-name">Preset Name</Label>
                    <Input
                      id="preset-name"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="Enter preset name..."
                      onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Settings Preview</Label>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p>Width: {currentSettings.width} characters</p>
                      <p>Character Set: {currentSettings.characterSet}</p>
                      <p>Brightness: {currentSettings.brightness}</p>
                      <p>Contrast: {currentSettings.contrast}</p>
                      <p>Gamma: {currentSettings.gamma}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={savePreset}>
                      Save Preset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={exportPresets}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importPresets}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {presets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No presets saved yet</p>
            <p className="text-sm">Save your current settings to create your first preset</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {presets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{preset.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getPresetSummary(preset.settings)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(preset.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
