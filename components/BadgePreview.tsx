'use client';

import { useState, useEffect, useMemo } from 'react';
import { BadgeOptions } from '@/lib/renderer/types';
import { renderBadge } from '@/lib/renderer/svg-engine';

type BgMode = 'dark' | 'light' | 'white' | 'grid' | 'transparent';

interface BadgePreviewProps {
  options: BadgeOptions;
  onSizeChange?: (w: number, h: number) => void;
}

export default function BadgePreview({ options, onSizeChange }: BadgePreviewProps) {
  const [bg, setBg] = useState<BgMode>('grid');

  const { svg, width, height } = useMemo(() => {
    try {
      return renderBadge(options);
    } catch {
      return renderBadge({ message: 'preview error', color: '#ef4444' });
    }
  }, [options]);

  useEffect(() => {
    onSizeChange?.(width, height);
  }, [width, height, onSizeChange]);

  const svgDataUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    [svg]
  );

  const BG_BUTTONS: { mode: BgMode; label: string; style: React.CSSProperties }[] = [
    { mode: 'dark', label: 'D', style: { background: '#0d1220' } },
    { mode: 'light', label: 'L', style: { background: '#f0f4ff' } },
    { mode: 'white', label: 'W', style: { background: '#fff' } },
    { mode: 'grid', label: '⊞', style: { background: '#0d1220', fontSize: '12px' } },
    { mode: 'transparent', label: '▿', style: { background: 'repeating-conic-gradient(#1a2235 0% 25%, #0d1220 0% 50%) 0 0 / 10px 10px' } },
  ];

  return (
    <div className="preview-section">
      <div className="preview-toolbar">
        <div className="preview-toolbar-left">
          <span className="preview-label">Live Preview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="preview-bg-selector">
            {BG_BUTTONS.map(({ mode, label, style }) => (
              <button
                key={mode}
                className={`preview-bg-btn${bg === mode ? ' active' : ''}`}
                style={style}
                onClick={() => setBg(mode)}
                title={`Background: ${mode}`}
                aria-label={`Set ${mode} background`}
              >
                {bg !== mode ? '' : <span style={{ color: '#fff', fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`preview-canvas bg-${bg}`} id="badge-preview-canvas">
        <img
          src={svgDataUrl}
          alt="Badge preview"
          className="preview-badge-img"
          style={{ imageRendering: 'crisp-edges' }}
          draggable={false}
        />
        <div className="preview-size-info" style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          {width} × {height}px
        </div>
      </div>

      {/* URL Preview */}
      <URLPreview options={options} />
    </div>
  );
}

function buildUrl(options: BadgeOptions): string {
  const base = '/api/badge';
  const params = new URLSearchParams();
  if (options.message) params.set('message', options.message);
  if (options.label) params.set('label', options.label);
  if (options.color) params.set('color', options.color.replace('#', ''));
  if (options.labelColor) params.set('labelColor', options.labelColor.replace('#', ''));
  if (options.style && options.style !== 'flat') params.set('style', options.style);
  if (options.shape && options.shape !== 'rounded') params.set('shape', options.shape);
  if (options.icon) params.set('icon', options.icon);
  if (options.iconColor) params.set('iconColor', options.iconColor.replace('#', ''));
  if (options.animation && options.animation !== 'none') params.set('animation', options.animation);
  return `${base}?${params.toString()}`;
}

function URLPreview({ options }: { options: BadgeOptions }) {
  const [copied, setCopied] = useState<string | null>(null);

  const url = buildUrl(options);
  const fullUrl = `https://your-domain.vercel.app${url}`;
  const markdown = `![${options.label || 'Badge'}](${fullUrl})`;
  const html = `<img src="${fullUrl}" alt="${options.label || 'Badge'}" />`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="code-block">
        <button
          className={`code-copy-btn${copied === 'url' ? ' copied' : ''}`}
          onClick={() => copy(fullUrl, 'url')}
        >
          {copied === 'url' ? '✓ copied' : 'URL'}
        </button>
        <pre>{fullUrl}</pre>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-secondary btn-xs" style={{ flex: 1 }} onClick={() => copy(markdown, 'md')}>
          {copied === 'md' ? '✓ Markdown' : '# Markdown'}
        </button>
        <button className="btn btn-secondary btn-xs" style={{ flex: 1 }} onClick={() => copy(html, 'html')}>
          {copied === 'html' ? '✓ HTML' : '‹› HTML'}
        </button>
      </div>
    </div>
  );
}
