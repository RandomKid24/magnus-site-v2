import 'server-only';
import { createSupabasePublicClient } from '@/lib/supabase/public';

export interface SiteSettings {
  identity: {
    name: string;
    suffix: string;
    tagline: string;
    logo_url: string;
    footer_blurb: string;
    certification_label: string;
  };
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

const FALLBACK_SETTINGS: SiteSettings = {
  identity: {
    name: 'Magnus',
    suffix: 'Enterprises',
    tagline: 'Engineering for the Micron Absolute',
    logo_url: '/logo.png',
    footer_blurb:
      'ISO 9001:2015 Certified Precision Machining & Switchgear Assembly Facility. Nashik, India.',
    certification_label: 'QMS CERTIFIED',
  },
  contact: {
    address: 'Survey No. 107/2, Near Datir Mala, Ambad Gaon, Ambad, Nashik – 422010',
    email: 'magnusenterprises20@gmail.com',
    phone: '+91 77200 46700',
  },
  social: {},
};

/**
 * Loads site settings from the CMS. Returns hardcoded defaults when the CMS is
 * unreachable or a key is missing, so the public site never breaks.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_identity', 'contact', 'social']);

    if (error || !data) return FALLBACK_SETTINGS;

    const map = new Map(data.map((row) => [row.key, row.value]));

    const identity = (map.get('site_identity') ?? {}) as Partial<SiteSettings['identity']>;
    const contact = (map.get('contact') ?? {}) as Partial<SiteSettings['contact']>;
    const social = (map.get('social') ?? {}) as Partial<SiteSettings['social']>;

    return {
      identity: { ...FALLBACK_SETTINGS.identity, ...identity },
      contact: { ...FALLBACK_SETTINGS.contact, ...contact },
      social: { ...FALLBACK_SETTINGS.social, ...social },
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}
