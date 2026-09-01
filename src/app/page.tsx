import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import type { RenderableSection } from '@/components/cms/blocks';
import { getPublishedPageBySlug, getPublishedSections, getPublicSeoForPage } from '@/lib/cms/pages';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';

// Public pages render fresh data on every request so saved CMS changes appear
// immediately — no need to save twice or wait for a cache refresh.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const home = await getPublishedPageBySlug('home');
    if (!home) return {};
    const seo = await getPublicSeoForPage(home.id);
    const title = seo?.title || home.title;
    return {
      title,
      description: seo?.description || undefined,
      alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
      openGraph: {
        title: seo?.og_title || title,
        description: seo?.og_description || seo?.description || undefined,
        images: seo?.og_image_url ? [seo.og_image_url] : undefined,
      },
      robots:
        seo?.no_index || seo?.no_follow
          ? { index: !seo?.no_index, follow: !seo?.no_follow }
          : undefined,
    };
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation('header'),
    getNavigation('footer'),
  ]);

  let sections: RenderableSection[] | null = null;
  try {
    const home = await getPublishedPageBySlug('home');
    if (home) {
      const rows = await getPublishedSections(home.id);
      // Empty published page falls back to the original hardcoded layout so
      // the site can never go blank by accident.
      if (rows.length > 0) sections = rows;
    }
  } catch {
    sections = null;
  }

  return (
    <SiteShell
      sections={sections}
      navItems={{ header: headerNav, footer: footerNav }}
      settings={settings}
    />
  );
}
