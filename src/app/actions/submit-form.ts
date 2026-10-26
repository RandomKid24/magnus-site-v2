'use server';

import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const text = (max: number) => z.string().trim().max(max);

const schema = z.object({
  source: z.enum(['contact', 'profile_enquiry', 'profile_feedback']),
  name: text(120).optional(),
  email: z.union([z.literal(''), z.email().max(200)]).optional(),
  phone: text(30).optional(),
  service: text(200).optional(),
  message: text(4000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export type FormInput = z.input<typeof schema>;

/** Stores a public form submission. Insert goes through the service-role client (no anon write policy). */
export async function submitFormAction(input: FormInput): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const row = parsed.data;
  try {
    const { error } = await createSupabaseAdminClient()
      .from('form_submissions')
      .insert({ ...row, email: row.email || null });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
