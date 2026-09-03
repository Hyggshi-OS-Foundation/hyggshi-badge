'use client';

import { BadgeOptions, BadgeStyle, BadgeShape, BadgeAnimation } from '@/lib/renderer/types';
import { ICONS } from '@/lib/renderer/icons';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { useMemo, useState, useRef, useCallback } from 'react';

interface Props {
  options: BadgeOptions;
  onChange: (options: BadgeOptions) => void;
}

const COLOR_PRESETS = [
  { color: '#22c55e', name: 'Success' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#6366f1', name: 'Indigo' },
  { color: '#8b5cf6', name: 'Violet' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#f59e0b', name: 'Warning' },
  { color: '#ef4444', name: 'Error' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#00f0ff', name: 'Neon' },
  { color: '#a855f7', name: 'Purple' },
  { color: '#10b981', name: 'Emerald' },
  { color: '#f97316', name: 'Orange' },
  { color: '#64748b', name: 'Slate' },
  { color: '#1e293b', name: 'Dark' },
  { color: '#fff', name: 'White' },
];

const STYLES: { value: BadgeStyle; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'flat-square', label: 'Flat Square' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'hyggshi', label: '✦ Hyggshi' },
  { value: 'custom', label: 'Custom' },
];

const SHAPES: { value: BadgeShape; label: string; preview: string }[] = [
  { value: 'rounded', label: 'Rounded', preview: 'rounded' },
  { value: 'pill', label: 'Pill', preview: 'pill' },
  { value: 'square', label: 'Square', preview: 'square' },
  { value: 'cyberpunk', label: 'Cyber', preview: 'cyberpunk' },
  { value: 'hexagon', label: 'Hex', preview: 'hexagon' },
  { value: 'shield', label: 'Shield', preview: 'shield' },
];

const ANIMATIONS: { value: BadgeAnimation; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'glow', label: 'Glow' },
  { value: 'shine', label: 'Shine' },
  { value: 'gradient-shift', label: 'Gradient Shift' },
];

type TabId = 'content' | 'theme' | 'icon' | 'effects';

export default function BadgeCustomizer({ options, onChange }: Props) {
  const [tab, setTab] = useState<TabId>('content');
  const [iconMode, setIconMode] = useState<'presets' | 'upload' | 'url'>(
    options.icon?.startsWith('ico_') || options.icon?.startsWith('data:')
      ? 'upload'
      : options.icon?.startsWith('http')
      ? 'url'
      : 'presets'
  );
  const [iconSearch, setIconSearch] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedShortId, setUploadedShortId] = useState<string | null>(
    options.icon?.startsWith('ico_') ? options.icon : null
  );
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState(options.icon?.startsWith('http') ? options.icon : '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BadgeOptions>(key: K, value: BadgeOptions[K]) =>
    onChange({ ...options, [key]: value });

  const uploadFileToServer = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setUploadError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/icons/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      const shortId: string = json.iconParam; // e.g. ico_a1b2c3d4
      set('icon', shortId);
      setUploadedFileName(file.name);
      setUploadedShortId(shortId);
      setUploadStatus('done');
    } catch (err: any) {
      setUploadStatus('error');
      setUploadError(err.message || 'Upload failed');
    }
  }, []);

  const processUploadedFile = (file: File) => {
    uploadFileToServer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
    // Reset value so same file can be re-uploaded
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
  };

  const filteredIcons = useMemo(() => {
    const entries = Object.entries(ICONS);
    if (!iconSearch.trim()) return entries;
    return entries.filter(([name]) => name.includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  const themePreviewSvgs = useMemo(() => {
    return STYLES.map(({ value }) => {
      const r = renderBadge({ label: 'build', message: 'passing', style: value, icon: 'check' });
      return { value, svg: r.svg };
    });
  }, []);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'theme', label: 'Theme' },
    { id: 'icon', label: 'Icon' },
    { id: 'effects', label: 'Effects' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div className="tabs">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`tab${tab === id ? ' active' : ''}`}
              onClick={() => setTab(id)}
              id={`tab-${id}`}
              aria-selected={tab === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* ── CONTENT TAB ── */}
        {tab === 'content' && (
          <>
            <div className="field">
              <label className="label" htmlFor="input-label">Label</label>
              <input
                id="input-label"
                className="input"
                type="text"
                value={options.label ?? ''}
                onChange={e => set('label', e.target.value || undefined)}
                placeholder="e.g. build"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="input-message">Message *</label>
              <input
                id="input-message"
                className="input"
                type="text"
                value={options.message}
                onChange={e => set('message', e.target.value)}
                placeholder="e.g. passing"
              />
            </div>

            <div>
              <span className="section-label">Message Color</span>
              <div style={{ marginTop: '8px' }}>
                <div className="color-presets">
                  {COLOR_PRESETS.map(({ color, name }) => (
                    <button
                      key={color}
                      className={`color-preset${options.color === color ? ' selected' : ''}`}
                      style={{ background: color, border: color === '#fff' ? '1px solid var(--border-default)' : undefined }}
                      title={name}
                      onClick={() => set('color', color)}
                      aria-label={`Color: ${name}`}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="color"
                    className="color-input"
                    value={options.color?.startsWith('#') ? options.color : '#22c55e'}
                    onChange={e => set('color', e.target.value)}
                    id="color-picker-message"
                    title="Pick message color"
                  />
                  <input
                    id="input-color-message"
                    className="input input-mono"
                    style={{ flex: 1 }}
                    type="text"
                    value={options.color ?? ''}
                    onChange={e => set('color', e.target.value)}
                    placeholder="#22c55e"
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="section-label">Label Color</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <input
                  type="color"
                  className="color-input"
                  value={options.labelColor?.startsWith('#') ? options.labelColor : '#24292f'}
                  onChange={e => set('labelColor', e.target.value)}
                  id="color-picker-label"
                  title="Pick label color"
                />
                <input
                  id="input-color-label"
                  className="input input-mono"
                  style={{ flex: 1 }}
                  type="text"
                  value={options.labelColor ?? ''}
                  onChange={e => set('labelColor', e.target.value)}
                  placeholder="#24292f"
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="select-height">Height (px)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="range-height"
                  type="range"
                  className="range"
                  min={16}
                  max={40}
                  value={options.height ?? 20}
                  onChange={e => set('height', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '30px' }}>
                  {options.height ?? 20}px
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── THEME TAB ── */}
        {tab === 'theme' && (
          <>
            <div>
              <span className="section-label">Style</span>
              <div className="theme-grid" style={{ marginTop: '8px' }}>
                {themePreviewSvgs.map(({ value, svg }) => {
                  const styleMeta = STYLES.find(s => s.value === value)!;
                  return (
                    <button
                      key={value}
                      className={`theme-card${options.style === value ? ' selected' : ''}`}
                      onClick={() => set('style', value)}
                      id={`theme-btn-${value}`}
                      aria-pressed={options.style === value}
                    >
                      <div className="theme-card-check">
                        <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="theme-preview" dangerouslySetInnerHTML={{ __html: svg }} />
                      <span className="theme-name">{styleMeta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="section-label">Shape</span>
              <div className="shape-grid" style={{ marginTop: '8px' }}>
                {SHAPES.map(({ value, label, preview }) => (
                  <button
                    key={value}
                    className={`shape-btn${options.shape === value ? ' selected' : ''}`}
                    onClick={() => set('shape', value)}
                    id={`shape-btn-${value}`}
                    aria-pressed={options.shape === value}
                  >
                    <div className={`shape-icon ${preview}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {(options.style === 'custom' || options.shape === 'rounded') && (
              <div className="field">
                <label className="label" htmlFor="range-radius">Corner Radius</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    id="range-radius"
                    type="range"
                    className="range"
                    min={0}
                    max={20}
                    value={options.cornerRadius ?? 4}
                    onChange={e => set('cornerRadius', Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '24px' }}>
                    {options.cornerRadius ?? 4}px
                  </span>
                </div>
              </div>
            )}

            {options.style === 'custom' && (
              <>
                <div className="field">
                  <label className="label" htmlFor="select-border-style">Border Style</label>
                  <select
                    id="select-border-style"
                    className="select"
                    value={options.borderStyle ?? 'none'}
                    onChange={e => set('borderStyle', e.target.value as any)}
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="gradient">Gradient</option>
                    <option value="glow">Glow</option>
                  </select>
                </div>
                {options.borderStyle && options.borderStyle !== 'none' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      className="color-input"
                      value={options.borderColor?.startsWith('#') ? options.borderColor : '#6366f1'}
                      onChange={e => set('borderColor', e.target.value)}
                      id="color-border"
                      title="Border color"
                    />
                    <input
                      id="range-border-width"
                      type="range"
                      className="range"
                      min={0.5}
                      max={4}
                      step={0.5}
                      value={options.borderWidth ?? 1}
                      onChange={e => set('borderWidth', Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '30px' }}>
                      {options.borderWidth ?? 1}px
                    </span>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── ICON TAB ── */}
        {tab === 'icon' && (
          <>
            {/* Icon Source Sub-tabs */}
            <div className="icon-subtabs">
              <button
                className={`icon-subtab${iconMode === 'presets' ? ' active' : ''}`}
                onClick={() => setIconMode('presets')}
                id="icon-subtab-presets"
              >
                Presets (40+)
              </button>
              <button
                className={`icon-subtab${iconMode === 'upload' ? ' active' : ''}`}
                onClick={() => setIconMode('upload')}
                id="icon-subtab-upload"
              >
                Upload Logo
              </button>
              <button
                className={`icon-subtab${iconMode === 'url' ? ' active' : ''}`}
                onClick={() => setIconMode('url')}
                id="icon-subtab-url"
              >
                Image URL
              </button>
            </div>

            {/* PRESETS SUB-TAB */}
            {iconMode === 'presets' && (
              <>
                <div className="field">
                  <label className="label" htmlFor="input-icon-search">Search Icons</label>
                  <input
                    id="input-icon-search"
                    className="input"
                    type="text"
                    value={iconSearch}
                    onChange={e => setIconSearch(e.target.value)}
                    placeholder="typescript, react, docker, github..."
                  />
                </div>

                <div className="icon-grid">
                  <button
                    className={`icon-btn${!options.icon ? ' selected' : ''}`}
                    onClick={() => { set('icon', undefined); setUploadedFileName(''); }}
                    id="icon-btn-none"
                    aria-pressed={!options.icon}
                    title="No icon"
                  >
                    <span style={{ fontSize: '14px', opacity: 0.5 }}>∅</span>
                    <span>None</span>
                  </button>
                  {filteredIcons.map(([name, iconData]) => (
                    <button
                      key={name}
                      className={`icon-btn${options.icon === name ? ' selected' : ''}`}
                      onClick={() => { set('icon', name); setUploadedFileName(''); }}
                      id={`icon-btn-${name}`}
                      aria-pressed={options.icon === name}
                      title={name}
                    >
                      <svg viewBox={iconData.viewBox || '0 0 24 24'} width="16" height="16">
                        {iconData.svgContent ? (
                          <g dangerouslySetInnerHTML={{ __html: iconData.svgContent }} />
                        ) : (
                          <path d={iconData.path} fill="currentColor" />
                        )}
                      </svg>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* UPLOAD SUB-TAB (PNG / SVG) */}
            {iconMode === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/svg+xml,image/jpeg,image/webp,image/x-icon,.svg,.png,.jpg,.jpeg,.webp,.ico"
                  style={{ display: 'none' }}
                  id="logo-file-input"
                />

                <div
                  className={`upload-dropzone${isDragging ? ' dragover' : ''}`}
                  onClick={() => uploadStatus !== 'uploading' && fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  id="logo-upload-dropzone"
                  style={{ cursor: uploadStatus === 'uploading' ? 'wait' : undefined }}
                >
                  <div className="upload-icon-circle">
                    {uploadStatus === 'uploading' ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {uploadStatus === 'uploading' ? 'Uploading…' : 'Click to upload or drag & drop'}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      PNG, SVG, JPG, WebP · max 512 KB · stored on server
                    </div>
                  </div>
                </div>

                {uploadStatus === 'error' && (
                  <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', fontSize: '12px', color: '#f87171' }}>
                    ⚠ {uploadError}
                  </div>
                )}

                {uploadedShortId && options.icon === uploadedShortId && (
                  <div className="uploaded-logo-card">
                    <div className="uploaded-logo-thumb">
                      <img src={`/api/icons/${uploadedShortId}`} alt="Custom logo" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="truncate" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {uploadedFileName || 'Custom Logo'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '1px' }}>
                        ✓ Stored on server · short ID: <code style={{ fontSize: '10px' }}>{uploadedShortId}</code>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => { set('icon', undefined); setUploadedFileName(''); setUploadedShortId(null); setUploadStatus('idle'); }}
                      style={{ color: '#ef4444' }}
                      title="Remove uploaded logo"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* URL SUB-TAB */}
            {iconMode === 'url' && (
              <div className="field">
                <label className="label" htmlFor="input-logo-url">Logo Image URL</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    id="input-logo-url"
                    className="input input-mono"
                    type="url"
                    value={urlInput}
                    onChange={e => {
                      setUrlInput(e.target.value);
                      set('icon', e.target.value.trim() || undefined);
                    }}
                    placeholder="https://example.com/logo.png"
                  />
                  {urlInput && (
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => { setUrlInput(''); set('icon', undefined); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Paste direct link to any PNG/SVG/HTTPS image
                </span>
              </div>
            )}

            {/* COMMON ICON CONTROLS (Position, Size, Color) */}
            {options.icon && (
              <>
                {!options.icon.startsWith('data:') && !options.icon.startsWith('http') && !options.icon.startsWith('ico_') && (
                  <div>
                    <span className="section-label">Icon Color</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                      <input
                        type="color"
                        className="color-input"
                        value={options.iconColor?.startsWith('#') ? options.iconColor : '#ffffff'}
                        onChange={e => set('iconColor', e.target.value)}
                        id="color-icon"
                        title="Icon color"
                      />
                      <input
                        id="input-icon-color"
                        className="input input-mono"
                        style={{ flex: 1 }}
                        type="text"
                        value={options.iconColor ?? ''}
                        onChange={e => set('iconColor', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label className="label" htmlFor="select-icon-pos">Icon Position</label>
                  <select
                    id="select-icon-pos"
                    className="select"
                    value={options.iconPosition ?? 'left'}
                    onChange={e => set('iconPosition', e.target.value as 'left' | 'right')}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label" htmlFor="range-icon-size">Icon Size</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      id="range-icon-size"
                      type="range"
                      className="range"
                      min={8}
                      max={32}
                      value={options.iconWidth ?? 14}
                      onChange={e => set('iconWidth', Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '30px' }}>
                      {options.iconWidth ?? 14}px
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── EFFECTS TAB ── */}
        {tab === 'effects' && (
          <>
            <div className="field">
              <label className="label" htmlFor="select-animation">Animation</label>
              <select
                id="select-animation"
                className="select"
                value={options.animation ?? 'none'}
                onChange={e => set('animation', e.target.value as BadgeAnimation)}
              >
                {ANIMATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {(options.style === 'neon' || options.style === 'hyggshi' || options.style === 'glass') && (
              <div className="field">
                <label className="label">Glow Intensity</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    id="range-glow"
                    type="range"
                    className="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={options.glowIntensity ?? 0.7}
                    onChange={e => set('glowIntensity', Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '36px' }}>
                    {Math.round((options.glowIntensity ?? 0.7) * 100)}%
                  </span>
                </div>
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="select-font">Font</label>
              <select
                id="select-font"
                className="select"
                value={options.fontFamily || 'default'}
                onChange={e => set('fontFamily', e.target.value === 'default' ? undefined : e.target.value)}
              >
                <option value="default">Default (System)</option>
                <option value="Verdana,sans-serif">Verdana</option>
                <option value="'JetBrains Mono',monospace">JetBrains Mono</option>
                <option value="'Fira Code',monospace">Fira Code</option>
                <option value="Georgia,serif">Georgia</option>
                <option value="'Courier New',monospace">Courier New</option>
              </select>
            </div>

            <div className="field">
              <label className="label">Font Size</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="range-font-size"
                  type="range"
                  className="range"
                  min={9}
                  max={16}
                  value={options.fontSize ?? 11}
                  onChange={e => set('fontSize', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '30px' }}>
                  {options.fontSize ?? 11}px
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Padding (X-axis)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="range-padding"
                  type="range"
                  className="range"
                  min={4}
                  max={24}
                  value={options.paddingX ?? 8}
                  onChange={e => set('paddingX', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '30px' }}>
                  {options.paddingX ?? 8}px
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
