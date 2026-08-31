export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="relative">
        <img
          src="/logo.png"
          alt="Magnus Logo"
          className="w-16 h-16 object-contain opacity-90"
        />
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-bold text-slate-700">Loading dashboard…</p>
        <p className="text-xs text-slate-400">Fetching the latest content</p>
      </div>
    </div>
  );
}
