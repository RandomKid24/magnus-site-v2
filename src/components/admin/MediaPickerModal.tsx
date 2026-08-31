'use client';

import Image from 'next/image';
import { useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, UploadCloud } from 'lucide-react';
import {
  uploadMediaAction,
  type MediaActionState,
} from '@/app/admin/(dashboard)/content/media-actions';
import Tooltip from './Tooltip';
import type { MediaItem } from '@/lib/cms/types';

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
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ file: File; preview: string } | null>(null);
  const [altText, setAltText] = useState('');
  const [pending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const acceptFile = (file: File) => {
    setUploadError(null);
    setAltText('');
    const isImage = file.type.startsWith('image/') && !file.type.includes('svg');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setUploadError('Unsupported file type. Images and videos only.');
      return;
    }
    const max = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > max) {
      setUploadError(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Limit: ${max / 1024 / 1024} MB.`
      );
      return;
    }
    setPendingFile({ file, preview: isVideo ? '' : URL.createObjectURL(file) });
  };

  const startUpload = () => {
    if (!pendingFile) return;
    const fd = new FormData();
    fd.append('file', pendingFile.file);
    fd.append('altText', altText);
    startTransition(async () => {
      const res: MediaActionState = await uploadMediaAction({}, fd);
      if (res.error) {
        setUploadError(res.error);
        return;
      }
      setPendingFile(null);
      setAltText('');
      setUploadError(null);
      router.refresh();
    });
  };

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
          <Tooltip label="Close" placement="left">
            <button onClick={onClose} className="adm-icon-btn" aria-label="Close">
              <X size={20} />
            </button>
          </Tooltip>
        </div>

        {/* Upload area */}
        <div className="px-6 pt-4 space-y-3">
          {!pendingFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) acceptFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-indigo-200 bg-indigo-50/40 hover:border-indigo-300 hover:bg-indigo-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) acceptFile(file);
                  e.target.value = '';
                }}
              />
              <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                <UploadCloud size={18} className="text-indigo-500 mb-1.5" />
                <p className="text-sm font-bold text-indigo-600">
                  Drag &amp; drop an image or video, or click to browse
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {pendingFile.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pendingFile.preview}
                  alt="Preview"
                  className="h-20 w-28 rounded-lg border border-slate-200 object-cover shrink-0"
                />
              ) : (
                <div className="h-20 w-28 shrink-0 rounded-lg border border-slate-200 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white">
                  Video
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 truncate">{pendingFile.file.name}</p>
                <p className="text-xs text-slate-400">
                  {(pendingFile.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Description (optional)"
                  maxLength={500}
                  onClick={(e) => e.stopPropagation()}
                  className="adm-input mt-2 w-full sm:w-72"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startUpload();
                  }}
                  disabled={pending}
                  className="adm-btn adm-btn-primary !py-1.5 !px-3 text-[11px]"
                >
                  <UploadCloud size={13} />
                  {pending ? 'Uploading…' : 'Upload'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingFile(null);
                  }}
                  disabled={pending}
                  className="adm-btn adm-btn-ghost !py-1.5 !px-3 text-[11px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {uploadError && (
            <p role="alert" className="adm-alert-error inline-block">
              {uploadError}
            </p>
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
