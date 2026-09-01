'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface AuthFormState {
  error?: string;
}

export interface ForgotPasswordFormState {
  success?: string;
  error?: string;
}

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function safeNextPath(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '';
  // Only allow relative paths starting with a single slash (open-redirect guard).
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return '/admin/content';
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const nextPath = safeNextPath(formData.get('next'));

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Invalid email or password.' };
  }

  redirect(nextPath);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function forgotPasswordAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const email = String(formData.get('email') ?? '').trim();

  if (!email) {
    return { error: 'Please enter your email address.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/admin/reset-password`,
  });

  // Always report success so we don't leak which emails exist.
  if (error) {
    return { error: 'Could not send a reset link. Please try again later.' };
  }

  return { success: 'If that email is registered, a password reset link is on its way.' };
}
