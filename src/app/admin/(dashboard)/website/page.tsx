import { requireRole } from '@/lib/auth';
import { getSiteSettings } from '@/lib/cms/settings';
import {
  ContactCard,
  SocialLinksCard,
  BrandingCard,
} from '@/components/admin/SiteDetailsCards';
import { AdminPageHeader } from '@/components/admin/AdminUI';

export const metadata = {
  title: 'Website Details | Magnus CMS',
};

export default async function AdminWebsitePage() {
  await requireRole('admin');

  const settings = await getSiteSettings();

  return (
    <div className="space-y-8 pb-24">
      <AdminPageHeader
        title="Website Details"
        subtitle="Contact information, social links and branding shown across your website."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <ContactCard initial={settings.contact} />
        <SocialLinksCard initial={settings.social} />
        <BrandingCard initial={settings.identity} />
      </div>
    </div>
  );
}
