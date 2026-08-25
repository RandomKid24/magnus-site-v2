'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface SiteDetailsState {
  error?: string;
  success?: string;
}

const contactSchema = z.object({
  address: z.string().max(500),
  email: z.string().email('Invalid email address.').or(z.literal('')),
  phone: z.string().max(50),
});

const socialSchema = z.object({
  linkedin: z.string().max(500).optional(),
  twitter: z.string().max(500).optional(),
  facebook: z.string().max(500).optional(),
});

const brandingSchema = z.object({
  tagline: z.string().max(300),
  logo_url: z.string().max(1000),
  footer_blurb: z.string().max(500),
  certification_label: z.string().max(100),
});

function refreshSite() {
  // Settings render across the whole public site (layout-level).
  revalidatePath('/', 'layout');
  revalidatePath('/admin/content');
}

export async function saveContactDetailsAction(input: {
  address: string;
  email: string;
  phone: string;
}): Promise<SiteDetailsState> {
  await requireRole('admin');

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'contact', value: parsed.data }, { onConflict: 'key' });

  if (error) return { error: `Could not save contact details: ${error.message}` };
  refreshSite();
  return { success: 'Contact details saved.' };
}

export async function saveSocialLinksAction(input: {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}): Promise<SiteDetailsState> {
  await requireRole('admin');

  const parsed = socialSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'social', value: parsed.data }, { onConflict: 'key' });

  if (error) return { error: `Could not save social links: ${error.message}` };
  refreshSite();
  return { success: 'Social links saved.' };
}

export async function saveBrandingAction(input: {
  tagline: string;
  logo_url: string;
  footer_blurb: string;
  certification_label: string;
}): Promise<SiteDetailsState> {
  await requireRole('admin');

  const parsed = brandingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();

  // Merge with the stored identity so name/suffix are never lost — this card
  // only edits a subset of the branding fields.
  const { data: currentRow } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'site_identity')
    .maybeSingle();

  const merged = {
    ...(typeof currentRow?.value === 'object' && currentRow.value !== null
      ? (currentRow.value as Record<string, unknown>)
      : {}),
    ...parsed.data,
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'site_identity', value: merged }, { onConflict: 'key' });

  if (error) return { error: `Could not save branding: ${error.message}` };
  refreshSite();
  return { success: 'Branding saved.' };
}
