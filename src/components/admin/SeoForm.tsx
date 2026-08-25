'use client';

import { useState, useTransition } from 'react';
import { Check, Save } from 'lucide-react';
import { savePageSeoAction, type SeoSaveState } from '@/app/admin/(dashboard)/content/seo-actions';
import type { SeoMetadata } from '@/lib/cms/types';

export default function SeoForm({
  pageId,
  pageSlug,
  initial,
}: {
  pageId: string;
  pageSlug: string;
  initial: Partial<SeoMetadata> | null;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    canonical_url: initial?.canonical_url ?? '',
    og_title: initial?.og_title ?? '',
    og_description: initial?.og_description ?? '',
    og_image_url: initial?.og_image_url ?? '',
    no_index: initial?.no_index ?? false,
    no_follow: initial?.no_follow ?? false,
  });
  const [result, setResult] = useState<SeoSaveState | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setResult(null);
    startTransition(async () => {
      const res = await savePageSeoAction(pageId, form);
      setResult(res);
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="adm-card p-6 space-y-4">
        <div>
          <h2 className="adm-title text-base">Search Engine Listing</h2>
          <p className="adm-hint mt-1">
            How this page appears on Google. Page address:{' '}
            <code className="text-indigo-600 font-semibold">/{pageSlug}</code>
          </p>
        </div>
        <div>
          <label className="adm-label">SEO Title</label>
          <input
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
            maxLength={200}
            placeholder="Defaults to the page title"
            className="adm-input"
          />
        </div>
        <div>
          <label className="adm-label">Meta Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Shown under the title in search results"
            className="adm-input resize-y"
          />
        </div>
        <div>
          <label className="adm-label">Canonical URL</label>
          <input
            value={form.canonical_url}
            onChange={(e) => set('canonical_url')(e.target.value)}
            maxLength={1000}
            placeholder="https://example.com/page"
            className="adm-input"
          />
        </div>
      </div>

      <div className="adm-card p-6 space-y-4">
        <div>
          <h2 className="adm-title text-base">Social Sharing (Open Graph)</h2>
          <p className="adm-hint mt-1">Preview card shown when someone shares the link on WhatsApp/Facebook.</p>
        </div>
        <div>
          <label className="adm-label">Social Title</label>
          <input
            value={form.og_title}
            onChange={(e) => set('og_title')(e.target.value)}
            maxLength={200}
            placeholder="Defaults to SEO title"
            className="adm-input"
          />
        </div>
        <div>
          <label className="adm-label">Social Description</label>
          <textarea
            value={form.og_description}
            onChange={(e) => set('og_description')(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Defaults to meta description"
            className="adm-input resize-y"
          />
        </div>
        <div>
          <label className="adm-label">Social Image URL</label>
          <input
            value={form.og_image_url}
            onChange={(e) => set('og_image_url')(e.target.value)}
            maxLength={1000}
            placeholder="https://res.cloudinary.com/…"
            className="adm-input"
          />
        </div>
      </div>

      <div className="adm-card p-6 space-y-3">
        <h2 className="adm-title text-base">Search Engine Rules</h2>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.no_index}
            onChange={(e) => set('no_index')(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-600">
            Hide this page from Google entirely
          </span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.no_follow}
            onChange={(e) => set('no_follow')(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-600">
            Do not follow links on this page
          </span>
        </label>
      </div>

      <div className="flex items-center gap-4 sticky bottom-4 adm-card p-4 inline-flex">
        <button onClick={handleSave} disabled={pending} className="adm-btn adm-btn-primary">
          <Save size={15} />
          {pending ? 'Saving…' : 'Save SEO'}
        </button>
        {result?.error && (
          <span role="alert" className="adm-alert-error inline-block">
            {result.error}
          </span>
        )}
        {result?.success && (
          <span role="status" className="adm-alert-success inline-flex items-center gap-1.5">
            <Check size={13} /> {result.success}
          </span>
        )}
      </div>
    </div>
  );
}
