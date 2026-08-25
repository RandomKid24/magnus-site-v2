import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Magnus CMS',
};

// The dashboard was retired — everything lives on the Website Content screen.
export default function AdminDashboardPage() {
  redirect('/admin/content');
}
