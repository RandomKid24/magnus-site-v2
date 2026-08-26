'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const btnClass =
    variant === 'danger' ? 'adm-btn-danger' : 'adm-btn-primary';

  return (
    <div
      className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="adm-card w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="adm-title text-lg">{title}</h3>
            <p className="adm-hint mt-1">{message}</p>
          </div>
          <button onClick={onCancel} className="adm-icon-btn shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onCancel} className="adm-btn adm-btn-ghost">
            Cancel
          </button>
          <button ref={confirmRef} onClick={onConfirm} className={`adm-btn ${btnClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
