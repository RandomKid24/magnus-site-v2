'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { KeyRound, Trash2, X } from 'lucide-react';
import { setUserRoleAction, deleteUserAction, resetUserPasswordAction } from './actions';
import Tooltip from '@/components/admin/Tooltip';
import type { ProfileRow } from '@/lib/cms/types';

const ROLE_LABELS: Record<ProfileRow['role'], string> = {
  admin: 'Administrator — full control',
  editor: 'Editor — pages, posts, media',
  author: 'Author — own posts only',
};

function RoleSelect({ userId, role }: { userId: string; role: ProfileRow['role'] }) {
  const [value, setValue] = useState<ProfileRow['role']>(role);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as ProfileRow['role'];
          setError(null);
          startTransition(async () => {
            const res = await setUserRoleAction(userId, next);
            if (res.error) {
              setError(res.error);
              setValue(role); // revert on failure
            } else {
              setValue(next);
            }
          });
        }}
        className="adm-select w-auto pr-8"
        aria-label="User role"
      >
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
        <option value="author">Author</option>
      </select>
      {error && <span className="adm-alert-error inline-block">{error}</span>}
    </div>
  );
}

function ResetPasswordModal({
  userId,
  self,
  onClose,
}: {
  userId: string;
  self: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await resetUserPasswordAction(userId, value);
      if (res.error) {
        setError(res.error);
        return;
      }
      onClose();
      setValue('');
    });
  };

  return (
    <div
      className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
    >
      <div
        className="adm-card w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <KeyRound size={20} />
          </div>
          <div className="flex-1">
            <h3 id="reset-password-title" className="adm-title text-lg">
              {self ? 'Change your password' : 'Reset password'}
            </h3>
            <p className="adm-hint mt-1">
              {self
                ? 'Enter a new password for your account.'
                : 'Enter a new password for this user. They will need it to sign in next time.'}
            </p>
          </div>
          <button onClick={onClose} className="adm-icon-btn shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="adm-label">New password</label>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Min 8 characters"
            minLength={8}
            maxLength={128}
            className="adm-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          {error && <span className="adm-alert-error inline-block">{error}</span>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="adm-btn adm-btn-ghost">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={pending || value.length < 8}
            className="adm-btn adm-btn-primary"
          >
            {pending ? 'Saving…' : 'Save password'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordButton({ userId, self = false }: { userId: string; self?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        label={self ? 'Change your password' : 'Reset password'}
        hint={self ? 'Update the password you sign in with' : 'Set a new password for this user'}
      >
        <button
          onClick={() => setOpen(true)}
          className="adm-icon-btn"
          aria-label={self ? 'Change your password' : 'Reset password'}
        >
          <KeyRound size={15} />
        </button>
      </Tooltip>
      {open && <ResetPasswordModal userId={userId} self={self} onClose={() => setOpen(false)} />}
    </>
  );
}

function DeleteButton({ userId }: { userId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1.5">
      {error && <span className="adm-alert-error inline-block">{error}</span>}
      {confirming ? (
        <>
          <button
            onClick={() =>
              startTransition(async () => {
                const res = await deleteUserAction(userId);
                if (res.error) {
                  setError(res.error);
                  setConfirming(false);
                }
              })
            }
            disabled={pending}
            className="adm-btn adm-btn-danger !py-1.5 !px-3 text-[11px]"
          >
            {pending ? '…' : 'Sure?'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="adm-icon-btn"
            aria-label="Cancel"
          >
            ✕
          </button>
        </>
      ) : (
        <Tooltip label="Delete user" hint="Remove this account permanently">
          <button
            onClick={() => setConfirming(true)}
            title="Delete user"
            className="adm-icon-btn adm-icon-btn-danger"
          >
            <Trash2 size={15} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

export default function UsersTable({
  users,
  currentUserId,
}: {
  users: ProfileRow[];
  currentUserId: string;
}) {
  return (
    <div className="overflow-x-clip">
      <table className="adm-table min-w-[720px]">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th className="hidden md:table-cell">Joined</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <span className="text-sm font-semibold text-slate-900">
                  {user.email}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-indigo-500">
                      (you)
                    </span>
                  )}
                </span>
              </td>
              <td>
                <span className="text-sm text-slate-500">{user.full_name || '—'}</span>
              </td>
              <td>
                {user.id === currentUserId ? (
                  <span className="adm-badge adm-badge-published">Administrator</span>
                ) : (
                  <RoleSelect userId={user.id} role={user.role} />
                )}
                <p className="adm-hint mt-0.5">{ROLE_LABELS[user.role]}</p>
              </td>
              <td className="hidden md:table-cell">
                <span className="adm-hint">{new Date(user.created_at).toISOString().slice(0, 10)}</span>
              </td>
              <td className="text-right">
                {user.id === currentUserId ? (
                  <ResetPasswordButton userId={user.id} self />
                ) : (
                  <div className="flex items-center justify-end gap-1.5">
                    <ResetPasswordButton userId={user.id} />
                    <DeleteButton userId={user.id} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
