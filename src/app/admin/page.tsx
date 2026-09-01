import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Magnus CMS',
};

// The bare /admin path resolves to the Website Content dashboard.
export default function AdminPage() {
  redirect('/admin/content');
}
