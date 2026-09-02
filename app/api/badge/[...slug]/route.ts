import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug.join('/');
    // Remove trailing .svg extension if present
    const cleanSlug = slug.replace(/\.svg$/i, '');
    const { searchParams } = new URL(request.url);
    const queryOptions = parseBadgeQuery(searchParams);

    // Parse slug parts: label-message-color or message-color
    const parts = cleanSlug.split('-');
    let label = queryOptions.label;
    let message = queryOptions.message;
    let color = queryOptions.color;

    if (parts.length >= 3) {
      label = decodeURIComponent(parts[0]);
      message = decodeURIComponent(parts.slice(1, -1).join('-'));
      color = decodeURIComponent(parts[parts.length - 1]);
    } else if (parts.length === 2) {
      label = queryOptions.label;
      message = decodeURIComponent(parts[0]);
      color = decodeURIComponent(parts[1]);
    } else if (parts.length === 1 && parts[0]) {
      message = decodeURIComponent(parts[0]);
    }

    const options = {
      ...queryOptions,
      label: label ?? queryOptions.label,
      message: message || 'badge',
      color: color || queryOptions.color,
    };

    const result = renderBadge(options);
    return createSvgResponse(result.svg, 200, 300);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'error',
      message: err.message || 'invalid slug',
      color: '#ef4444',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 500, 10);
  }
}
