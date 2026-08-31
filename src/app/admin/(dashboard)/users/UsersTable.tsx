'use client';

import { useState, useTransition } from 'react';
import { KeyRound, Trash2 } from 'lucide-react';
import { setUserRoleAction, deleteUserAction, resetUserPasswordAction } from './actions';
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

function ResetPasswordButton({ userId, self = false }: { userId: string; self?: boolean }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await resetUserPasswordAction(userId, value);
      if (res.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setValue('');
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title={self ? 'Change your password' : 'Reset password'}
        className="adm-icon-btn"
      >
        <KeyRound size={15} />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {error && <span className="adm-alert-error inline-block">{error}</span>}
      <input
        autoFocus
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={self ? 'New password (min 8 chars)' : 'New password (min 8 chars)'}
        minLength={8}
        className="adm-input w-44 !py-1.5 text-xs"
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
      <button
        onClick={submit}
        disabled={pending || value.length < 8}
        className="adm-btn adm-btn-primary !py-1.5 !px-3 text-[11px]"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>
      <button
        onClick={() => {
          setOpen(false);
          setValue('');
          setError(null);
        }}
        className="adm-icon-btn"
        aria-label="Cancel"
      >
        ✕
      </button>
    </div>
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
        <button
          onClick={() => setConfirming(true)}
          title="Delete user"
          className="adm-icon-btn adm-icon-btn-danger"
        >
          <Trash2 size={15} />
        </button>
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
    <div className="overflow-x-auto">
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
