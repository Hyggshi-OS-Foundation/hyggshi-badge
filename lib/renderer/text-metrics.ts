/**
 * Accurate character width measurement for SVG badges
 * Based on Verdana 110 (11px at scale 10) font metrics
 */

// Widths for ASCII chars 32..126 at font-size: 110 (Verdana)
const VERDANA_WIDTH_TABLE: Record<string, number> = {
  ' ': 37, '!': 39, '"': 50, '#': 76, '$': 65, '%': 105, '&': 83, '\'': 27,
  '(': 44, ')': 44, '*': 50, '+': 76, ',': 37, '-': 44, '.': 37, '/': 44,
  '0': 65, '1': 65, '2': 65, '3': 65, '4': 65, '5': 65, '6': 65, '7': 65,
  '8': 65, '9': 65, ':': 37, ';': 37, '<': 76, '=': 76, '>': 76, '?': 53,
  '@': 97, 'A': 74, 'B': 71, 'C': 76, 'D': 78, 'E': 67, 'F': 63, 'G': 80,
  'H': 79, 'I': 44, 'J': 47, 'K': 72, 'L': 60, 'M': 95, 'N': 78, 'O': 81,
  'P': 67, 'Q': 81, 'R': 73, 'S': 69, 'T': 67, 'U': 76, 'V': 72, 'W': 102,
  'X': 71, 'Y': 68, 'Z': 66, '[': 44, '\\': 44, ']': 44, '^': 76, '_': 57,
  '`': 61, 'a': 61, 'b': 65, 'c': 55, 'd': 65, 'e': 61, 'f': 39, 'g': 65,
  'h': 65, 'i': 29, 'j': 34, 'k': 60, 'l': 29, 'm': 97, 'n': 65, 'o': 65,
  'p': 65, 'q': 65, 'r': 46, 's': 52, 't': 44, 'u': 65, 'v': 59, 'w': 86,
  'x': 59, 'y': 59, 'z': 54, '{': 47, '|': 44, '}': 47, '~': 76
};

const DEFAULT_CHAR_WIDTH = 65;

/**
 * Calculates accurate rendered width in pixels for a given text string and font size
 */
export function calculateTextWidth(
  text: string,
  fontSize: number = 11,
  letterSpacing: number = 0
): number {
  if (!text) return 0;

  let totalWidth = 0;
  const scale = fontSize / 11;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const rawWidth = VERDANA_WIDTH_TABLE[char] ?? DEFAULT_CHAR_WIDTH;
    // convert from font units (scale 10) to px
    totalWidth += (rawWidth / 10) * scale + letterSpacing;
  }

  // Add 1px padding for rendering safety
  return Math.ceil(totalWidth);
}

/**
 * Format numbers into human-readable compact notation (e.g. 1.2k, 4.5M)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

/**
 * Parse color string to safe hex / rgb format or resolve common names
 */
export function normalizeColor(color?: string): string {
  if (!color) return '#4c1';
  const clean = color.trim().toLowerCase();

  const PRESETS: Record<string, string> = {
    brightgreen: '#4c1',
    green: '#97ca00',
    yellowgreen: '#a4a61d',
    yellow: '#dfb317',
    orange: '#fe7d37',
    red: '#e05d44',
    blue: '#007ec6',
    grey: '#555',
    gray: '#555',
    lightgrey: '#9f9f9f',
    lightgray: '#9f9f9f',
    purple: '#6f42c1',
    pink: '#e83e8c',
    cyan: '#17a2b8',
    teal: '#20c997',
    black: '#111827',
    dark: '#1e293b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    neon: '#00f0ff',
    violet: '#8b5cf6',
    hyggshi: '#6366f1',
  };

  if (PRESETS[clean]) return PRESETS[clean];
  if (/^[0-9a-f]{3,8}$/i.test(clean)) return `#${clean}`;
  return clean;
}
