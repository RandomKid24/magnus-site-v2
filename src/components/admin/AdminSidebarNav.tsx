'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/auth';

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
