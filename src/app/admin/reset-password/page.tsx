import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/admin/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Magnus CMS',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; email?: string }>;
}) {
  const params = await searchParams;
  const code = typeof params.code === 'string' ? params.code : undefined;
  const email = typeof params.email === 'string' ? params.email : undefined;

  return (
    <div className="admin-ui min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Magnus Logo" className="w-20 h-20 object-contain mb-4" />
          <h1 className="adm-title text-3xl">Magnus CMS</h1>
          <p className="adm-subtitle mt-1">Choose a new password</p>
        </div>

        <div className="adm-card p-8">
          <ResetPasswordForm initialCode={code} initialEmail={email} />
        </div>
      </div>
    </div>
  );
}
