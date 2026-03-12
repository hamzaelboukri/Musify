/**
 * Returns the correct URL for displaying a song cover image.
 * - Empty/undefined: placeholder
 * - Full http(s) URL: use as-is (loads directly from backend)
 * - /uploads/ path: prepend API base for correct origin
 */
export function getCoverImageUrl(url: string | undefined): string {
  if (!url || !url.trim()) return '/placeholder.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
}
