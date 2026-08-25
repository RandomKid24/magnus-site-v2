'use client';

import React from 'react';
import { ScrollProgress, ScrollToTop } from '@/components/ui/Shared';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Products from '@/components/sections/Products';
import USPs from '@/components/sections/USPs';
import Customers from '@/components/sections/Customers';
import Services from '@/components/sections/Services';
import Industries from '@/components/sections/Industries';
import Fleet from '@/components/sections/Fleet';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import Quality from '@/components/sections/Quality';
import Contact from '@/components/sections/Contact';
import { SectionRenderer, type RenderableSection } from '@/components/cms/blocks';
import type { PublicNavigationItem } from '@/lib/cms/navigation';
import type { SiteSettings } from '@/lib/cms/settings';

export interface SiteShellProps {
  /** CMS-driven sections; when null the original hardcoded layout renders. */
  sections: RenderableSection[] | null;
  navItems: {
    header: PublicNavigationItem[] | null;
    footer: PublicNavigationItem[] | null;
  };
  settings: SiteSettings;
  /** Replaces the section content entirely (e.g. blog listing/post pages). */
  override?: React.ReactNode;
}

/**
 * Client orchestrator for public pages. Owns scroll/navigation state shared by
 * Navbar, Hero and Footer, and switches between CMS-driven blocks and the
 * original hardcoded section stack (used until a "home" page is published).
 */
export default function SiteShell({ sections, navItems, settings, override }: SiteShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const scrollToId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const rendererContext = React.useMemo(
    () => ({ scrollToId, contact: settings.contact }),
    [settings.contact]
  );

  return (
    <div className="bg-zinc-950 text-white min-h-screen scroll-smooth">
      <ScrollProgress />

      <Navbar
        scrollToId={scrollToId}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        items={navItems.header ?? undefined}
      />

      {override ? (
        override
      ) : sections === null ? (
        <>
          {/* Legacy hardcoded homepage — rendered until a CMS "home" page exists */}
          <Hero scrollToId={scrollToId} />
          <Features />
          <Products />
          <USPs />
          <Customers />
          <Services />
          <Industries />
          <Fleet />
          <Gallery />
          <About />
          <Quality />
          <Contact contact={settings.contact} />
        </>
      ) : (
        <main>
          <SectionRenderer sections={sections} context={rendererContext} />
        </main>
      )}

      <Footer scrollToId={scrollToId} items={navItems.footer ?? undefined} settings={settings} />

      <ScrollToTop />
    </div>
  );
}
