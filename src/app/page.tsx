import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import type { RenderableSection } from '@/components/cms/blocks';
import { getPublishedPageBySlug, getPublishedSections, getPublicSeoForPage } from '@/lib/cms/pages';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-url';

// Public pages render fresh data on every request so saved CMS changes appear
// immediately — no need to save twice or wait for a cache refresh.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const home = await getPublishedPageBySlug('home');
    if (!home) return {};
    const seo = await getPublicSeoForPage(home.id);
    const title = seo?.title || (home.title.trim().toLowerCase() === 'home' ? undefined : home.title);
    return {
      title: title ?? { absolute: 'Magnus Enterprises | CNC Machining & Switchgear Assembly in Nashik' },
      description: seo?.description || SITE_DESCRIPTION,
      alternates: { canonical: seo?.canonical_url || '/' },
      openGraph: {
        title: seo?.og_title || title || SITE_NAME,
        description: seo?.og_description || seo?.description || SITE_DESCRIPTION,
        images: [seo?.og_image_url || '/logo.png'],
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

  const { contact, identity, social } = settings;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${identity.name} ${identity.suffix}`.trim(),
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: identity.logo_url.startsWith('http') ? identity.logo_url : `${SITE_URL}${identity.logo_url}`,
    telephone: contact.phone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressLocality: 'Nashik',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    ...(Object.values(social).some(Boolean) && { sameAs: Object.values(social).filter(Boolean) }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteShell
        sections={sections}
        navItems={{ header: headerNav, footer: footerNav }}
        settings={settings}
      />
    </>
  );
}
