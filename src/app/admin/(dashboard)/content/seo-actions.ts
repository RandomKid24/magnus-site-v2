'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface SeoSaveState {
  error?: string;
  success?: string;
}

const seoInputSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  canonical_url: z
    .string()
    .max(1000)
    .refine((v) => !v || /^https?:\/\//i.test(v) || v.startsWith('/'), 'Canonical must be a URL or path')
    .optional()
    .nullable(),
  og_title: z.string().max(200).optional().nullable(),
  og_description: z.string().max(500).optional().nullable(),
  og_image_url: z.string().max(1000).optional().nullable(),
  no_index: z.boolean(),
  no_follow: z.boolean(),
});

export async function savePageSeoAction(
  pageId: string,
  input: z.infer<typeof seoInputSchema>
): Promise<SeoSaveState> {
  await requireRole('admin', 'editor');

  const parsed = seoInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid SEO data.' };
  }

  const supabase = await createSupabaseServerClient();

  const values = {
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    canonical_url: parsed.data.canonical_url || null,
    og_title: parsed.data.og_title || null,
    og_description: parsed.data.og_description || null,
    og_image_url: parsed.data.og_image_url || null,
    no_index: parsed.data.no_index,
    no_follow: parsed.data.no_follow,
  };

  // Upsert keyed by the partial unique index on page_id.
  const { error } = await supabase.from('seo_metadata').upsert(
    { page_id: pageId, ...values },
    { onConflict: 'page_id' }
  );

  if (error) return { error: `Could not save SEO settings: ${error.message}` };

  const { data: page } = await supabase.from('pages').select('slug').eq('id', pageId).single();
  if (page?.slug) {
    revalidatePath(`/${page.slug}`);
    if (page.slug === 'home') revalidatePath('/');
  }
  revalidatePath('/admin/content');

  return { success: 'SEO settings saved.' };
}
