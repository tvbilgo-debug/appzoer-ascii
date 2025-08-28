
export interface ConversionSettings {
  width: number;
  maintainAspectRatio: boolean;
  characterSet: string;
  reverseMapping: boolean;
  brightness: number;
  contrast: number;
  gamma: number;
  samplingAlgorithm: 'nearest' | 'bilinear' | 'bicubic';
  colorMode: 'grayscale' | 'color';
}

export interface ConversionPreset {
  id: string;
  name: string;
  settings: ConversionSettings;
  createdAt: string;
}

export interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: string | { ascii: string; colors?: string[][] };
  error?: string;
  settings: ConversionSettings;
}

export interface ImageInfo {
  width: number;
  height: number;
  size: number;
  type: string;
}

export const DEFAULT_SETTINGS: ConversionSettings = {
  width: 80,
  maintainAspectRatio: true,
  characterSet: ' .:-=+*#%@',
  reverseMapping: false,
  brightness: 0,
  contrast: 0,
  gamma: 1.0,
  samplingAlgorithm: 'bilinear',
  colorMode: 'grayscale'
};

export const CHARACTER_SETS = {
  default: ' .:-=+*#%@',
  numbers: '0123456789',
  letters: 'abcdefghijklmnopqrstuvwxyz',
  extended: ' ░▒▓█',
  blocks: ' ▁▂▃▄▅▆▇█'
};
