export type BadgeStyle = 'flat' | 'glass' | 'neon' | 'hyggshi' | 'custom' | 'plastic' | 'flat-square';

export type BadgeShape = 'rounded' | 'square' | 'pill' | 'cyberpunk' | 'hexagon' | 'shield';

export type BadgeAnimation = 'none' | 'pulse' | 'glow' | 'shine' | 'neon-flicker' | 'gradient-shift';

export type BadgeBorder = 'none' | 'solid' | 'dashed' | 'gradient' | 'glow';

export interface BadgeOptions {
  /** Left side text (optional) */
  label?: string;
  /** Right side text / main content */
  message: string;
  /** Left background color (hex, rgb, or named) */
  labelColor?: string;
  /** Right background color or primary status color */
  color?: string;
  /** Badge theme/style */
  style?: BadgeStyle;
  /** Badge outer contour shape */
  shape?: BadgeShape;
  /** Built-in icon name or custom SVG path */
  icon?: string;
  /** Color of the icon */
  iconColor?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Icon width in px (default ~14px) */
  iconWidth?: number;
  /** Custom corner radius for 'custom' or 'rounded' shape */
  cornerRadius?: number;
  /** Border style */
  borderStyle?: BadgeBorder;
  /** Border stroke color or gradient ID */
  borderColor?: string;
  /** Border width in px */
  borderWidth?: number;
  /** Glow drop-shadow color */
  glowColor?: string;
  /** Glow intensity (0 to 1) */
  glowIntensity?: number;
  /** Font family for text */
  fontFamily?: string;
  /** Base font size in px (default 11) */
  fontSize?: number;
  /** Letter spacing in px */
  letterSpacing?: number;
  /** Horizontal padding per side in px */
  paddingX?: number;
  /** Vertical badge height or padding */
  height?: number;
  /** Dynamic CSS animation inside SVG */
  animation?: BadgeAnimation;
  /** Show subtle 3D drop shadow */
  shadow?: boolean;
  /** Custom gradient stops if style is custom/gradient */
  gradient?: {
    from: string;
    to: string;
    angle?: number;
  };
}

export interface RenderedBadgeResult {
  svg: string;
  width: number;
  height: number;
}
