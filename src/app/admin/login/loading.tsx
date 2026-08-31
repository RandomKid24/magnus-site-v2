export default function AdminLoginLoading() {
  return (
    <div className="admin-ui min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src="/logo.png"
            alt="Magnus Logo"
            className="w-16 h-16 object-contain opacity-90"
          />
          <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
