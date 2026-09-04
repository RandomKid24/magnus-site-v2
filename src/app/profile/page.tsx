import type { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';
import { getSiteSettings } from '@/lib/cms/settings';
import { getBusinessProfile } from '@/lib/profile/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const name = `${settings.identity.name} ${settings.identity.suffix}`.trim();
    return {
      title: `${name} | Business Profile`,
      description: `${settings.identity.tagline}. Precision machining & industrial solutions — ${settings.contact.address}`,
    };
  } catch {
    return {
      title: 'Magnus Enterprises | Business Profile',
    };
  }
}

/**
 * Standalone profile card — no site Navbar/Footer so `/` stays unchanged and
 * the page matches the reference phone-width layout.
 */
export default async function ProfileRoutePage() {
  const settings = await getSiteSettings();
  const profile = await getBusinessProfile(settings);
  return <ProfilePage profile={profile} />;
}
