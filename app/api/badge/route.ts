import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = parseBadgeQuery(searchParams);
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
