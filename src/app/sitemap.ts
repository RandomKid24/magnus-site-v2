import type { MetadataRoute } from 'next';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { SITE_URL } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

const STATIC_PATHS = ['', '/profile', '/privacy-policy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` }));

  try {
    const { data } = await createSupabasePublicClient()
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')
      .neq('slug', 'home');
    for (const p of data ?? []) {
      entries.push({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updated_at });
    }
  } catch {
    // Static entries are still valid if the CMS is unreachable.
  }
  return entries;
}
