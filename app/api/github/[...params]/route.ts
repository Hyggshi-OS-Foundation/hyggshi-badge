import { NextRequest } from 'next/server';
import { renderBadge } from '@/lib/renderer/svg-engine';
import { parseBadgeQuery, createSvgResponse } from '@/lib/renderer/query-parser';
import { formatCompactNumber } from '@/lib/renderer/text-metrics';

/** Ensure version string always starts with "v" */
const ensureV = (tag: string | undefined | null): string => {
  if (!tag || tag === 'none') return 'none';
  return tag.startsWith('v') ? tag : 'v' + tag;
};

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

    const type = (segments[0] || 'stars').toLowerCase();
    const owner = segments[1];
    const repo = segments[2];

    if (!owner) {
      throw new Error('missing owner');
    }

    const headers: Record<string, string> = {
      'User-Agent': 'HyggshiBadge/1.0',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    let label = queryOptions.label;
    let message = 'unknown';
    let color = queryOptions.color || '#22c55e';
    let icon = queryOptions.icon || 'github';

    if (type === 'stars' || type === 'forks' || type === 'issues' || type === 'license' || type === 'pulls') {
      if (!repo) throw new Error('missing repository name');
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
      const data = await res.json();

      if (type === 'stars') {
        label = label || 'stars';
        message = formatCompactNumber(data.stargazers_count ?? 0);
        icon = queryOptions.icon || 'star';
        color = queryOptions.color || '#4c1';
      } else if (type === 'forks') {
        label = label || 'forks';
        message = formatCompactNumber(data.forks_count ?? 0);
        icon = queryOptions.icon || 'gitfork';
        color = queryOptions.color || '#007ec6';
      } else if (type === 'issues') {
        label = label || 'issues';
        message = `${data.open_issues_count ?? 0} open`;
        icon = queryOptions.icon || 'github';
        color = data.open_issues_count > 0 ? '#fe7d37' : '#22c55e';
      } else if (type === 'license') {
        label = label || 'license';
        message = data.license?.spdx_id || data.license?.name || 'none';
        color = queryOptions.color || '#3b82f6';
      } else if (type === 'pulls') {
        label = label || 'pull requests';
        // open_issues_count includes PRs; fetch PRs directly
        const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`, { headers, next: { revalidate: 300 } });
        const linkHeader = prRes.headers.get('Link') || '';
        let prCount = 0;
        if (prRes.ok) {
          const prData = await prRes.json();
          const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          prCount = lastMatch ? parseInt(lastMatch[1], 10) : prData.length;
        }
        message = `${prCount} open`;
        icon = queryOptions.icon || 'github';
        color = prCount > 0 ? '#007ec6' : '#22c55e';
      }
    } else if (type === 'release' || type === 'tag') {
      if (!repo) throw new Error('missing repository name');
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers, next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        label = label || 'release';
        message = ensureV(data.tag_name || data.name);
        color = queryOptions.color || '#3b82f6';
      } else {
        // Fallback to tags
        const tagsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags`, { headers, next: { revalidate: 300 } });
        if (!tagsRes.ok) throw new Error('No release or tag found');
        const tags = await tagsRes.json();
        label = label || (type === 'tag' ? 'tag' : 'release');
        message = ensureV(tags[0]?.name);
        color = queryOptions.color || '#3b82f6';
      }
    } else if (type === 'downloads' || type === 'releases' || type === 'prerelease' || type === 'pre-release' || type === 'latest-prerelease') {
      if (!repo) throw new Error('missing repository name');
      const relRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, { headers, next: { revalidate: 300 } });
      if (!relRes.ok) throw new Error(`GitHub API: ${relRes.status}`);
      const releases = await relRes.json();

      if (type === 'downloads') {
        let totalDownloads = 0;
        for (const rel of releases) {
          for (const asset of rel.assets || []) {
            totalDownloads += asset.download_count || 0;
          }
        }
        label = label || 'downloads';
        message = formatCompactNumber(totalDownloads);
        icon = queryOptions.icon || 'github';
        color = queryOptions.color || '#007ec6';
      } else if (type === 'releases') {
        const stableReleases = releases.filter((r: any) => !r.prerelease && !r.draft);
        const latestStable = stableReleases[0];
        label = label || 'release';
        message = latestStable ? `${ensureV(latestStable.tag_name || latestStable.name)} stable` : 'none';
        icon = queryOptions.icon || 'github';
        color = queryOptions.color || '#22c55e';
      } else if (type === 'prerelease' || type === 'pre-release') {
        const preReleases = releases.filter((r: any) => r.prerelease && !r.draft);
        label = label || 'pre-releases';
        message = `${preReleases.length}`;
        icon = queryOptions.icon || 'github';
        color = queryOptions.color || '#f59e0b';
      } else if (type === 'latest-prerelease') {
        const latestPre = releases.find((r: any) => r.prerelease && !r.draft);
        label = label || 'pre-release';
        message = latestPre ? ensureV(latestPre.tag_name || latestPre.name) : 'none';
        icon = queryOptions.icon || 'github';
        color = queryOptions.color || '#f59e0b';
      }
    } else if (type === 'workflow' || type === 'actions') {
      const workflowName = segments[3];
      if (!repo || !workflowName) throw new Error('Usage: /api/github/workflow/:owner/:repo/:workflowName');
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowName}/runs?per_page=1`, { headers, next: { revalidate: 120 } });
      if (!res.ok) throw new Error('Workflow not found');
      const data = await res.json();
      const latestRun = data.workflow_runs?.[0];
      label = label || 'build';
      if (!latestRun) {
        message = 'no runs';
        color = '#555';
      } else if (latestRun.conclusion === 'success') {
        message = 'passing';
        color = queryOptions.color || '#22c55e';
      } else if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
        message = 'running';
        color = '#f59e0b';
      } else {
        message = 'failing';
        color = '#ef4444';
      }
    } else if (type === 'followers') {
      const res = await fetch(`https://api.github.com/users/${owner}`, { headers, next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`GitHub user not found: ${owner}`);
      const data = await res.json();
      label = label || 'followers';
      message = formatCompactNumber(data.followers ?? 0);
      color = queryOptions.color || '#007ec6';
    } else {
      throw new Error(`Unsupported GitHub metric: ${type}`);
    }

    const badge = renderBadge({
      ...queryOptions,
      label,
      message,
      color,
      icon,
    });

    return createSvgResponse(badge.svg, 200, 300);
  } catch (err: any) {
    const fallback = renderBadge({
      label: 'github',
      message: err.message || 'error',
      color: '#ef4444',
      icon: 'github',
      style: 'flat'
    });
    return createSvgResponse(fallback.svg, 200, 60);
  }
}
