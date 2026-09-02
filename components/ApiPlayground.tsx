'use client';

import { useState } from 'react';

interface Endpoint {
  id: string;
  method: 'GET';
  path: string;
  description: string;
  params: { name: string; description: string; required: boolean; example: string }[];
  example: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'static',
    method: 'GET',
    path: '/api/badge',
    description: 'Generate a static badge with custom label, message and color.',
    params: [
      { name: 'label', description: 'Left side text', required: false, example: 'build' },
      { name: 'message', description: 'Right side text (main value)', required: true, example: 'passing' },
      { name: 'color', description: 'Right background color (hex or name)', required: false, example: '22c55e' },
      { name: 'labelColor', description: 'Left background color', required: false, example: '24292f' },
      { name: 'style', description: 'flat | glass | neon | hyggshi | plastic | flat-square', required: false, example: 'hyggshi' },
      { name: 'shape', description: 'rounded | pill | square | cyberpunk | hexagon | shield', required: false, example: 'cyberpunk' },
      { name: 'icon', description: 'Icon slug (github, react, docker…)', required: false, example: 'github' },
      { name: 'animation', description: 'none | pulse | glow | shine | gradient-shift', required: false, example: 'glow' },
    ],
    example: '/api/badge?label=build&message=passing&color=22c55e&style=hyggshi&icon=check',
  },
  {
    id: 'slug',
    method: 'GET',
    path: '/api/badge/:label-:message-:color.svg',
    description: 'Shields.io-compatible URL format with slash-friendly slug.',
    params: [
      { name: ':label', description: 'Badge label', required: false, example: 'version' },
      { name: ':message', description: 'Badge message', required: true, example: 'v2.0.0' },
      { name: ':color', description: 'Color hex (no #)', required: false, example: '6366f1' },
    ],
    example: '/api/badge/version-v2.0.0-6366f1.svg?style=neon',
  },
  {
    id: 'github-stars',
    method: 'GET',
    path: '/api/github/stars/:owner/:repo',
    description: 'Automatically shows GitHub stars count for any public repo.',
    params: [
      { name: ':owner', description: 'GitHub username or org', required: true, example: 'vercel' },
      { name: ':repo', description: 'Repository name', required: true, example: 'next.js' },
    ],
    example: '/api/github/stars/vercel/next.js?style=flat',
  },
  {
    id: 'github-release',
    method: 'GET',
    path: '/api/github/release/:owner/:repo',
    description: 'Shows the latest GitHub Release or tag version.',
    params: [
      { name: ':owner', description: 'GitHub username or org', required: true, example: 'facebook' },
      { name: ':repo', description: 'Repository name', required: true, example: 'react' },
    ],
    example: '/api/github/release/facebook/react?style=hyggshi',
  },
  {
    id: 'github-workflow',
    method: 'GET',
    path: '/api/github/workflow/:owner/:repo/:workflow',
    description: 'Shows the CI/CD GitHub Actions workflow status (passing/failing).',
    params: [
      { name: ':owner', description: 'GitHub username or org', required: true, example: 'vercel' },
      { name: ':repo', description: 'Repository name', required: true, example: 'next.js' },
      { name: ':workflow', description: 'Workflow file name (e.g. ci.yml)', required: true, example: 'release.yml' },
    ],
    example: '/api/github/workflow/vercel/next.js/release.yml?style=hyggshi&label=release',
  },
  {
    id: 'npm-version',
    method: 'GET',
    path: '/api/npm/v/:package',
    description: 'Shows the latest published version of an npm package.',
    params: [
      { name: ':package', description: 'npm package name (supports scoped @org/pkg)', required: true, example: 'next' },
    ],
    example: '/api/npm/v/next?style=flat',
  },
  {
    id: 'npm-downloads',
    method: 'GET',
    path: '/api/npm/dm/:package',
    description: 'Shows monthly npm download count. Use /dt/ for total, /dw/ for weekly.',
    params: [
      { name: ':package', description: 'npm package name', required: true, example: 'react' },
    ],
    example: '/api/npm/dm/react?style=hyggshi&label=downloads',
  },
  {
    id: 'dynamic',
    method: 'GET',
    path: '/api/dynamic',
    description: 'Fetch any JSON endpoint and extract a value to display as a badge.',
    params: [
      { name: 'url', description: 'URL of the remote JSON API', required: true, example: 'https://api.github.com/repos/vercel/next.js' },
      { name: 'query', description: 'Dot-notation or JSONPath to extract (e.g. $.stargazers_count)', required: false, example: '$.stargazers_count' },
      { name: 'label', description: 'Badge label text', required: false, example: 'stars' },
    ],
    example: '/api/dynamic?url=https://api.github.com/repos/vercel/next.js&query=$.stargazers_count&label=stars&style=hyggshi',
  },
  {
    id: 'endpoint',
    method: 'GET',
    path: '/api/endpoint',
    description: 'Shields.io-compatible custom JSON endpoint. Your server returns the badge config JSON.',
    params: [
      { name: 'url', description: 'URL returning a Shields.io-compatible JSON response', required: true, example: 'https://example.com/my-badge.json' },
    ],
    example: '/api/endpoint?url=https://example.com/badge-status.json',
  },
];

const SCHEMA_EXAMPLE = `{
  "schemaVersion": 1,
  "label": "downloads",
  "message": "5.2M/mo",
  "color": "22c55e",
  "style": "hyggshi"
}`;

export default function ApiPlayground() {
  const [expanded, setExpanded] = useState<string | null>('static');

  return (
    <div style={{ padding: '0 0 var(--space-8)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          API Reference & Playground
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
          All endpoints return SVG image responses with proper cache headers. Just link them directly as <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)', fontSize: '12px' }}>&lt;img src="..."&gt;</code> or Markdown image syntax.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {ENDPOINTS.map(ep => (
          <EndpointAccordion
            key={ep.id}
            endpoint={ep}
            isOpen={expanded === ep.id}
            onToggle={() => setExpanded(expanded === ep.id ? null : ep.id)}
          />
        ))}
      </div>

      {/* Custom JSON Endpoint schema */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
          Custom Endpoint JSON Schema
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
          Your server must return a JSON response with this structure for <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-cyan)' }}>/api/endpoint</code>:
        </p>
        <div className="code-block">
          <CopyButton text={SCHEMA_EXAMPLE} />
          <pre>{SCHEMA_EXAMPLE}</pre>
        </div>
      </div>
    </div>
  );
}

function EndpointAccordion({ endpoint, isOpen, onToggle }: { endpoint: Endpoint; isOpen: boolean; onToggle: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(endpoint.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="endpoint-card" id={`endpoint-${endpoint.id}`}>
      <button
        className="endpoint-header"
        onClick={onToggle}
        style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
        aria-expanded={isOpen}
      >
        <span className="endpoint-method">GET</span>
        <code className="endpoint-path" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {endpoint.path}
        </code>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="var(--text-tertiary)"
          strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="endpoint-body" style={{ borderTop: '1px solid var(--border-subtle)', animation: 'fadeIn 0.15s ease' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
            {endpoint.description}
          </p>

          {/* Parameters table */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span className="section-label" style={{ marginBottom: 'var(--space-2)', display: 'flex' }}>Parameters</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
              {endpoint.params.map(p => (
                <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '8px', alignItems: 'start', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-cyan)' }}>{p.name}</code>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.description}</span>
                  {p.required && (
                    <span style={{ fontSize: '10px', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)', flexShrink: 0 }}>
                      required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Example URL */}
          <div>
            <span className="section-label" style={{ marginBottom: 'var(--space-2)', display: 'flex' }}>Example</span>
            <div className="code-block" style={{ marginTop: '8px' }}>
              <button
                className={`code-copy-btn${copied ? ' copied' : ''}`}
                onClick={copy}
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
              <pre>{endpoint.example}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button className={`code-copy-btn${copied ? ' copied' : ''}`} onClick={copy}>
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}
