'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function setSubmissionReadAction(id: string, isRead: boolean) {
  await requireRole('admin');
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('form_submissions').update({ is_read: isRead }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/submissions');
  return {};
}

export async function deleteSubmissionAction(id: string) {
  await requireRole('admin');
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('form_submissions').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/submissions');
  return {};
}
