'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LogIn } from 'lucide-react';
import { signInAction, type AuthFormState } from '@/app/admin/actions';

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="adm-btn adm-btn-primary w-full py-3.5 text-sm"
    >
      <LogIn size={15} />
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  );
}

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {state.error && (
        <div role="alert" className="adm-alert-error">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="adm-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="adm-input"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="adm-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="adm-input"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
