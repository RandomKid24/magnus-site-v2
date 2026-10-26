import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import SubmissionsList, { type Submission } from './SubmissionsList';
import { AdminPageHeader, AdminCard, EmptyState } from '@/components/admin/AdminUI';

export const metadata = { title: 'Submissions | Magnus CMS' };
export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage() {
  await requireRole('admin');

  let items: Submission[] = [];
  let loadError: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    items = (data ?? []) as Submission[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load submissions.';
  }

  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <AdminPageHeader
        title="Submissions"
        subtitle={`${items.length} total · ${unread} unread. Contains personal data — see the Privacy Policy for retention.`}
      />
      {loadError ? (
        <AdminCard className="p-6"><p className="adm-alert-error">{loadError}</p></AdminCard>
      ) : items.length === 0 ? (
        <EmptyState title="No submissions yet" description="Enquiries and feedback from your website forms will appear here." />
      ) : (
        <AdminCard><SubmissionsList items={items} /></AdminCard>
      )}
    </div>
  );
}
