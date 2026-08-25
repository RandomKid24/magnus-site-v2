'use client';

import { useState, useTransition } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  createNavItemAction,
  updateNavItemAction,
  moveNavItemAction,
  deleteNavItemAction,
  type NavActionState,
} from '@/app/admin/(dashboard)/content/menu-actions';
import type { NavigationItem } from '@/lib/cms/types';

function LocationManager({
  location,
  items,
}: {
  location: 'header' | 'footer';
  items: NavigationItem[];
}) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<NavActionState | null>(null);
  const [pending, startTransition] = useTransition();

  const roots = items.filter((i) => !i.parent_id).sort((a, b) => a.position - b.position);

  const run = (fn: () => Promise<NavActionState>) => {
    setResult(null);
    startTransition(async () => setResult(await fn()));
  };

  return (
    <div className="adm-card p-6">
      <h3 className="adm-title text-base capitalize mb-0.5">
        {location} Menu
      </h3>
      <p className="adm-hint mb-4">
        {location === 'header'
          ? 'Links in the top bar of your website.'
          : 'Links at the very bottom of your website.'}
      </p>

      <div className="divide-y divide-slate-100 mb-4">
        {roots.length === 0 && (
          <p className="py-3 adm-hint">No links yet — add one below.</p>
        )}
        {roots.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 py-2.5">
            <input
              defaultValue={item.label}
              maxLength={100}
              aria-label="Link name"
              onBlur={(e) => {
                if (e.target.value !== item.label) {
                  run(() => updateNavItemAction(item.id, { label: e.target.value }));
                }
              }}
              className="adm-input w-32"
            />
            <input
              defaultValue={item.url}
              maxLength={500}
              aria-label="Link address"
              onBlur={(e) => {
                if (e.target.value !== item.url) {
                  run(() => updateNavItemAction(item.id, { url: e.target.value }));
                }
              }}
              className="adm-input flex-1 min-w-0"
            />
            <button
              onClick={() => run(() => updateNavItemAction(item.id, { is_visible: !item.is_visible }))}
              title={item.is_visible ? 'Visible — click to hide' : 'Hidden — click to show'}
              className={`adm-icon-btn ${item.is_visible ? 'text-emerald-600' : 'text-slate-300'}`}
            >
              {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button
              onClick={() => run(() => updateNavItemAction(item.id, { opens_in_new_tab: !item.opens_in_new_tab }))}
              title="Open in new tab"
              className={`adm-icon-btn ${item.opens_in_new_tab ? 'text-indigo-600' : ''}`}
            >
              <ExternalLink size={15} />
            </button>
            <button
              onClick={() => run(() => moveNavItemAction(item.id, -1))}
              disabled={index === 0 || pending}
              className="adm-icon-btn"
              aria-label="Move up"
            >
              <ArrowUp size={15} />
            </button>
            <button
              onClick={() => run(() => moveNavItemAction(item.id, 1))}
              disabled={index === roots.length - 1 || pending}
              className="adm-icon-btn"
              aria-label="Move down"
            >
              <ArrowDown size={15} />
            </button>
            <button
              onClick={() => run(() => deleteNavItemAction(item.id))}
              disabled={pending}
              className="adm-icon-btn adm-icon-btn-danger"
              aria-label="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim() || !url.trim()) return;
          run(async () => {
            const res = await createNavItemAction(location, label, url);
            if (!res.error) {
              setLabel('');
              setUrl('');
            }
            return res;
          });
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="New link name"
          maxLength={100}
          className="adm-input sm:w-40"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/page-address or #section"
          maxLength={500}
          className="adm-input flex-1 min-w-0"
        />
        <button type="submit" disabled={pending} className="adm-btn adm-btn-primary whitespace-nowrap">
          <Plus size={14} /> Add
        </button>
      </form>

      {result?.error && (
        <p role="alert" className="adm-alert-error mt-3 inline-block">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p role="status" className="adm-alert-success mt-3 inline-flex items-center gap-1.5">
          <Check size={13} /> {result.success}
        </p>
      )}
    </div>
  );
}

export default function MenuLinksManager({ items }: { items: NavigationItem[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <LocationManager location="header" items={items.filter((i) => i.location === 'header')} />
      <LocationManager location="footer" items={items.filter((i) => i.location === 'footer')} />
    </div>
  );
}
