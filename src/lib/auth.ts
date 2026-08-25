import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type Role = 'admin' | 'editor' | 'author';

export interface StaffUser {
  id: string;
  email: string;
  role: Role;
  fullName: string | null;
}

/**
 * Returns the authenticated staff user (with server-verified role), or null.
 * The role always comes from the profiles table — never from client input.
 */
export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    role: profile.role as Role,
    fullName: profile.full_name ?? null,
  };
}

/** For pages/actions that require any authenticated staff member. */
export async function requireStaff(): Promise<StaffUser> {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  return user;
}

/** For pages/actions that require one of the given roles. */
export async function requireRole(...roles: Role[]): Promise<StaffUser> {
  const user = await requireStaff();
  if (!roles.includes(user.role)) redirect('/admin/content?error=forbidden');
  return user;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  editor: 'Editor',
  author: 'Author',
};
