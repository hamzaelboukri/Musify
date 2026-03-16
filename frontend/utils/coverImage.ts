/**
 * Returns the correct URL for displaying a song cover image.
 * - S3 URLs (s3.amazonaws.com, s3.*.amazonaws.com): use as-is
 * - Full URL containing /uploads/: extract path for Next.js proxy (avoids CORS)
 * - Empty/undefined: SVG data URI placeholder
 */
export function getCoverImageUrl(url: string | undefined, fallbackSeed?: string): string {
  if (!url || !url.trim()) {
    if (fallbackSeed) return getGradientPlaceholder(fallbackSeed);
    return '/placeholder.svg';
  }
  // S3 / AWS URLs - use as-is (bucket must have public-read)
  if (url.includes('s3.') && url.includes('amazonaws.com')) return url;
  if (url.includes('cloudfront.net')) return url;
  if (url.includes('picsum.photos') && !url.includes('/seed/')) {
    return getGradientPlaceholder(url);
  }
  const uploadsMatch = url.match(/\/uploads\/[^\s?#]+/);
  if (uploadsMatch) return uploadsMatch[0];
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return url;
  if (url.startsWith('uploads/')) return `/${url}`;
  return getGradientPlaceholder(url);
}

/** Generate a unique gradient SVG as data URI - always works, no external requests */
function getGradientPlaceholder(seed: string): string {
  const hash = seed.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const hue1 = ((hash % 360) + 360) % 360;
  const hue2 = (hue1 + 120) % 360;
  const hue3 = (hue1 + 240) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${hue1},70%,45%)"/><stop offset="50%" style="stop-color:hsl(${hue2},70%,40%)"/><stop offset="100%" style="stop-color:hsl(${hue3},70%,35%)"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><path d="M120 100v100l60-50-60-50z" fill="rgba(255,255,255,0.3)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
