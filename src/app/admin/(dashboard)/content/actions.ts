'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BLOCK_SCHEMAS } from '@/lib/cms/blocks/schemas';
import type { ContentStatus } from '@/lib/cms/types';

export interface SaveState {
  error?: string;
  success?: string;
}

const sectionInputSchema = z.object({
  id: z.string().optional(),
  type: z.string().refine((t) => t in BLOCK_SCHEMAS, 'Unknown block type.'),
  data: z.unknown(),
});

export async function getHomeContext(): Promise<{
  pageId: string | null;
  slug: string;
  status: string;
}> {
  await requireRole('admin', 'editor');
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('pages').select('id, slug, status').eq('slug', 'home').maybeSingle();
  return {
    pageId: data?.id ?? null,
    slug: data?.slug ?? 'home',
    status: data?.status ?? 'draft',
  };
}

async function syncSections(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  pageId: string,
  sections: z.infer<typeof sectionInputSchema>[]
): Promise<string | null> {
  // Validate every block against its schema before persisting anything.
  const rows = sections.map((section, index) => {
    const schema = BLOCK_SCHEMAS[section.type];
    const result = schema.safeParse(section.data ?? {});
    if (!result.success) {
      return {
        error: `Block #${index + 1} (${section.type}) has invalid content: ${
          result.error.issues[0]?.message ?? 'validation failed'
        }`,
      };
    }
    return {
      row: {
        page_id: pageId,
        type: section.type,
        position: index,
        data: result.data as Record<string, unknown>,
      },
    };
  });

  const invalid = rows.find((r) => 'error' in r);
  if (invalid) return (invalid as { error: string }).error;

  // Replace-all strategy keeps positions and deletions consistent.
  const { error: deleteError } = await supabase
    .from('page_sections')
    .delete()
    .eq('page_id', pageId);
  if (deleteError) return `Could not update sections: ${deleteError.message}`;

  const payload = (rows as { row: Record<string, unknown> }[]).map((r) => r.row);
  if (payload.length > 0) {
    const { error: insertError } = await supabase.from('page_sections').insert(payload);
    if (insertError) return `Could not save sections: ${insertError.message}`;
  }
  return null;
}

export async function savePageAction(
  pageId: string,
  sections: { type: string; data: unknown }[]
): Promise<SaveState> {
  await requireRole('admin', 'editor');

  const parsedSections = z.array(sectionInputSchema).safeParse(sections);
  if (!parsedSections.success) {
    return { error: 'Invalid section payload.' };
  }

  const supabase = await createSupabaseServerClient();

  // Capture publish state and previous slug BEFORE updating, so we can
  // invalidate the right public cache entries below.
  const { data: current } = await supabase
    .from('pages')
    .select('slug, status')
    .eq('id', pageId)
    .single();

  const sectionError = await syncSections(supabase, pageId, parsedSections.data);
  if (sectionError) return { error: sectionError };

  // Published pages must reflect edits on the public site immediately.
  if (current?.status === 'published') {
    const slug = current?.slug ?? 'home';
    revalidatePath(`/${slug}`);
    if (slug === 'home') revalidatePath('/');
  }

  revalidatePath('/admin/content');
  revalidatePath(`/admin/preview/${pageId}`);
  return { success: 'Saved.' };
}

export async function saveSectionAction(
  pageId: string,
  position: number,
  type: string,
  data: unknown
): Promise<SaveState> {
  await requireRole('admin', 'editor');

  const schema = BLOCK_SCHEMAS[type];
  if (!schema) return { error: 'Unknown block type.' };

  const parsed = schema.safeParse(data ?? {});
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid section content.' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('page_sections')
    .update({ data: parsed.data as Record<string, unknown> })
    .eq('page_id', pageId)
    .eq('position', position);
  if (error) {
    console.error('[CMS] saveSectionAction failed:', error.code, error.message);
    return { error: `Could not save section: ${error.message}` };
  }

  const { data: current } = await supabase
    .from('pages')
    .select('slug, status')
    .eq('id', pageId)
    .single();

  if (current?.status === 'published') {
    const slug = current.slug ?? 'home';
    revalidatePath(`/${slug}`);
    if (slug === 'home') revalidatePath('/');
  }

  revalidatePath('/admin/content');
  revalidatePath(`/admin/preview/${pageId}`);
  return { success: 'Section saved.' };
}

export async function setPageStatusAction(
  pageId: string,
  status: ContentStatus,
  slugForRevalidation?: string
): Promise<SaveState> {
  await requireRole('admin', 'editor');

  const supabase = await createSupabaseServerClient();

  const { data: current } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', pageId)
    .single();

  const updates: Record<string, unknown> = { status };
  if (status === 'published') updates.published_at = new Date().toISOString();

  const { error } = await supabase.from('pages').update(updates).eq('id', pageId);
  if (error) {
    console.error('[CMS] setPageStatusAction failed:', error.code, error.message);
    return { error: `Could not change status: ${error.message}` };
  }

  // Targeted cache invalidation for the public site.
  // Always revalidate the slug route — even when unpublishing or archiving —
  // so the cached published version is removed and the route returns 404 or
  // shows the archived state on next visit.
  const slug = slugForRevalidation ?? current?.slug;
  if (slug) {
    revalidatePath(`/${slug}`);
  }
  if (slug === 'home') {
    revalidatePath('/');
  }
  revalidatePath('/admin/content');

  return { success: `Page ${status}.` };
}
