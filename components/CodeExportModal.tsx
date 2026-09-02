'use client';

import { useState, useEffect } from 'react';
import { BadgeOptions } from '@/lib/renderer/types';
import { renderBadge } from '@/lib/renderer/svg-engine';

interface Props {
  options: BadgeOptions;
  onClose: () => void;
}

type ExportFormat = 'markdown' | 'html' | 'url' | 'svg' | 'react';

export default function CodeExportModal({ options, onClose }: Props) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://your-app.vercel.app');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const { svg } = renderBadge(options);

  const baseUrl = `${origin}/api/badge`;

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
  if (options.fontSize) params.set('fontSize', String(options.fontSize));
  if (options.height) params.set('height', String(options.height));
  if (options.glowIntensity) params.set('glowIntensity', String(options.glowIntensity));

  const svgUrl = `${baseUrl}?${params.toString()}`;
  const altText = [options.label, options.message].filter(Boolean).join(': ');

  const EXPORTS: Record<ExportFormat, { label: string; content: string }> = {
    markdown: {
      label: 'Markdown',
      content: `![${altText}](${svgUrl})`
    },
    html: {
      label: 'HTML',
      content: `<img src="${svgUrl}" alt="${altText}" />`
    },
    url: {
      label: 'SVG URL',
      content: svgUrl
    },
    svg: {
      label: 'Raw SVG',
      content: svg
    },
    react: {
      label: 'React',
      content: `import Image from 'next/image';\n\nexport default function MyBadge() {\n  return (\n    <Image\n      src="${svgUrl}"\n      alt="${altText}"\n      width={${renderBadge(options).width}}\n      height={${renderBadge(options).height}}\n      unoptimized\n    />\n  );\n}`
    }
  };

  const activeContent = EXPORTS[activeFormat].content;

  const copy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="export-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="export-modal-title">Export Badge</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close export modal"
            id="export-modal-close"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Preview */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px'
          }}>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>

          {/* Format selector */}
          <div className="tabs">
            {(Object.keys(EXPORTS) as ExportFormat[]).map(fmt => (
              <button
                key={fmt}
                className={`tab${activeFormat === fmt ? ' active' : ''}`}
                onClick={() => setActiveFormat(fmt)}
                id={`export-tab-${fmt}`}
              >
                {EXPORTS[fmt].label}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="code-block">
            <button
              className={`code-copy-btn${copied ? ' copied' : ''}`}
              onClick={copy}
              id="export-copy-btn"
            >
              {copied ? '✓ Copied!' : '⎘ Copy'}
            </button>
            <pre style={{ userSelect: 'all', WebkitUserSelect: 'all' }}>
              {activeContent}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={copy}
              id="export-copy-btn-main"
            >
              {copied ? '✓ Copied!' : '⎘ Copy to Clipboard'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `badge-${options.label || options.message || 'badge'}.svg`;
                a.click();
              }}
              id="export-download-btn"
              title="Download SVG file"
            >
              ↓ SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
