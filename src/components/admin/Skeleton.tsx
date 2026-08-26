export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="adm-card p-5 space-y-3">
      <SkeletonLine className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="adm-card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <SkeletonLine className="h-4 w-48" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <SkeletonLine className="h-4 w-32" />
            <SkeletonLine className="h-4 flex-1" />
            <SkeletonLine className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
