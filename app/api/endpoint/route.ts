import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';

export const runtime = 'edge';

/**
 * Custom JSON Endpoint - compatible with Shields.io endpoint schema:
 * {
 *   "schemaVersion": 1,
 *   "label": "rating",
 *   "message": "5 stars",
 *   "color": "green",
 *   "style": "flat",
 *   "isError": false
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryOptions = parseBadgeQuery(searchParams);

    const url = searchParams.get('url');
    if (!url) throw new Error('Missing "url" parameter (custom endpoint JSON URL)');

    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'HyggshiBadge/1.0', Accept: 'application/json' },
      next: { revalidate: 300 }
    });

    if (!fetchRes.ok) throw new Error(`Endpoint fetch error: ${fetchRes.status}`);

    const data = await fetchRes.json();

    if (data.isError) throw new Error(data.message || 'endpoint returned error');

    const label = data.label ?? queryOptions.label;
    const message = data.message ?? 'unknown';
    const color = data.color ?? queryOptions.color ?? '#6366f1';
    const style = data.style ?? queryOptions.style ?? 'flat';

    const badge = renderBadge({ ...queryOptions, label, message, color, style });
    return createSvgResponse(badge.svg, 200, data.cacheSeconds ?? 300);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'endpoint',
      message: err.message || 'error',
      color: '#ef4444',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 200, 30);
  }
}
