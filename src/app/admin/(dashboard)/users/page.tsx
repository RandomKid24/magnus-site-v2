import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import UsersTable from './UsersTable';
import { AdminPageHeader, AdminCard, EmptyState } from '@/components/admin/AdminUI';
import type { ProfileRow } from '@/lib/cms/types';

export const metadata = {
  title: 'Users | Magnus CMS',
};

export default async function AdminUsersPage() {
  const current = await requireRole('admin');

  let users: ProfileRow[] = [];
  let loadError: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    users = (data ?? []) as ProfileRow[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load users.';
  }

  return (
    <div>
      <AdminPageHeader title="Users" subtitle="Roles control what each person can edit" />

      <AdminCard className="p-5 mb-8">
        <p className="adm-hint leading-relaxed">
          <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">Roles:</span>{' '}
          <span className="text-indigo-600 font-bold">Administrator</span> — everything ·{' '}
          <span className="text-emerald-600 font-bold">Editor</span> — pages, posts, media,
          navigation, SEO ·{' '}
          <span className="text-amber-600 font-bold">Author</span> — own posts and media.
          <br />
          New accounts can be invited in the Supabase dashboard (Authentication → Users); they
          start as Authors. Use <code className="text-indigo-600 font-semibold">npm run create-admin</code>{' '}
          for the first admin.
        </p>
      </AdminCard>

      {loadError ? (
        <AdminCard className="p-6">
          <p className="adm-alert-error">{loadError}</p>
        </AdminCard>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users"
          description="No profiles found. Run npm run create-admin or invite users via the Supabase dashboard."
        />
      ) : (
        <AdminCard>
          <UsersTable users={users} currentUserId={current.id} />
        </AdminCard>
      )}
    </div>
  );
}
