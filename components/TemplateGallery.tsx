'use client';

import { useMemo, useState } from 'react';
import { BadgeOptions } from '@/lib/renderer/types';
import { renderBadge } from '@/lib/renderer/svg-engine';

interface Template {
  id: string;
  name: string;
  category: string;
  badges: BadgeOptions[];
}

const TEMPLATES: Template[] = [
  {
    id: 'github-profile',
    name: 'GitHub Profile',
    category: 'Social',
    badges: [
      { label: 'GitHub', message: 'Follow', color: '#24292f', icon: 'github', style: 'flat' },
      { label: 'Stars', message: '1.2k', color: '#eab308', icon: 'star', style: 'flat' },
    ],
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    category: 'Developer',
    badges: [
      { message: 'TypeScript', color: '#3178C6', icon: 'typescript', style: 'flat' },
      { message: 'React', color: '#61DAFB', icon: 'react', style: 'flat', labelColor: '#20232a' },
      { message: 'Next.js', color: '#000', icon: 'nextdotjs', style: 'flat' },
    ],
  },
  {
    id: 'cicd',
    name: 'CI / CD Status',
    category: 'Project',
    badges: [
      { label: 'build', message: 'passing', color: '#22c55e', icon: 'check', style: 'hyggshi' },
      { label: 'tests', message: '100%', color: '#4ade80', style: 'hyggshi' },
      { label: 'coverage', message: '98%', color: '#22c55e', style: 'hyggshi' },
    ],
  },
  {
    id: 'npm-pack',
    name: 'npm Package',
    category: 'Project',
    badges: [
      { label: 'npm', message: 'v2.0.0', color: '#CB3837', icon: 'npm', style: 'flat' },
      { label: 'downloads', message: '50k/mo', color: '#22c55e', style: 'flat' },
      { label: 'license', message: 'MIT', color: '#3b82f6', style: 'flat' },
    ],
  },
  {
    id: 'neon-dev',
    name: 'Neon Developer',
    category: 'Aesthetic',
    badges: [
      { label: 'code', message: 'clean', color: '#00f0ff', style: 'neon', animation: 'glow' },
      { label: 'vibe', message: 'immaculate', color: '#a855f7', style: 'neon', animation: 'glow' },
    ],
  },
  {
    id: 'glass-minimal',
    name: 'Glass Minimal',
    category: 'Aesthetic',
    badges: [
      { label: 'version', message: 'v3.0', color: 'rgba(99,102,241,0.6)', style: 'glass' },
      { label: 'status', message: 'stable', color: 'rgba(34,197,94,0.6)', style: 'glass' },
    ],
  },
  {
    id: 'discord-social',
    name: 'Discord & Social',
    category: 'Social',
    badges: [
      { label: 'Discord', message: 'Join Us', color: '#5865F2', icon: 'discord', style: 'flat' },
      { label: 'Twitter', message: '@hyggshi', color: '#1DA1F2', icon: 'x', style: 'flat' },
    ],
  },
  {
    id: 'hyggshi-branded',
    name: 'Hyggshi Branded',
    category: 'Aesthetic',
    badges: [
      { label: 'hyggshi', message: 'badge', color: '#6366f1', icon: 'hyggshi', style: 'hyggshi', shape: 'cyberpunk', animation: 'gradient-shift' },
      { message: 'premium quality', color: '#7c3aed', style: 'hyggshi', shape: 'cyberpunk' },
    ],
  },
  {
    id: 'docker-deploy',
    name: 'Docker & Deploy',
    category: 'Project',
    badges: [
      { label: 'docker', message: 'ready', color: '#2496ED', icon: 'docker', style: 'flat' },
      { label: 'vercel', message: 'deployed', color: '#000', icon: 'vercel', style: 'flat' },
    ],
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

interface Props {
  onApply: (options: BadgeOptions) => void;
}

export default function TemplateGallery({ onApply }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() =>
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCategory),
    [activeCategory]
  );

  return (
    <div style={{ padding: '0 0 var(--space-8)' }}>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`btn btn-xs${activeCategory === cat ? ' btn-primary' : ' btn-secondary'}`}
            onClick={() => setActiveCategory(cat)}
            id={`cat-btn-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="template-grid">
        {filtered.map(template => (
          <TemplateCard key={template.id} template={template} onApply={onApply} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template, onApply }: { template: Template; onApply: (o: BadgeOptions) => void }) {
  const svgs = useMemo(() =>
    template.badges.map(b => {
      try { return renderBadge(b).svg; } catch { return ''; }
    }), [template.badges]);

  return (
    <div className="template-card" id={`template-${template.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span className="template-name">{template.name}</span>
        <span style={{
          fontSize: '10px',
          padding: '2px 8px',
          background: 'var(--bg-highlight)',
          color: 'var(--text-tertiary)',
          borderRadius: 'var(--radius-full)',
        }}>
          {template.category}
        </span>
      </div>

      <div className="template-badges">
        {svgs.map((svg, i) => (
          svg ? (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ lineHeight: 0 }}
            />
          ) : null
        ))}
      </div>

      <button
        className="btn btn-secondary btn-xs"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => onApply(template.badges[0])}
        id={`template-apply-${template.id}`}
      >
        Use Template
      </button>
    </div>
  );
}

