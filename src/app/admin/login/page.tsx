import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Magnus CMS',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    typeof params.next === 'string' && params.next.startsWith('/') && !params.next.startsWith('//')
      ? params.next
      : '/admin/content';
  const resetSuccess = params.reset === 'success';

  return (
    <div className="admin-ui min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Magnus Logo" className="w-20 h-20 object-contain mb-4" />
          <h1 className="adm-title text-3xl">Magnus CMS</h1>
          <p className="adm-subtitle mt-1">Website Control Panel</p>
        </div>

        <div className="adm-card p-8">
          {resetSuccess && (
            <div role="status" className="adm-alert-success mb-5">
              Your password was updated. Sign in with your new password.
            </div>
          )}
          <LoginForm nextPath={nextPath} />
        </div>

        <p className="text-center adm-hint mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
