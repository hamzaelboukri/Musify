/**
 * Returns the correct URL for displaying a song cover image.
 * - Empty/undefined: placeholder
 * - picsum.photos without seed: use seeded URL (fixes random image on reload)
 * - Full http(s) URL: use as-is (loads directly from backend)
 * - /uploads/ path: prepend API base for correct origin
 */
export function getCoverImageUrl(url: string | undefined): string {
  if (!url || !url.trim()) return '/placeholder.svg';
  // picsum.photos returns a RANDOM image each request - use seed for consistent cover on reload
  if (url.includes('picsum.photos') && !url.includes('/seed/')) {
    return 'https://picsum.photos/seed/musify/300/300';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
}
