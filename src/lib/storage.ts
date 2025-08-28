
import { ConversionPreset } from '@/types/ascii-converter';

const STORAGE_KEYS = {
  PRESETS: 'ascii-converter-presets',
  LAST_SETTINGS: 'ascii-converter-last-settings'
};

export class LocalStorage {
  static savePresets(presets: ConversionPreset[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  }

  static loadPresets(): ConversionPreset[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load presets:', error);
      return [];
    }
  }

  static saveLastSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save last settings:', error);
    }
  }

  static loadLastSettings(): any {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load last settings:', error);
      return null;
    }
  }

  static exportData(): string {
    const presets = this.loadPresets();
    const lastSettings = this.loadLastSettings();
    
    return JSON.stringify({
      presets,
      lastSettings,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.presets) {
        this.savePresets(data.presets);
      }
      
      if (data.lastSettings) {
        this.saveLastSettings(data.lastSettings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}
