import { BadgeOptions, BadgeStyle, BadgeShape } from './types';
import { normalizeColor } from './text-metrics';

export interface ThemeDefinition {
  name: BadgeStyle;
  defaultLabelColor: string;
  defaultColor: string;
  defaultBorderColor?: string;
  borderWidth?: number;
  glowColor?: string;
  glowIntensity?: number;
  hasSpecular?: boolean;
  filterId?: string;
}

export const THEMES: Record<BadgeStyle, ThemeDefinition> = {
  flat: {
    name: 'flat',
    defaultLabelColor: '#24292f',
    defaultColor: '#22c55e',
    defaultBorderColor: 'transparent',
    borderWidth: 0,
    hasSpecular: false,
  },
  'flat-square': {
    name: 'flat-square',
    defaultLabelColor: '#24292f',
    defaultColor: '#22c55e',
    defaultBorderColor: 'transparent',
    borderWidth: 0,
    hasSpecular: false,
  },
  plastic: {
    name: 'plastic',
    defaultLabelColor: '#374151',
    defaultColor: '#3b82f6',
    defaultBorderColor: 'transparent',
    borderWidth: 0,
    hasSpecular: true,
  },
  glass: {
    name: 'glass',
    defaultLabelColor: 'rgba(255, 255, 255, 0.08)',
    defaultColor: 'rgba(99, 102, 241, 0.4)',
    defaultBorderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    glowColor: 'rgba(99, 102, 241, 0.3)',
    glowIntensity: 0.5,
    hasSpecular: true,
    filterId: 'glass-glow',
  },
  neon: {
    name: 'neon',
    defaultLabelColor: '#0a0d14',
    defaultColor: '#00f0ff',
    defaultBorderColor: '#00f0ff',
    borderWidth: 1.5,
    glowColor: '#00f0ff',
    glowIntensity: 0.8,
    hasSpecular: false,
    filterId: 'neon-glow',
  },
  hyggshi: {
    name: 'hyggshi',
    defaultLabelColor: '#0f172a',
    defaultColor: '#6366f1',
    defaultBorderColor: 'url(#hyggshi-border-grad)',
    borderWidth: 1.5,
    glowColor: '#8b5cf6',
    glowIntensity: 0.7,
    hasSpecular: true,
    filterId: 'hyggshi-glow',
  },
  custom: {
    name: 'custom',
    defaultLabelColor: '#1e293b',
    defaultColor: '#3b82f6',
    defaultBorderColor: '#475569',
    borderWidth: 1,
    glowIntensity: 0.3,
    hasSpecular: false,
  },
};

/**
 * Generates SVG path definition for various badge shapes (Cyberpunk, Hexagon, Pill, etc.)
 */
export function getShapePath(shape: BadgeShape, width: number, height: number, radius: number = 4): string {
  switch (shape) {
    case 'pill': {
      const r = height / 2;
      return `M${r},0 h${width - 2 * r} a${r},${r} 0 0 1 ${r},${r} v0 a${r},${r} 0 0 1 -${r},${r} h-${width - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v0 a${r},${r} 0 0 1 ${r},-${r} Z`;
    }
    case 'cyberpunk': {
      // Cut top-left and bottom-right corners
      const cut = Math.min(8, height / 2.5);
      return `M${cut},0 L${width},0 L${width},${height - cut} L${width - cut},${height} L0,${height} L0,${cut} Z`;
    }
    case 'hexagon': {
      // Pointed / chamfered left and right edges
      const cut = Math.min(7, height / 2);
      return `M${cut},0 L${width - cut},0 L${width},${height / 2} L${width - cut},${height} L${cut},${height} L0,${height / 2} Z`;
    }
    case 'shield': {
      const bottomCut = Math.min(6, height / 3);
      return `M0,0 L${width},0 L${width},${height - bottomCut} L${width / 2},${height} L0,${height - bottomCut} Z`;
    }
    case 'square': {
      return `M0,0 h${width} v${height} h-${width} Z`;
    }
    case 'rounded':
    default: {
      const r = Math.min(radius, height / 2);
      return `M${r},0 h${width - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${height - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${width - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${height - 2 * r} a${r},${r} 0 0 1 ${r},-${r} Z`;
    }
  }
}
