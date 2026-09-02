import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';

// Use nodejs runtime so ico_ short IDs can be resolved from /tmp disk cache
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const options = parseBadgeQuery(searchParams);

    // Inject base URL so that ico_ short IDs resolve to absolute URLs
    options._iconBaseUrl = `${url.protocol}//${url.host}`;

    const result = renderBadge(options);
    return createSvgResponse(result.svg, 200, 300);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'error',
      message: err.message || 'invalid params',
      color: '#ef4444',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 500, 10);
  }
}
