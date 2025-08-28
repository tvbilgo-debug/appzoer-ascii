"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface TextToASCIIProps {
  onAsciiResult: (result: string) => void;
}

// Popular ASCII art fonts with better patterns
const ASCII_FONTS = [
  { name: 'Standard', value: 'standard' },
  { name: 'Big', value: 'big' },
  { name: 'Block', value: 'block' },
  { name: 'Bubble', value: 'bubble' },
  { name: 'Digital', value: 'digital' },
  { name: 'Lean', value: 'lean' },
  { name: 'Mini', value: 'mini' },
  { name: 'Script', value: 'script' },
  { name: 'Shadow', value: 'shadow' },
  { name: 'Slant', value: 'slant' },
  { name: 'Small', value: 'small' },
  { name: 'Speed', value: 'speed' },
  { name: 'Star Wars', value: 'starwars' },
  { name: 'Straight', value: 'straight' },
  { name: 'Thin', value: 'thin' },
  { name: '3D', value: '3d' },
  { name: 'Bloody', value: 'bloody' },
  { name: 'Ghost', value: 'ghost' },
  { name: 'Poison', value: 'poison' },
  { name: 'Fire', value: 'fire' },
  { name: 'Gothic', value: 'gothic' },
  { name: 'Graffiti', value: 'graffiti' },
  { name: 'Hollywood', value: 'hollywood' },
  { name: 'Cyber', value: 'cyber' },
  { name: 'Doom', value: 'doom' },
  { name: 'Epic', value: 'epic' },
  { name: 'Gradient', value: 'gradient' },
  { name: 'Heart', value: 'heart' },
  { name: 'Star', value: 'star' },
  { name: 'Stellar', value: 'stellar' },
  { name: 'USA Flag', value: 'usa' },
  { name: 'Varsity', value: 'varsity' },
  { name: 'Wow', value: 'wow' }
];

// ASCII art patterns for each character
const ASCII_PATTERNS: { [key: string]: { [key: string]: string[] } } = {
  standard: {
    'A': ['  A  ', ' A A ', 'AAAAA', 'A   A', 'A   A'],
    'B': ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
    'C': [' CCCC', 'C    ', 'C    ', 'C    ', ' CCCC'],
    'D': ['DDDD ', 'D   D', 'D   D', 'D   D', 'DDDD '],
    'E': ['EEEEE', 'E    ', 'EEEE ', 'E    ', 'EEEEE'],
    'F': ['FFFFF', 'F    ', 'FFFF ', 'F    ', 'F    '],
    'G': [' GGGG', 'G    ', 'G  GG', 'G   G', ' GGGG'],
    'H': ['H   H', 'H   H', 'HHHHH', 'H   H', 'H   H'],
    'I': [' IIII', '  I  ', '  I  ', '  I  ', ' IIII'],
    'J': ['   JJ', '    J', '    J', 'J   J', ' JJJ '],
    'K': ['K   K', 'K  K ', 'KKK  ', 'K  K ', 'K   K'],
    'L': ['L    ', 'L    ', 'L    ', 'L    ', 'LLLLL'],
    'M': ['M   M', 'MM MM', 'M M M', 'M   M', 'M   M'],
    'N': ['N   N', 'NN  N', 'N N N', 'N  NN', 'N   N'],
    'O': [' OOO ', 'O   O', 'O   O', 'O   O', ' OOO '],
    'P': ['PPPP ', 'P   P', 'PPPP ', 'P    ', 'P    '],
    'Q': [' QQQ ', 'Q   Q', 'Q   Q', 'Q  Q ', ' QQ Q'],
    'R': ['RRRR ', 'R   R', 'RRRR ', 'R  R ', 'R   R'],
    'S': [' SSSS', 'S    ', ' SSSS', '    S', 'SSSS '],
    'T': ['TTTTT', '  T  ', '  T  ', '  T  ', '  T  '],
    'U': ['U   U', 'U   U', 'U   U', 'U   U', ' UUU '],
    'V': ['V   V', 'V   V', 'V   V', ' V V ', '  V  '],
    'W': ['W   W', 'W   W', 'W W W', 'WW WW', 'W   W'],
    'X': ['X   X', ' X X ', '  X  ', ' X X ', 'X   X'],
    'Y': ['Y   Y', ' Y Y ', '  Y  ', '  Y  ', '  Y  '],
    'Z': ['ZZZZZ', '   Z ', '  Z  ', ' Z   ', 'ZZZZZ']
  },
  big: {
    'A': ['    AA    ', '   AAAA   ', '  AA  AA  ', ' AA    AA ', 'AAAAAAAAA', 'AA      AA', 'AA      AA'],
    'B': ['BBBBBBB  ', 'BB     BB ', 'BB     BB ', 'BBBBBBB  ', 'BB     BB ', 'BB     BB ', 'BBBBBBB  '],
    'C': ['  CCCCCC ', ' CC      ', 'CC        ', 'CC        ', 'CC        ', ' CC      ', '  CCCCCC '],
    'D': ['DDDDDDD  ', 'DD     DD ', 'DD      DD', 'DD      DD', 'DD      DD', 'DD     DD ', 'DDDDDDD  '],
    'E': ['EEEEEEEEE', 'EE        ', 'EE        ', 'EEEEEEE  ', 'EE        ', 'EE        ', 'EEEEEEEEE'],
    'F': ['FFFFFFFFF', 'FF        ', 'FF        ', 'FFFFFFF  ', 'FF        ', 'FF        ', 'FF        '],
    'G': ['  GGGGGG ', ' GG      ', 'GG        ', 'GG   GGG ', 'GG      GG', ' GG     GG', '  GGGGGG '],
    'H': ['HH      HH', 'HH      HH', 'HH      HH', 'HHHHHHHHH', 'HH      HH', 'HH      HH', 'HH      HH'],
    'I': [' IIIIIII ', '    I    ', '    I    ', '    I    ', '    I    ', '    I    ', ' IIIIIII '],
    'J': ['        JJ', '         J', '         J', '         J', 'JJ       J', ' JJ     J ', '  JJJJJ  '],
    'K': ['KK      KK', 'KK     KK ', 'KK    KK  ', 'KKKKKK   ', 'KK    KK  ', 'KK     KK ', 'KK      KK'],
    'L': ['LL        ', 'LL        ', 'LL        ', 'LL        ', 'LL        ', 'LL        ', 'LLLLLLLLL'],
    'M': ['MM        MM', 'MMM      MMM', 'MM MM  MM MM', 'MM  MMMM  MM', 'MM   MM   MM', 'MM        MM', 'MM        MM'],
    'N': ['NN       NN', 'NNN      NN', 'NN NN    NN', 'NN  NN   NN', 'NN   NN  NN', 'NN    NN NN', 'NN     NNNN'],
    'O': ['   OOOOOO   ', '  OO      OO  ', ' OO        OO ', 'OO          OO', 'OO          OO', ' OO        OO ', '  OO      OO  ', '   OOOOOO   '],
    'P': ['PPPPPPPPP  ', 'PP       PP ', 'PP       PP ', 'PP       PP ', 'PPPPPPPPP  ', 'PP          ', 'PP          '],
    'Q': ['   QQQQQQ   ', '  QQ      QQ  ', ' QQ        QQ ', 'QQ          QQ', 'QQ          QQ', ' QQ        QQ ', '  QQ      QQ  ', '   QQQQQQ   ', '         QQ'],
    'R': ['RRRRRRRRR  ', 'RR       RR ', 'RR       RR ', 'RR       RR ', 'RRRRRRRRR  ', 'RR      RR ', 'RR       RR '],
    'S': ['  SSSSSSSS ', 'SS         ', 'SS         ', ' SSSSSSSS ', '         SS', '         SS', 'SSSSSSSSS  '],
    'T': ['TTTTTTTTTTT', '     TT     ', '     TT     ', '     TT     ', '     TT     ', '     TT     ', '     TT     '],
    'U': ['UU        UU', 'UU        UU', 'UU        UU', 'UU        UU', 'UU        UU', 'UU        UU', ' UUUUUUUUUU '],
    'V': ['VV        VV', 'VV        VV', ' VV      VV ', ' VV      VV ', '  VV    VV  ', '  VV    VV  ', '   VVVVVV   '],
    'W': ['WW        WW', 'WW        WW', 'WW        WW', 'WW   WW   WW', 'WW  WWWW  WW', 'WW WW  WW WW', 'WWW      WWW'],
    'X': ['XX        XX', ' XX      XX ', '  XX    XX  ', '   XX  XX   ', '    XXXX    ', '   XX  XX   ', '  XX    XX  ', ' XX      XX ', 'XX        XX'],
    'Y': ['YY        YY', ' YY      YY ', '  YY    YY  ', '   YY  YY   ', '    YYYY    ', '     YY     ', '     YY     '],
    'Z': ['ZZZZZZZZZZZ', '         ZZ ', '        ZZ  ', '       ZZ   ', '      ZZ    ', '     ZZ     ', 'ZZZZZZZZZZZ']
  },
  block: {
    'A': ['█████', '█   █', '█████', '█   █', '█   █'],
    'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
    'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
    'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
    'E': ['█████', '█    ', '████ ', '█    ', '█████'],
    'F': ['█████', '█    ', '████ ', '█    ', '█    '],
    'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
    'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
    'I': [' ████', '  █  ', '  █  ', '  █  ', ' ████'],
    'J': ['   ██', '    █', '    █', '█   █', ' ███ '],
    'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
    'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
    'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
    'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
    'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
    'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
    'Q': [' ███ ', '█   █', '█   █', '█  █ ', ' ██ █'],
    'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
    'S': [' ████', '█    ', ' ████', '    █', '████ '],
    'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
    'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
    'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
    'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
    'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
    'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
    'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████']
  }
};

export function TextToASCII({ onAsciiResult }: TextToASCIIProps) {
  const [text, setText] = useState('');
  const [font, setFont] = useState('standard');
  const [asciiResult, setAsciiResult] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const convertTextToASCII = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsConverting(true);
    try {
      const result = await generateASCIIArt(text, font);
      setAsciiResult(result);
      onAsciiResult(result);
      toast.success('Text converted to ASCII art!');
    } catch (error) {
      toast.error('Failed to convert text to ASCII art');
      console.error('Text to ASCII conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const generateASCIIArt = async (inputText: string, selectedFont: string): Promise<string> => {
    const lines = inputText.toUpperCase().split('\n');
    let result = '';

    if (selectedFont === 'standard' || selectedFont === 'big' || selectedFont === 'block') {
      // Use predefined ASCII patterns
      const patterns = ASCII_PATTERNS[selectedFont];
      if (!patterns) {
        return generateSimplePattern(inputText, selectedFont);
      }

      for (const line of lines) {
        if (line.trim() === '') {
          result += '\n';
          continue;
        }

        const charLines: string[] = [];
        for (let i = 0; i < 5; i++) {
          charLines.push('');
        }

        for (const char of line) {
          if (char === ' ') {
            for (let i = 0; i < 5; i++) {
              charLines[i] += '     ';
            }
          } else if (patterns[char]) {
            for (let i = 0; i < 5; i++) {
              charLines[i] += patterns[char][i] + ' ';
            }
          } else {
            for (let i = 0; i < 5; i++) {
              charLines[i] += '     ';
            }
          }
        }

        result += charLines.join('\n') + '\n\n';
      }
    } else {
      // Use simple patterns for other fonts
      result = generateSimplePattern(inputText, selectedFont);
    }

    return result.trim();
  };

  const generateSimplePattern = (inputText: string, selectedFont: string): string => {
    const patterns: { [key: string]: (char: string) => string } = {
      'bubble': (char) => `(${char})`,
      'digital': (char) => `|${char}|`,
      'lean': (char) => `/${char}/`,
      'mini': (char) => char.toLowerCase(),
      'script': (char) => `~${char}~`,
      'shadow': (char) => `${char}_`,
      'slant': (char) => `\\${char}\\`,
      'small': (char) => char.toLowerCase(),
      'speed': (char) => `>${char}<`,
      'starwars': (char) => `*${char}*`,
      'straight': (char) => `|${char}|`,
      'thin': (char) => `'${char}'`,
      '3d': (char) => `[${char}]`,
      'bloody': (char) => `🩸${char}🩸`,
      'ghost': (char) => `👻${char}👻`,
      'poison': (char) => `☠️${char}☠️`,
      'fire': (char) => `🔥${char}🔥`,
      'gothic': (char) => `⚰️${char}⚰️`,
      'graffiti': (char) => `🎨${char}🎨`,
      'hollywood': (char) => `🎬${char}🎬`,
      'cyber': (char) => `💻${char}💻`,
      'doom': (char) => `😈${char}😈`,
      'epic': (char) => `⚡${char}⚡`,
      'gradient': (char) => `🌈${char}🌈`,
      'heart': (char) => `💖${char}💖`,
      'star': (char) => `⭐${char}⭐`,
      'stellar': (char) => `✨${char}✨`,
      'usa': (char) => `🇺🇸${char}🇺🇸`,
      'varsity': (char) => `🏆${char}🏆`,
      'wow': (char) => `😮${char}😮`
    };

    const pattern = patterns[selectedFont] || patterns['standard'];
    
    return inputText.split('\n').map(line => 
      line.split('').map(char => {
        if (char === ' ') return ' ';
        if (char.match(/[A-Za-z0-9]/)) return pattern(char.toUpperCase());
        return char;
      }).join('')
    ).join('\n');
  };

  const copyToClipboard = async () => {
    if (!asciiResult) {
      toast.error('No ASCII art to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(asciiResult);
      toast.success('ASCII art copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadAsText = () => {
    if (!asciiResult) {
      toast.error('No ASCII art to download');
      return;
    }
    
    const blob = new Blob([asciiResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('ASCII art downloaded!');
    
    // Auto-refresh after download
    setTimeout(() => {
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setText('');
    setFont('standard');
    setAsciiResult('');
    onAsciiResult('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">T</span>
          Text to ASCII
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter Text</Label>
          <Textarea
            id="text-input"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-select">ASCII Font Style</Label>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font style" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {ASCII_FONTS.map((fontOption) => (
                <SelectItem key={fontOption.value} value={fontOption.value}>
                  {fontOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={convertTextToASCII} 
            disabled={!text.trim() || isConverting}
            className="flex-1"
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Converting...
              </>
            ) : (
              'Convert to ASCII'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={isConverting}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {asciiResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>ASCII Result</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadAsText}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg border">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                {asciiResult}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
