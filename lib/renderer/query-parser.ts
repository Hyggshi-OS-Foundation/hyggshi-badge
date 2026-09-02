import { BadgeOptions, BadgeStyle, BadgeShape, BadgeAnimation, BadgeBorder } from './types';

export function parseBadgeQuery(searchParams: URLSearchParams): BadgeOptions {
  const label = searchParams.get('label') ?? undefined;
  const message = searchParams.get('message') || searchParams.get('text') || 'badge';
  const labelColor = searchParams.get('labelColor') || searchParams.get('label_color') || undefined;
  const color = searchParams.get('color') || searchParams.get('statusColor') || undefined;
  const style = (searchParams.get('style') || searchParams.get('theme') || 'flat') as BadgeStyle;
  const shape = (searchParams.get('shape') || undefined) as BadgeShape | undefined;
  const icon = searchParams.get('icon') || searchParams.get('logo') || undefined;
  const iconColor = searchParams.get('iconColor') || searchParams.get('logoColor') || undefined;
  const iconPosition = (searchParams.get('iconPosition') as 'left' | 'right') || undefined;
  const iconWidth = searchParams.has('iconWidth') ? Number(searchParams.get('iconWidth')) : undefined;
  const cornerRadius = searchParams.has('cornerRadius') || searchParams.has('radius')
    ? Number(searchParams.get('cornerRadius') || searchParams.get('radius'))
    : undefined;
  const borderStyle = (searchParams.get('borderStyle') as BadgeBorder) || undefined;
  const borderColor = searchParams.get('borderColor') || undefined;
  const borderWidth = searchParams.has('borderWidth') ? Number(searchParams.get('borderWidth')) : undefined;
  const glowColor = searchParams.get('glowColor') || undefined;
  const glowIntensity = searchParams.has('glowIntensity') ? Number(searchParams.get('glowIntensity')) : undefined;
  const fontFamily = searchParams.get('fontFamily') || searchParams.get('font') || undefined;
  const fontSize = searchParams.has('fontSize') ? Number(searchParams.get('fontSize')) : undefined;
  const letterSpacing = searchParams.has('letterSpacing') ? Number(searchParams.get('letterSpacing')) : undefined;
  const paddingX = searchParams.has('paddingX') || searchParams.has('padding')
    ? Number(searchParams.get('paddingX') || searchParams.get('padding'))
    : undefined;
  const height = searchParams.has('height') ? Number(searchParams.get('height')) : undefined;
  const animation = (searchParams.get('animation') as BadgeAnimation) || undefined;

  return {
    label,
    message,
    labelColor,
    color,
    style,
    shape,
    icon,
    iconColor,
    iconPosition,
    iconWidth,
    cornerRadius,
    borderStyle,
    borderColor,
    borderWidth,
    glowColor,
    glowIntensity,
    fontFamily,
    fontSize,
    letterSpacing,
    paddingX,
    height,
    animation,
  };
}

export function createSvgResponse(svg: string, status: number = 200, cacheSeconds: number = 300): Response {
  return new Response(svg, {
    status,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${cacheSeconds}, s-maxage=3600, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}
