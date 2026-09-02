'use client';

import { useState, useCallback, useMemo } from 'react';
import { BadgeOptions } from '@/lib/renderer/types';
import BadgePreview from '@/components/BadgePreview';
import BadgeCustomizer from '@/components/BadgeCustomizer';
import TemplateGallery from '@/components/TemplateGallery';
import ApiPlayground from '@/components/ApiPlayground';
import CodeExportModal from '@/components/CodeExportModal';
import { renderBadge } from '@/lib/renderer/svg-engine';
import '@/app/studio.css';

type MainView = 'studio' | 'templates' | 'api';

const DEFAULT_OPTIONS: BadgeOptions = {
  label: 'hyggshi',
  message: 'badge',
  color: '#6366f1',
  labelColor: '#0f172a',
  style: 'hyggshi',
  shape: 'cyberpunk',
  icon: 'hyggshi',
  animation: 'gradient-shift',
  height: 24,
};

export default function Home() {
  const [options, setOptions] = useState<BadgeOptions>(DEFAULT_OPTIONS);
  const [view, setView] = useState<MainView>('studio');
  const [showExport, setShowExport] = useState(false);
  const [badgeSize, setBadgeSize] = useState({ w: 0, h: 0 });

  const handleSizeChange = useCallback((w: number, h: number) => {
    setBadgeSize({ w, h });
  }, []);

  const handleApplyTemplate = useCallback((tplOptions: BadgeOptions) => {
    setOptions(tplOptions);
    setView('studio');
  }, []);

  const heroExampleSvgs = useMemo(() => [
    renderBadge({ label: 'build', message: 'passing', color: '#22c55e', style: 'hyggshi', icon: 'check', shape: 'cyberpunk' }).svg,
    renderBadge({ message: 'TypeScript', color: '#3178C6', icon: 'typescript', style: 'flat' }).svg,
    renderBadge({ label: 'npm', message: 'v3.0.0', color: '#CB3837', icon: 'npm', style: 'flat' }).svg,
    renderBadge({ label: 'vibe', message: 'immaculate', color: '#00f0ff', style: 'neon', animation: 'glow' }).svg,
    renderBadge({ label: 'stars', message: '12.4k', color: '#eab308', icon: 'star', style: 'glass' }).svg,
    renderBadge({ message: 'React', color: '#61DAFB', icon: 'react', style: 'flat', labelColor: '#20232a' }).svg,
  ], []);

  return (
    <>
      {/* Navigation */}
      <nav className="studio-nav">
        <div className="container studio-nav-inner">
          <a href="/" className="nav-logo" id="nav-logo">
            <div className="nav-logo-icon">H</div>
            <span className="nav-logo-text">Hyggshi<span>Badge</span></span>
          </a>

          <div className="nav-links">
            <button
              className={`nav-link${view === 'studio' ? ' active' : ''}`}
              onClick={() => setView('studio')}
              id="nav-studio"
            >
              Studio
            </button>
            <button
              className={`nav-link${view === 'templates' ? ' active' : ''}`}
              onClick={() => setView('templates')}
              id="nav-templates"
            >
              Templates
            </button>
            <button
              className={`nav-link${view === 'api' ? ' active' : ''}`}
              onClick={() => setView('api')}
              id="nav-api"
            >
              API Docs
            </button>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowExport(true)}
            id="nav-export-btn"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            Export
          </button>
        </div>
      </nav>

      {view === 'studio' && (
        <div className="studio-layout">
          {/* Sidebar — Customizer */}
          <aside className="studio-sidebar">
            <div className="sidebar-header">
              <p className="sidebar-title">Badge Builder</p>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <BadgeCustomizer options={options} onChange={setOptions} />
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setOptions(DEFAULT_OPTIONS)}
                id="sidebar-reset-btn"
              >
                Reset
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 2, justifyContent: 'center' }}
                onClick={() => setShowExport(true)}
                id="sidebar-export-btn"
              >
                ⎘ Export Code
              </button>
            </div>
          </aside>

          {/* Main — Preview + info */}
          <main className="studio-main">
            <BadgePreview options={options} onSizeChange={handleSizeChange} />

            {/* Quick stats */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                <StatPill label="Width" value={`${badgeSize.w}px`} />
                <StatPill label="Height" value={`${badgeSize.h}px`} />
                <StatPill label="Style" value={options.style || 'flat'} />
                <StatPill label="Shape" value={options.shape || 'rounded'} />
                {options.icon && <StatPill label="Icon" value={options.icon} />}
                {options.animation && options.animation !== 'none' && <StatPill label="Anim" value={options.animation} />}
              </div>
            </div>

            {/* Feature showcase badges */}
            <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
              <p className="section-label" style={{ marginBottom: 'var(--space-4)' }}>Quick Examples</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
                {heroExampleSvgs.map((svg, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{ __html: svg }}
                    style={{ lineHeight: 0, cursor: 'pointer', transition: 'transform 0.15s', display: 'inline-block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                  />
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>
              <p className="section-label" style={{ marginBottom: 'var(--space-4)' }}>Features</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                {FEATURES.map(f => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {view === 'templates' && (
        <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
              Template Gallery
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              Click "Use Template" to instantly apply it to your Badge Studio.
            </p>
            <TemplateGallery onApply={handleApplyTemplate} />
          </div>
        </div>
      )}

      {view === 'api' && (
        <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <ApiPlayground />
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <CodeExportModal options={options} onClose={() => setShowExport(false)} />
      )}
    </>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

const FEATURES = [
  {
    icon: '✦',
    title: '5 Stunning Themes',
    description: 'Flat, Glass, Neon, Hyggshi holographic, and fully custom.'
  },
  {
    icon: '⬡',
    title: '6 Badge Shapes',
    description: 'Rounded, Pill, Square, Cyberpunk cut, Hexagon, Shield.'
  },
  {
    icon: '⚡',
    title: 'Live Animations',
    description: 'Pulse, Glow, Shine sweep, Gradient shift — pure SVG CSS.'
  },
  {
    icon: '🔌',
    title: 'Full API Suite',
    description: 'Static, GitHub, npm, Dynamic JSON, Custom endpoint badges.'
  },
  {
    icon: '◎',
    title: '40+ Tech Icons',
    description: 'React, TS, Node, Docker, GitHub, Discord and many more.'
  },
  {
    icon: '▲',
    title: 'Vercel Ready',
    description: 'Edge runtime, CDN caching, zero-config deploy in seconds.'
  },
];

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{
      padding: 'var(--space-4)',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      transition: 'border-color var(--transition-fast)',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
    >
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--text-sm)', marginBottom: '4px' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}
