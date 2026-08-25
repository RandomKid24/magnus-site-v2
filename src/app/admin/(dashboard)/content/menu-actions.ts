'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface NavActionState {
  error?: string;
  success?: string;
}

const itemSchema = z.object({
  label: z.string().min(1, 'Label is required.').max(100),
  url: z
    .string()
    .min(1, 'URL is required.')
    .max(500)
    .refine(
      (v) => v.startsWith('/') || v.startsWith('#') || /^https?:\/\//i.test(v) || v.startsWith('mailto:') || v.startsWith('tel:'),
      'URL must be a path, #anchor or full link'
    ),
});

function refreshMenus() {
  revalidatePath('/admin/content');
  revalidatePath('/', 'layout');
}

export async function createNavItemAction(
  location: 'header' | 'footer',
  label: string,
  url: string
): Promise<NavActionState> {
  await requireRole('admin', 'editor');

  const parsed = itemSchema.safeParse({ label: label.trim(), url: url.trim() });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();
  const { data: last } = await supabase
    .from('navigation_items')
    .select('position')
    .eq('location', location)
    .order('position', { ascending: false })
    .limit(1);

  const { error } = await supabase.from('navigation_items').insert({
    label: parsed.data.label,
    url: parsed.data.url,
    location,
    position: (last?.[0]?.position ?? -1) + 1,
  });

  if (error) return { error: `Could not add item: ${error.message}` };
  refreshMenus();
  return { success: 'Added.' };
}

export async function updateNavItemAction(
  id: string,
  updates: { label?: string; url?: string; is_visible?: boolean; opens_in_new_tab?: boolean }
): Promise<NavActionState> {
  await requireRole('admin', 'editor');

  const supabase = await createSupabaseServerClient();

  if (updates.label !== undefined || updates.url !== undefined) {
    const { data: current } = await supabase
      .from('navigation_items')
      .select('label, url')
      .eq('id', id)
      .single();
    const parsed = itemSchema.safeParse({
      label: updates.label ?? current?.label ?? '',
      url: updates.url ?? current?.url ?? '',
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    updates.label = parsed.data.label;
    updates.url = parsed.data.url;
  }

  const { error } = await supabase.from('navigation_items').update(updates).eq('id', id);
  if (error) return { error: `Could not update item: ${error.message}` };
  refreshMenus();
  return { success: 'Updated.' };
}

export async function moveNavItemAction(id: string, dir: -1 | 1): Promise<NavActionState> {
  await requireRole('admin', 'editor');

  const supabase = await createSupabaseServerClient();
  const { data: item } = await supabase
    .from('navigation_items')
    .select('id, location, position, parent_id')
    .eq('id', id)
    .single();
  if (!item) return { error: 'Item not found.' };

  const { data: siblings } = await supabase
    .from('navigation_items')
    .select('id, position')
    .eq('location', item.location)
    .is('parent_id', item.parent_id)
    .order('position', { ascending: true });

  const list = siblings ?? [];
  const index = list.findIndex((s) => s.id === id);
  const target = index + dir;
  if (index === -1 || target < 0 || target >= list.length) return { success: undefined };

  const reordered = [...list];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  // Persist new positions for the two swapped rows.
  for (let i = 0; i < reordered.length; i++) {
    if (reordered[i].position !== i) {
      await supabase.from('navigation_items').update({ position: i }).eq('id', reordered[i].id);
    }
  }

  refreshMenus();
  return { success: 'Moved.' };
}

export async function deleteNavItemAction(id: string): Promise<NavActionState> {
  await requireRole('admin', 'editor');

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('navigation_items').delete().eq('id', id);
  if (error) return { error: `Could not delete item: ${error.message}` };
  refreshMenus();
  return { success: 'Deleted.' };
}
