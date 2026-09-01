'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { LogIn, Mail } from 'lucide-react';
import { signInAction, forgotPasswordAction, type AuthFormState, type ForgotPasswordFormState } from '@/app/admin/actions';

const initialState: AuthFormState = {};
const forgotInitialState: ForgotPasswordFormState = {};

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

function ForgotSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-ghost w-full py-3 text-sm">
      <Mail size={15} />
      {pending ? 'Sending…' : 'Send Reset Link'}
    </button>
  );
}

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [forgotState, forgotAction] = useActionState(forgotPasswordAction, forgotInitialState);

  if (mode === 'forgot') {
    return (
      <form action={forgotAction} className="space-y-5">
        {forgotState.success && (
          <div role="status" className="adm-alert-success">
            {forgotState.success}
          </div>
        )}
        {forgotState.error && (
          <div role="alert" className="adm-alert-error">
            {forgotState.error}
          </div>
        )}

        <div>
          <p className="adm-hint text-sm leading-relaxed">
            Enter your account email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="adm-label">
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="adm-input"
            placeholder="you@company.com"
          />
        </div>

        <ForgotSubmitButton />

        <button
          type="button"
          onClick={() => {
            setMode('login');
          }}
          className="w-full text-center text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          Back to sign in
        </button>
      </form>
    );
  }

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

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setMode('forgot');
          }}
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}
