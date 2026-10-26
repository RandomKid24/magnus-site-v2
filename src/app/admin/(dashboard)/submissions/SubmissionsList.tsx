'use client';

import { useState, useTransition } from 'react';
import { Mail, Trash2, Check, Star } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { setSubmissionReadAction, deleteSubmissionAction } from './actions';

export interface Submission {
  id: string;
  source: 'contact' | 'profile_enquiry' | 'profile_feedback';
  name: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  message: string | null;
  rating: number | null;
  is_read: boolean;
  created_at: string;
}

const SOURCES: Record<Submission['source'], { label: string; hint: string }> = {
  contact: { label: 'Contact form', hint: 'Sent from the Contact section on the website' },
  profile_enquiry: { label: 'Profile enquiry', hint: 'Sent from the Business Profile page' },
  profile_feedback: { label: 'Profile feedback', hint: 'Star rating left on the Business Profile page' },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400 pt-0.5">{label}</dt>
      <dd className="min-w-0 text-slate-800 break-words">{children}</dd>
    </div>
  );
}

export default function SubmissionsList({ items }: { items: Submission[] }) {
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<string | null>(null);

  return (
    <>
      <ul className="divide-y divide-slate-100">
        {items.map((s) => (
          <li key={s.id} className={`p-5 ${s.is_read ? '' : 'bg-indigo-50/50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {!s.is_read && <span className="adm-badge adm-badge-published">New</span>}
                <span className="adm-badge adm-badge-draft" title={SOURCES[s.source].hint}>
                  {SOURCES[s.source].label}
                </span>
                <span className="adm-hint">
                  {SOURCES[s.source].hint} ·{' '}
                  {new Date(s.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {s.email && (
                  <a href={`mailto:${s.email}`} className="adm-btn adm-btn-primary">
                    <Mail size={14} /> Reply by email
                  </a>
                )}
                <button
                  disabled={pending}
                  onClick={() => startTransition(async () => { await setSubmissionReadAction(s.id, !s.is_read); })}
                  className="adm-btn adm-btn-ghost"
                >
                  <Check size={14} /> {s.is_read ? 'Mark as unread' : 'Mark as read'}
                </button>
                <button onClick={() => setToDelete(s.id)} className="adm-icon-btn" aria-label="Delete submission" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <dl className="space-y-2">
              {s.name && <Field label="Name">{s.name}</Field>}
              {s.email && <Field label="Email"><a href={`mailto:${s.email}`} className="text-indigo-600 hover:underline">{s.email}</a></Field>}
              {s.phone && <Field label="Phone"><a href={`tel:${s.phone}`} className="text-indigo-600 hover:underline">{s.phone}</a></Field>}
              {s.service && <Field label="Service">{s.service}</Field>}
              {s.rating && (
                <Field label="Rating">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                    <Star size={13} fill="currentColor" /> {s.rating} out of 5
                  </span>
                </Field>
              )}
              {s.message && <Field label="Message"><span className="whitespace-pre-wrap">{s.message}</span></Field>}
            </dl>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete submission?"
        message="This permanently removes the submission and cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          const id = toDelete!;
          setToDelete(null);
          startTransition(async () => { await deleteSubmissionAction(id); });
        }}
      />
    </>
  );
}
