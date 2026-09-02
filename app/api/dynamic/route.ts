import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryOptions = parseBadgeQuery(searchParams);

    const url = searchParams.get('url');
    const query = searchParams.get('query') || searchParams.get('jsonpath') || '';

    if (!url) throw new Error('Missing "url" parameter');

    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'HyggshiBadge/1.0', Accept: 'application/json' },
      next: { revalidate: 300 }
    });

    if (!fetchRes.ok) throw new Error(`Remote API: ${fetchRes.status} ${fetchRes.statusText}`);

    const rawJson = await fetchRes.json();

    let value: unknown = rawJson;

    // Simple dot-notation key extraction without external deps
    if (query) {
      // Support both $.key.nested and key.nested notations
      const cleanQuery = query.replace(/^\$\.?/, '');
      const parts = cleanQuery.split(/[\.\[\]]+/).filter(Boolean);
      for (const part of parts) {
        if (value === null || value === undefined) break;
        value = (value as Record<string, unknown>)[part];
      }
    }

    const message = value !== undefined && value !== null ? String(value) : 'unknown';
    const label = queryOptions.label || searchParams.get('label') || undefined;
    const color = queryOptions.color || '#6366f1';

    const badge = renderBadge({ ...queryOptions, label, message, color });
    return createSvgResponse(badge.svg, 200, 300);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'dynamic',
      message: err.message || 'error',
      color: '#ef4444',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 200, 30);
  }
}
