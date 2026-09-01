'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { KeyRound } from 'lucide-react';
import { resetPasswordAction, type ResetPasswordFormState } from '@/app/admin/reset-password/actions';

const initialState: ResetPasswordFormState = {};

function ResetSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary w-full py-3.5 text-sm">
      <KeyRound size={15} />
      {pending ? 'Saving…' : 'Set New Password'}
    </button>
  );
}

export default function ResetPasswordForm({
  initialCode,
  initialEmail,
}: {
  initialCode?: string;
  initialEmail?: string;
}) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="code" value={initialCode ?? ''} />
      <input type="hidden" name="email" value={initialEmail ?? ''} />

      {state.success && (
        <div role="status" className="adm-alert-success">
          {state.success}
        </div>
      )}
      {state.error && (
        <div role="alert" className="adm-alert-error">
          {state.error}
        </div>
      )}

      {!initialCode && !state.success ? (
        <div>
          <p className="adm-hint text-sm leading-relaxed">
            This reset link is missing a valid confirmation code. Please use the link you
            received by email, or request a new one from the sign-in page.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="adm-label">
              New password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="adm-input"
              placeholder="••••••••"
            />
          </div>

          <ResetSubmitButton />
        </>
      )}
    </form>
  );
}
