import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireStaff, ROLE_LABELS } from '@/lib/auth';
import AdminSidebarNav from '@/components/admin/AdminSidebarNav';
import SignOutButton from '@/components/admin/SignOutButton';
import AdminToastProvider from './toast-provider';

export const dynamic = 'force-dynamic';

// The entire admin area is private — never indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireStaff();

  return (
    <div className="admin-ui flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white h-screen">
        <Link
          href="/admin/content"
          className="flex items-center gap-3 px-6 py-6 border-b border-slate-100"
        >
          <img src="/logo.png" alt="Magnus Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="font-space text-xl font-bold tracking-tight text-slate-900">
              Magnus CMS
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-500">
              Website Control Panel
            </span>
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto py-5">
          <AdminSidebarNav role={user.role} />
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-space font-bold text-sm uppercase">
              {(user.fullName || user.email).charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate">
                {user.fullName || user.email}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <Link href="/admin/content" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
            <span className="font-space font-bold tracking-tight text-slate-900">Magnus CMS</span>
          </Link>
          <SignOutButton />
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden border-b border-slate-200 bg-white overflow-x-auto">
          <div className="px-3 py-2.5 min-w-max">
            <AdminSidebarNav role={user.role} horizontal />
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
      <AdminToastProvider />
    </div>
  );
}
