import type { ReactNode } from 'react';

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="adm-title text-3xl lg:text-4xl">{title}</h1>
        {subtitle && <p className="adm-subtitle mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`adm-card ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <AdminCard className="p-6">
      <p className="font-sans text-[11px] font-bold tracking-wider uppercase text-slate-500">
        {label}
      </p>
      <p className="font-space text-5xl font-bold tracking-tight mt-3 text-indigo-600">{value}</p>
      {hint && <p className="adm-hint mt-2">{hint}</p>}
    </AdminCard>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'published'
      ? 'adm-badge-published'
      : status === 'archived'
        ? 'adm-badge-archived'
        : 'adm-badge-draft';
  return <span className={`adm-badge ${variant}`}>{status}</span>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <AdminCard className="p-16 flex flex-col items-center text-center">
      <div className="w-12 h-1.5 rounded-full bg-indigo-500 mb-6" />
      <h3 className="adm-title text-xl mb-2">{title}</h3>
      <p className="adm-hint max-w-sm mb-6">{description}</p>
      {action}
    </AdminCard>
  );
}
