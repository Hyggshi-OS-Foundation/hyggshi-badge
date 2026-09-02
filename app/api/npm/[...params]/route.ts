import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';
import { formatCompactNumber } from '@/lib/renderer/text-metrics';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const resolved = await params;
    const segments = resolved.params || [];
    const { searchParams } = new URL(request.url);
    const queryOptions = parseBadgeQuery(searchParams);

    const type = (segments[0] || 'v').toLowerCase();
    const packageName = segments.slice(1).join('/') || searchParams.get('package') || '';

    if (!packageName) throw new Error('Missing package name');

    const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
    const res = await fetch(registryUrl, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`npm: package "${packageName}" not found`);
    const data = await res.json();

    let label = queryOptions.label;
    let message = 'unknown';
    let color = queryOptions.color || '#4c1';
    const icon = queryOptions.icon || 'npm';

    if (type === 'v' || type === 'version') {
      label = label || 'npm';
      message = `v${data['dist-tags']?.latest || '0.0.0'}`;
      color = queryOptions.color || '#CB3837';
    } else if (type === 'license') {
      label = label || 'license';
      message = data.license || 'none';
      color = queryOptions.color || '#3b82f6';
    } else if (type === 'dt' || type === 'dm' || type === 'dw') {
      // Fetch download stats from npm downloads API
      const period = type === 'dt' ? 'total' : type === 'dm' ? 'last-month' : 'last-week';
      const dlUrl = type === 'dt'
        ? `https://api.npmjs.org/downloads/point/1900-01-01:2100-12-31/${encodeURIComponent(packageName)}`
        : `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(packageName)}`;
      const dlRes = await fetch(dlUrl, { next: { revalidate: 3600 } });
      if (!dlRes.ok) throw new Error('Download stats unavailable');
      const dlData = await dlRes.json();
      const count = dlData.downloads ?? 0;

      label = label || (type === 'dt' ? 'total downloads' : type === 'dm' ? 'downloads/month' : 'downloads/week');
      message = formatCompactNumber(count);
      color = queryOptions.color || '#22c55e';
    } else {
      throw new Error(`Unsupported npm metric: ${type}. Use v, license, dt, dm, dw`);
    }

    const badge = renderBadge({ ...queryOptions, label, message, color, icon });
    return createSvgResponse(badge.svg, 200, 600);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'npm',
      message: err.message || 'error',
      color: '#ef4444',
      icon: 'npm',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 200, 60);
  }
}
