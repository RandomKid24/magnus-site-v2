'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface ResetPasswordFormState {
  success?: string;
  error?: string;
}

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters.').max(128);

export async function resetPasswordAction(
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const code = String(formData.get('code') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!code) {
    return { error: 'This reset link is invalid or has expired. Please request a new one.' };
  }

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();

  // Validate the recovery code. Newer Supabase links carry a token_hash; older
  // ones carry the code as a raw token (verified together with the email).
  let verifyError: { message?: string } | null = null;
  const byHash = await supabase.auth.verifyOtp({ token_hash: code, type: 'recovery' });
  if (byHash.error && email) {
    const byToken = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' });
    verifyError = byToken.error;
  } else {
    verifyError = byHash.error;
  }

  if (verifyError) {
    return { error: 'This reset link is invalid or has expired. Please request a new one.' };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: parsed.data });

  if (updateError) {
    return { error: `Could not update your password: ${updateError.message}` };
  }

  redirect('/admin/login?reset=success');
}
