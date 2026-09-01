import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import type { RenderableSection } from '@/components/cms/blocks';
import {
  getPublishedPageBySlug,
  getPublishedSections,
  getPublicSeoForPage,
} from '@/lib/cms/pages';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';

// These routes render fresh data on every request so saved CMS changes appear
// immediately — no need to save twice or wait for a cache refresh.
export const dynamic = 'force-dynamic';

const RESERVED_SLUGS = new Set(['admin', 'api', 'blog', 'preview', 'static', '_next']);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};

  try {
    const page = await getPublishedPageBySlug(slug);
    if (!page) return {};

    const seo = await getPublicSeoForPage(page.id);
    const title = seo?.title || page.title;

    const metadata: Metadata = {
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
    return metadata;
  } catch {
    return {};
  }
}

export default async function CmsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();

  let sections: RenderableSection[] | null = null;
  try {
    const page = await getPublishedPageBySlug(slug);
    if (page && page.slug !== 'home') {
      const rows = await getPublishedSections(page.id);
      if (rows.length > 0) sections = rows;
    }
  } catch {
    sections = null;
  }

  if (!sections) notFound();

  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation('header'),
    getNavigation('footer'),
  ]);

  return (
    <SiteShell
      sections={sections}
      navItems={{ header: headerNav, footer: footerNav }}
      settings={settings}
    />
  );
}
