import { BadgeOptions, RenderedBadgeResult } from './types';
import { calculateTextWidth, normalizeColor } from './text-metrics';
import { getIcon } from './icons';
import { THEMES, getShapePath } from './themes';

// Content-based deterministic hash for SVG IDs — 100% stable between SSR and Client
function getBadgeUid(label: string, message: string, style: string, shape: string): string {
  const str = `${label}_${message}_${style}_${shape}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'b' + Math.abs(hash).toString(36);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderBadge(options: BadgeOptions): RenderedBadgeResult {
  const style = options.style || 'flat';
  const theme = THEMES[style] || THEMES.flat;

  const rawLabel = options.label !== undefined ? options.label.trim() : '';
  const rawMessage = options.message ? options.message.trim() : '';
  const hasLabel = rawLabel.length > 0;

  const labelText = escapeXml(rawLabel);
  const messageText = escapeXml(rawMessage);

  const fontSize = options.fontSize || 11;
  const height = options.height || (style === 'hyggshi' || style === 'neon' ? 24 : 20);
  const paddingX = options.paddingX !== undefined ? options.paddingX : 8;
  const gap = 4;
  const letterSpacing = options.letterSpacing || 0;

  // Icon handling
  const iconData = getIcon(options.icon);
  const iconWidth = iconData ? (options.iconWidth || 14) : 0;
  const iconMargin = iconData ? 4 : 0;

  // Measure text accurately
  const labelTextWidth = hasLabel ? calculateTextWidth(rawLabel, fontSize, letterSpacing) : 0;
  const messageTextWidth = calculateTextWidth(rawMessage, fontSize, letterSpacing);

  // Compute widths
  let labelWidth = 0;
  if (hasLabel) {
    labelWidth = paddingX + (iconData && options.iconPosition !== 'right' ? iconWidth + iconMargin : 0) + labelTextWidth + paddingX;
  } else if (iconData && options.iconPosition !== 'right') {
    labelWidth = paddingX + iconWidth + iconMargin;
  }

  let messageWidth = paddingX + messageTextWidth + paddingX;
  if (iconData && options.iconPosition === 'right') {
    messageWidth += iconMargin + iconWidth;
  }

  const totalWidth = Math.max(30, labelWidth + messageWidth);

  // Colors
  const labelBg = normalizeColor(options.labelColor || theme.defaultLabelColor);
  const messageBg = normalizeColor(options.color || theme.defaultColor);
  const iconColor = options.iconColor ? normalizeColor(options.iconColor) : (iconData?.defaultColor || '#ffffff');
  const shape = options.shape || (style === 'flat-square' ? 'square' : style === 'hyggshi' ? 'cyberpunk' : 'rounded');
  const cornerRadius = options.cornerRadius !== undefined ? options.cornerRadius : (shape === 'pill' ? height / 2 : 4);
  const borderWidth = options.borderWidth !== undefined ? options.borderWidth : (theme.borderWidth || 0);

  // Font family (ensure single quotes for XML attribute safety)
  const defaultFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  const fontFamily = (options.fontFamily || defaultFont).replace(/"/g, "'");

  // Positions
  const textY = Math.round(height / 2 + fontSize / 3.2);
  const iconY = Math.round((height - iconWidth) / 2);

  let iconX = paddingX;
  let labelTextX = paddingX;
  if (iconData && options.iconPosition !== 'right') {
    labelTextX = paddingX + iconWidth + iconMargin;
  }

  const messageTextX = labelWidth + paddingX;

  // Shapes & Paths
  const badgePath = getShapePath(shape, totalWidth, height, cornerRadius);

  // SVG Unique IDs (deterministic content hash)
  const uid = getBadgeUid(rawLabel, rawMessage, style, shape);
  const clipId = `clip-${uid}`;
  const gradId = `grad-${uid}`;
  const filterId = `filter-${uid}`;
  const shineGradId = `shine-grad-${uid}`;

  // Animations CSS inside SVG
  let animCss = '';
  if (options.animation === 'pulse') {
    animCss = `
      @keyframes pulseAnim {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(0.98); }
      }
      .badge-root { animation: pulseAnim 2s infinite ease-in-out; transform-origin: center; }
    `;
  } else if (options.animation === 'glow' || style === 'neon') {
    animCss = `
      @keyframes neonGlow {
        0%, 100% { filter: drop-shadow(0 0 2px ${messageBg}) drop-shadow(0 0 6px ${messageBg}); }
        50% { filter: drop-shadow(0 0 4px ${messageBg}) drop-shadow(0 0 10px ${messageBg}); }
      }
      .badge-glow { animation: neonGlow 2.5s infinite alternate ease-in-out; }
    `;
  } else if (options.animation === 'shine') {
    animCss = `
      @keyframes shineSlide {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(150%); }
      }
      .shine-overlay { animation: shineSlide 3s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    `;
  } else if (options.animation === 'gradient-shift') {
    animCss = `
      @keyframes gradShift {
        0% { stop-color: #6366f1; }
        50% { stop-color: #ec4899; }
        100% { stop-color: #06b6d4; }
      }
      .anim-stop-1 { animation: gradShift 4s infinite alternate; }
    `;
  }

  // Build SVG XML
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${labelText ? `${labelText}: ` : ''}${messageText}">`;
  svg += `<title>${labelText ? `${labelText}: ` : ''}${messageText}</title>`;

  // Defs section
  svg += `<defs>`;
  svg += `<clipPath id="${clipId}"><path d="${badgePath}" /></clipPath>`;

  // Gradients
  svg += `
    <linearGradient id="hyggshi-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="hyggshi-border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" class="anim-stop-1" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="glass-specular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="${shineGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="plastic-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="51%" stop-color="#000000" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
    </linearGradient>
  `;

  // Filter for Neon glow
  if (style === 'neon' || options.animation === 'glow' || style === 'glass' || style === 'hyggshi') {
    const glowColorHex = options.glowColor || (style === 'neon' ? messageBg : style === 'hyggshi' ? '#8b5cf6' : 'rgba(255,255,255,0.4)');
    svg += `
      <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="${style === 'neon' ? '2.5' : '1.5'}" flood-color="${glowColorHex}" flood-opacity="${options.glowIntensity ?? 0.8}" />
      </filter>
    `;
  }

  if (animCss) {
    svg += `<style>${animCss}</style>`;
  }

  svg += `</defs>`;

  // Group root
  const rootClass = options.animation === 'pulse' ? 'badge-root' : (style === 'neon' || options.animation === 'glow' ? 'badge-glow' : '');
  const filterAttr = (style === 'neon' || style === 'hyggshi') ? `filter="url(#${filterId})"` : '';
  svg += `<g class="${rootClass}" ${filterAttr}>`;

  // Clipped Content Area
  svg += `<g clip-path="url(#${clipId})">`;

  // Backgrounds
  if (style === 'hyggshi') {
    // Holographic dark mesh background
    svg += `<rect width="${totalWidth}" height="${height}" fill="${labelBg}" />`;
    if (hasLabel) {
      svg += `<rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="url(#hyggshi-grad)" />`;
    } else {
      svg += `<rect width="${totalWidth}" height="${height}" fill="url(#hyggshi-grad)" />`;
    }
    // High-tech subtle grid/mesh line
    svg += `<line x1="${labelWidth}" y1="0" x2="${labelWidth}" y2="${height}" stroke="rgba(255,255,255,0.2)" stroke-width="1" />`;
  } else if (style === 'glass') {
    svg += `<rect width="${totalWidth}" height="${height}" fill="${labelBg}" fill-opacity="0.75" />`;
    if (hasLabel) {
      svg += `<rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="${messageBg}" fill-opacity="0.8" />`;
    }
    svg += `<rect width="${totalWidth}" height="${height}" fill="url(#glass-specular)" />`;
  } else if (style === 'neon') {
    svg += `<rect width="${totalWidth}" height="${height}" fill="${labelBg}" />`;
    if (hasLabel) {
      svg += `<rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="${messageBg}" fill-opacity="0.2" />`;
    } else {
      svg += `<rect width="${totalWidth}" height="${height}" fill="${messageBg}" fill-opacity="0.15" />`;
    }
  } else {
    // Flat / Plastic / Standard
    if (hasLabel) {
      svg += `<rect width="${labelWidth}" height="${height}" fill="${labelBg}" />`;
      svg += `<rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="${messageBg}" />`;
    } else {
      svg += `<rect width="${totalWidth}" height="${height}" fill="${messageBg}" />`;
    }
    if (style === 'plastic') {
      svg += `<rect width="${totalWidth}" height="${height}" fill="url(#plastic-gloss)" />`;
    }
  }

  // Shine sweep animation overlay
  if (options.animation === 'shine') {
    svg += `<rect class="shine-overlay" x="0" y="0" width="${totalWidth}" height="${height}" fill="url(#${shineGradId})" transform="skewX(-20)" />`;
  }

  svg += `</g>`; // End clip-path

  // Outer Border Stroke
  if (borderWidth > 0 || style === 'hyggshi' || style === 'neon' || style === 'glass') {
    const strokeColor = options.borderColor || (style === 'hyggshi' ? 'url(#hyggshi-border-grad)' : style === 'neon' ? messageBg : style === 'glass' ? 'rgba(255,255,255,0.4)' : '#475569');
    const strokeWidth = borderWidth > 0 ? borderWidth : (style === 'neon' ? 1.5 : 1);
    const strokeDash = options.borderStyle === 'dashed' ? 'stroke-dasharray="3 3"' : '';
    svg += `<path d="${badgePath}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${strokeDash} />`;
  }

  // Text and Icon rendering
  svg += `<g fill="#fff" text-anchor="start" font-family="${fontFamily}" font-size="${fontSize}" font-weight="600" text-rendering="geometricPrecision">`;

  // Render Icon
  if (iconData) {
    const iX = options.iconPosition === 'right' ? totalWidth - paddingX - iconWidth : iconX;
    svg += `<g transform="translate(${iX}, ${iconY})">`;
    svg += `<svg viewBox="${iconData.viewBox || '0 0 24 24'}" width="${iconWidth}" height="${iconWidth}">`;
    svg += `<path d="${iconData.path}" fill="${iconColor}" />`;
    svg += `</svg>`;
    svg += `</g>`;
  }

  // Render Label text with crisp shadow
  if (hasLabel) {
    if (style !== 'glass') {
      svg += `<text x="${labelTextX}" y="${textY + 1}" fill="#010101" fill-opacity="0.3">${labelText}</text>`;
    }
    svg += `<text x="${labelTextX}" y="${textY}" fill="#ffffff">${labelText}</text>`;
  }

  // Render Message text with crisp shadow
  const msgColor = style === 'neon' ? messageBg : '#ffffff';
  if (style !== 'glass' && style !== 'neon') {
    svg += `<text x="${messageTextX}" y="${textY + 1}" fill="#010101" fill-opacity="0.3">${messageText}</text>`;
  }
  svg += `<text x="${messageTextX}" y="${textY}" fill="${msgColor}">${messageText}</text>`;

  svg += `</g>`; // End text group
  svg += `</g>`; // End root group
  svg += `</svg>`;

  return {
    svg,
    width: totalWidth,
    height
  };
}
