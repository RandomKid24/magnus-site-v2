import SiteShell from '@/components/site/SiteShell';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';

export const LEGAL_UPDATED = '26 October 2026';

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-space text-xl font-bold text-white tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 font-sans text-sm text-gray-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-lime [&_a]:underline">
        {children}
      </div>
    </section>
  );
}

/** Shared shell for static legal pages (privacy, terms) using the site header/footer. */
export default async function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation('header'),
    getNavigation('footer'),
  ]);

  return (
    <SiteShell
      sections={null}
      navItems={{ header: headerNav, footer: footerNav }}
      settings={settings}
      override={
        <main className="pt-40 pb-20 px-[5%] bg-black">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
                Legal
              </span>
            </div>
            <h1 className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase mb-4">
              {title}
            </h1>
            <p className="font-sans text-xs text-gray-500 mb-12">Last updated: {LEGAL_UPDATED}</p>
            {children}
          </div>
        </main>
      }
    />
  );
}
