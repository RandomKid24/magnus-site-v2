'use client';

import { useFormStatus } from 'react-dom';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/admin/actions';

function SignOutInner() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 cursor-pointer"
    >
      <LogOut size={14} />
      {pending ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SignOutInner />
    </form>
  );
}
