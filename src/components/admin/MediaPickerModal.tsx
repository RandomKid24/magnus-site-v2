'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Search, UploadCloud } from 'lucide-react';
import {
  uploadMediaAction,
  type MediaActionState,
} from '@/app/admin/(dashboard)/content/media-actions';
import type { MediaItem } from '@/lib/cms/types';

const initialUploadState: MediaActionState = {};

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary !py-1.5 !px-3 text-[11px]">
      <UploadCloud size={13} />
      {pending ? 'Uploading…' : 'Upload'}
    </button>
  );
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  items,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, altText: string) => void;
  items: MediaItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | 'image' | 'video'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadState, setUploadState] = useState<MediaActionState>(initialUploadState);
  const uploadFormKey = useMemo(() => `upload-${Date.now()}`, [uploadState]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (kindFilter !== 'all' && m.kind !== kindFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        m.alt_text?.toLowerCase().includes(q) || m.public_id.toLowerCase().includes(q)
      );
    });
  }, [items, query, kindFilter]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="adm-card w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="adm-title text-lg">Select Media</h3>
          <button onClick={onClose} className="adm-icon-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Upload area */}
        <div className="px-6 pt-4">
          {!uploadOpen ? (
            <button
              onClick={() => setUploadOpen(true)}
              className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl py-3 text-sm font-semibold text-indigo-600 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <UploadCloud size={16} /> Upload a new image or video
            </button>
          ) : (
            <form
              key={uploadFormKey}
              action={async (formData: FormData) => {
                const next = await uploadMediaAction(initialUploadState, formData);
                setUploadState(next);
                if (next.error) return;
                setUploadOpen(false);
                router.refresh();
              }}
              className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="file"
                  name="file"
                  required
                  accept="image/*,video/*"
                  className="flex-1 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-bold file:text-xs file:px-3 file:py-2 file:cursor-pointer cursor-pointer"
                />
                <input
                  type="text"
                  name="altText"
                  maxLength={500}
                  placeholder="Description (optional)"
                  className="adm-input sm:w-56"
                />
                <div className="flex gap-2">
                  <UploadButton />
                  <button
                    type="button"
                    onClick={() => setUploadOpen(false)}
                    className="adm-btn adm-btn-ghost !py-1.5 !px-3 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {uploadState.error && (
                <p role="alert" className="adm-alert-error inline-block">
                  {uploadState.error}
                </p>
              )}
              {uploadState.success && (
                <p role="status" className="adm-alert-success inline-block">
                  {uploadState.success}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-6 py-3.5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media…"
              className="adm-input pl-9"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 self-start">
            {(['all', 'image', 'video'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKindFilter(k)}
                className={`text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-md transition-colors cursor-pointer capitalize ${
                  kindFilter === k
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto px-6 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center adm-hint py-12">
              No media found — upload your first image above.
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.url, item.alt_text ?? '');
                  onClose();
                }}
                className="group relative aspect-video bg-slate-100 rounded-lg border border-slate-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 overflow-hidden cursor-pointer transition-all"
                title={item.alt_text ?? item.public_id}
              >
                {item.kind === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt_text || ''}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Video
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
