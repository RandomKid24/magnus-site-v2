'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export interface UserActionState {
  error?: string;
  success?: string;
}

const roleSchema = z.enum(['admin', 'editor', 'author']);

/**
 * Role changes run through the service-role client because RLS deliberately
 * revokes `UPDATE (role)` from authenticated users — only trusted server code
 * may promote/demote, and only an admin may request it.
 */
export async function setUserRoleAction(
  userId: string,
  role: string
): Promise<UserActionState> {
  const current = await requireRole('admin');

  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { error: 'Invalid role.' };

  if (userId === current.id && parsed.data !== 'admin') {
    return { error: 'You cannot demote your own account.' };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from('profiles').update({ role: parsed.data }).eq('id', userId);

  if (error) return { error: `Could not update role: ${error.message}` };
  revalidatePath('/admin/users');
  return { success: 'Role updated.' };
}

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters.').max(128);

/**
 * Resets a user's password directly. Runs through the service-role client
 * because only trusted server code with the service key may set a password;
 * RLS deliberately blocks regular users from doing so.
 */
export async function resetUserPasswordAction(
  userId: string,
  newPassword: string
): Promise<UserActionState> {
  await requireRole('admin');

  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: parsed.data,
  });

  if (error) return { error: `Could not reset password: ${error.message}` };
  revalidatePath('/admin/users');
  return { success: 'Password updated.' };
}

export async function deleteUserAction(userId: string): Promise<UserActionState> {
  const current = await requireRole('admin');

  if (userId === current.id) {
    return { error: 'You cannot delete your own account.' };
  }

  // Deletes the auth user; profiles cascade via FK.
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) return { error: `Could not delete user: ${error.message}` };
  revalidatePath('/admin/users');
  return { success: 'User deleted.' };
}
