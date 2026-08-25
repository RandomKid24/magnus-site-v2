import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { CmsPage, PageSection } from '@/lib/cms/types';

export async function listPages(): Promise<CmsPage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(`Failed to load pages: ${error.message}`);
  return (data ?? []) as CmsPage[];
}

export async function getPageById(id: string): Promise<CmsPage | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load page: ${error.message}`);
  return (data as CmsPage) ?? null;
}

export async function getSectionsByPageId(pageId: string): Promise<PageSection[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true });
  if (error) throw new Error(`Failed to load sections: ${error.message}`);
  return (data ?? []) as PageSection[];
}

/** Public read: published page by slug (cookieless → cacheable route). */
export async function getPublishedPageBySlug(slug: string): Promise<CmsPage | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw new Error(`Failed to load page by slug: ${error.message}`);
  return (data as CmsPage) ?? null;
}

/** Public read: sections of a published page (RLS enforces status). */
export async function getPublishedSections(pageId: string): Promise<PageSection[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true });
  if (error) throw new Error(`Failed to load sections: ${error.message}`);
  return (data ?? []) as PageSection[];
}

/** Admin read (cookie client): any SEO row regardless of publish state. */
export async function getSeoForPage(pageId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('page_id', pageId)
    .maybeSingle();
  if (error) throw new Error(`Failed to load SEO metadata: ${error.message}`);
  return data ?? null;
}

/** Public read (anon client): SEO row for a published page. */
export async function getPublicSeoForPage(pageId: string) {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('page_id', pageId)
    .maybeSingle();
  return data ?? null;
}
