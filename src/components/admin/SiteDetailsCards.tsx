'use client';

import { useState, useTransition } from 'react';
import { Check, Save } from 'lucide-react';
import {
  saveContactDetailsAction,
  saveSocialLinksAction,
  saveBrandingAction,
  type SiteDetailsState,
} from '@/app/admin/(dashboard)/content/site-details-actions';
import type { SiteSettings } from '@/lib/cms/settings';

function CardShell({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="adm-card p-5 space-y-4">
      <div>
        <h3 className="adm-title text-base">{title}</h3>
        <p className="adm-hint">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function SaveRow({ state, pending, label }: { state: SiteDetailsState | null; pending: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <button type="submit" disabled={pending} className="adm-btn adm-btn-primary !py-1.5 !px-4 text-[11px]">
        <Save size={13} />
        {pending ? 'Saving…' : label}
      </button>
      {state?.error && (
        <span role="alert" className="adm-alert-error inline-block">
          {state.error}
        </span>
      )}
      {state?.success && (
        <span role="status" className="adm-alert-success inline-flex items-center gap-1.5">
          <Check size={12} /> {state.success}
        </span>
      )}
    </div>
  );
}

export function ContactCard({ initial }: { initial: SiteSettings['contact'] }) {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<SiteDetailsState | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <CardShell
      title="Contact Details"
      hint="Shown in the contact section and footer of your website."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(null);
          startTransition(async () => setResult(await saveContactDetailsAction(form)));
        }}
        className="space-y-3"
      >
        <div>
          <label className="adm-label">Address</label>
          <textarea
            value={form.address}
            rows={2}
            maxLength={500}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="adm-input resize-y"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="adm-label">Email</label>
            <input
              type="email"
              value={form.email}
              maxLength={200}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="adm-input"
            />
          </div>
          <div>
            <label className="adm-label">Phone</label>
            <input
              value={form.phone}
              maxLength={50}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="adm-input"
            />
          </div>
        </div>
        <SaveRow state={result} pending={pending} label="Save Contact Info" />
      </form>
    </CardShell>
  );
}

export function SocialLinksCard({ initial }: { initial: SiteSettings['social'] }) {
  const [form, setForm] = useState({
    linkedin: initial.linkedin ?? '',
    twitter: initial.twitter ?? '',
    facebook: initial.facebook ?? '',
  });
  const [result, setResult] = useState<SiteDetailsState | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <CardShell
      title="Social Links"
      hint="Leave a box empty to hide that icon from your website."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(null);
          startTransition(async () => setResult(await saveSocialLinksAction(form)));
        }}
        className="space-y-3"
      >
        {(['linkedin', 'twitter', 'facebook'] as const).map((key) => (
          <div key={key}>
            <label className="adm-label capitalize">{key}</label>
            <input
              value={form[key]}
              maxLength={500}
              placeholder={`https://${key}.com/…`}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="adm-input"
            />
          </div>
        ))}
        <SaveRow state={result} pending={pending} label="Save Social Links" />
      </form>
    </CardShell>
  );
}

export function BrandingCard({ initial }: { initial: SiteSettings['identity'] }) {
  const [form, setForm] = useState({
    tagline: initial.tagline,
    logo_url: initial.logo_url,
    footer_blurb: initial.footer_blurb,
    certification_label: initial.certification_label,
  });
  const [result, setResult] = useState<SiteDetailsState | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <CardShell
      title="Branding"
      hint="Tagline, logo and small texts shown around the site. Company name stays fixed."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(null);
          startTransition(async () => setResult(await saveBrandingAction(form)));
        }}
        className="space-y-3"
      >
        <div>
          <label className="adm-label">Tagline</label>
          <input
            value={form.tagline}
            maxLength={300}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="adm-input"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="adm-label">Logo URL</label>
            <input
              value={form.logo_url}
              maxLength={1000}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="adm-input"
            />
          </div>
          <div>
            <label className="adm-label">Certification Label</label>
            <input
              value={form.certification_label}
              maxLength={100}
              onChange={(e) => setForm({ ...form, certification_label: e.target.value })}
              className="adm-input"
            />
          </div>
        </div>
        <div>
          <label className="adm-label">Footer Text</label>
          <textarea
            value={form.footer_blurb}
            rows={2}
            maxLength={500}
            onChange={(e) => setForm({ ...form, footer_blurb: e.target.value })}
            className="adm-input resize-y"
          />
        </div>
        <SaveRow state={result} pending={pending} label="Save Branding" />
      </form>
    </CardShell>
  );
}
