import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSectionsByPageId, getSeoForPage } from '@/lib/cms/pages';
import { listMedia } from '@/lib/cms/media';
import { getSiteSettings } from '@/lib/cms/settings';
import PageEditor from './PageEditor';
import MenuLinksManager from '@/components/admin/MenuLinksManager';
import SeoForm from '@/components/admin/SeoForm';
import {
  ContactCard,
  SocialLinksCard,
  BrandingCard,
} from '@/components/admin/SiteDetailsCards';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import type { NavigationItem } from '@/lib/cms/types';

export const metadata = {
  title: 'Website Content | Magnus CMS',
};

export default async function AdminContentPage() {
  const user = await requireRole('admin', 'editor');

  let home = null;
  let sections: Awaited<ReturnType<typeof getSectionsByPageId>> = [];
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let navItems: NavigationItem[] = [];
  let seo: Awaited<ReturnType<typeof getSeoForPage>> | null = null;
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  let loadError: string | null = null;

  try {
    // Look the home page up by slug — this is THE single editable page.
    const supabase = await createSupabaseServerClient();
    const { data: found, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .maybeSingle();
    if (error) throw new Error(error.message);
    home = found ?? null;

    if (home) {
      [sections, media, settings] = await Promise.all([
        getSectionsByPageId(home.id),
        listMedia(),
        getSiteSettings(),
      ]);
      seo = await getSeoForPage(home.id).catch(() => null);
    }

    const { data: nav, error: navError } = await supabase
      .from('navigation_items')
      .select('*')
      .order('position', { ascending: true });
    if (navError) throw new Error(navError.message);
    navItems = (nav ?? []) as NavigationItem[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load website content.';
  }

  if (loadError) {
    return (
      <div>
        <AdminPageHeader title="Website Content" />
        <div className="adm-card p-6">
          <p className="adm-alert-error">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!home || !settings) {
    return (
      <div>
        <AdminPageHeader
          title="Website Content"
          subtitle="Edit every part of your homepage"
        />
        <div className="adm-card p-10 text-center">
          <AlertTriangle size={28} className="mx-auto text-amber-400 mb-4" />
          <h2 className="adm-title text-lg mb-2">No “Home” page exists yet</h2>
          <p className="adm-hint max-w-md mx-auto mb-6 leading-relaxed">
            The website content lives on a page with the address <code className="text-indigo-600">home</code>.
            Run <code className="text-indigo-600 font-semibold">npx tsx scripts/seed-home.ts</code> once to
            create it pre-filled with your current website.
          </p>
          <Link href="/admin/login" className="adm-btn adm-btn-primary">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <AdminPageHeader
        title={`Welcome back${user.fullName ? `, ${user.fullName}` : ''}`}
        subtitle="Everything below is your live website — edit and press Save"
      />

      {/* Sections editor + live preview */}
      <PageEditor
        pageId={home.id}
        initialTitle={home.title}
        initialSlug={home.slug}
        initialStatus={home.status}
        initialSections={sections.map((s) => ({
          key: s.id,
          type: s.type,
          data: s.data ?? {},
        }))}
        mediaItems={media}
      />

      {/* Site details cards */}
      <div>
        <h2 className="adm-label mb-3">Website Details</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          <ContactCard initial={settings.contact} />
          <SocialLinksCard initial={settings.social} />
          <BrandingCard initial={settings.identity} />
        </div>
      </div>

      {/* Menu links */}
      <div>
        <h2 className="adm-label mb-3">Menu Links</h2>
        <MenuLinksManager items={navItems} />
      </div>

      {/* Google listing */}
      <details className="adm-card overflow-hidden group">
        <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <span>
            <span className="adm-title text-base">Google Listing</span>
            <span className="adm-hint block mt-0.5">
              How your homepage appears in search results — optional, sensible defaults apply.
            </span>
          </span>
          <span className="text-xs font-bold text-indigo-500 group-open:hidden">Show</span>
          <span className="hidden text-xs font-bold text-indigo-500 group-open:inline">Hide</span>
        </summary>
        <div className="p-5 border-t border-slate-100">
          <SeoForm pageId={home.id} pageSlug={home.slug} initial={seo} />
        </div>
      </details>
    </div>
  );
}
