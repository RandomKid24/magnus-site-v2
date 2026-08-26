/**
 * Pure URL transformation utilities for Cloudinary assets.
 * This module has NO server-only dependency and can be safely imported
 * from both client and server components.
 */

export type TransformPreset =
  | 'thumbnail'
  | 'card'
  | 'full'
  | 'og'
  | 'hero';

const TRANSFORMS: Record<TransformPreset, string> = {
  thumbnail: 'c_fill,g_auto,w_400,h_300,q_auto,f_auto',
  card: 'c_fill,g_auto,w_800,h_600,q_auto,f_auto',
  full: 'c_limit,w_1600,q_auto,f_auto',
  og: 'c_fill,g_auto,w_1200,h_630,q_auto,f_auto',
  hero: 'c_fill,g_auto,w_1920,h_1080,q_auto,f_auto',
};

export function transformedUrl(secureUrl: string, preset: TransformPreset): string {
  const marker = '/upload/';
  const idx = secureUrl.indexOf(marker);
  if (idx === -1) return secureUrl;
  const head = secureUrl.slice(0, idx + marker.length);
  const tail = secureUrl.slice(idx + marker.length);
  return `${head}${TRANSFORMS[preset]}/${tail}`;
}

/**
 * Safe wrapper: only applies Cloudinary transformations when the URL is a
 * Cloudinary asset. External URLs (Unsplash, etc.) are returned unchanged.
 */
export function safeTransformUrl(url: string, preset: TransformPreset): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return transformedUrl(url, preset);
}
