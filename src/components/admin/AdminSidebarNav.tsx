'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Home,
  Users,
  Building2,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/auth';
import {
  getSidebarSections,
  type SidebarSection,
} from '@/app/admin/(dashboard)/content/actions';

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  roles: Role[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin/content',
    label: 'Website Content',
    description: 'Edit your homepage',
    icon: Home,
    roles: ['admin', 'editor'],
  },
  {
    href: '/admin/website',
    label: 'Website Details',
    description: 'Contact, social & branding',
    icon: Building2,
    roles: ['admin'],
  },
  {
    href: '/admin/users',
    label: 'Users',
    description: 'Team roles & access',
    icon: Users,
    roles: ['admin'],
  },
];

const GROUP_LABELS: Record<string, string> = {
  '/admin/content': 'Content',
  '/admin/users': 'Team',
};

function groupFor(item: AdminNavItem): string {
  return item.href.startsWith('/admin/users') ? 'Team' : 'Content';
}

export default function AdminSidebarNav({
  role,
  horizontal = false,
}: {
  role: Role;
  horizontal?: boolean;
}) {
  const pathname = usePathname();

  const EDIT_PATH = /^\/admin\/content\/sections\/\d+$/;
  const isEditPage = EDIT_PATH.test(pathname);
  const activePosition = isEditPage ? Number(pathname.split('/').pop()) : null;

  const [sections, setSections] = useState<SidebarSection[] | null>(null);

  useEffect(() => {
    if (!isEditPage) return;
    let alive = true;
    getSidebarSections()
      .then((s) => {
        if (alive) setSections(s);
      })
      .catch(() => {
        if (alive) setSections([]);
      });
    return () => {
      alive = false;
      setSections(null);
    };
  }, [isEditPage]);

  // While editing a section, replace the main nav with the page-sections list so
  // you can jump between sections and get back to the content overview.
  if (isEditPage) {
    if (horizontal) {
      return (
        <nav className="flex flex-row items-center gap-2">
          <Link
            href="/admin/content"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <ArrowLeft size={15} />
            Content
          </Link>
          <span className="w-px h-5 bg-slate-200" />
          {sections === null ? (
            <span className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">
              Loading…
            </span>
          ) : (
            sections.map((s) => {
              const active = s.position === activePosition;
              return (
                <Link
                  key={`${s.position}-${s.type}`}
                  href={`/admin/content/sections/${s.position}`}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer',
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  )}
                >
                  <span className="text-[10px]">{s.position + 1}</span>
                  {s.label}
                </Link>
              );
            })
          )}
        </nav>
      );
    }

    return (
      <nav className="flex flex-col gap-4">
        <Link
          href="/admin/content"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to Website Content
        </Link>
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Page Sections
          </p>
          <div className="flex flex-col gap-0.5">
            {sections === null ? (
              <p className="px-3 py-2 text-[11px] text-slate-400">Loading sections…</p>
            ) : sections.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-slate-400">No sections found.</p>
            ) : (
              sections.map((s) => {
                const active = s.position === activePosition;
                return (
                  <Link
                    key={`${s.position}-${s.type}`}
                    href={`/admin/content/sections/${s.position}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150',
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold',
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                      )}
                    >
                      {s.position + 1}
                    </span>
                    <span className="min-w-0 truncate text-[12px] font-bold leading-tight">
                      {s.label}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </nav>
    );
  }

  if (horizontal) {
    return (
      <nav className="flex flex-row gap-1">
        {ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              )}
            >
              <Icon size={15} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  const visible = ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));
  const groups = ['Content', 'Team'].filter((g) =>
    visible.some((i) => groupFor(i) === g)
  );

  return (
    <nav className="flex flex-col gap-5 px-3">
      {groups.map((group) => (
        <div key={group}>
          {groups.length > 1 && (
            <p className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
              {group}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {visible
              .filter((item) => groupFor(item) === group)
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.description}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn('shrink-0', isActive ? 'text-white' : 'text-indigo-500')}
                    />
                    <span className="flex flex-col leading-tight">
                      <span className="text-[13px] font-bold">{item.label}</span>
                      <span
                        className={cn(
                          'text-[10px] font-medium',
                          isActive ? 'text-indigo-100' : 'text-slate-400'
                        )}
                      >
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );
}
