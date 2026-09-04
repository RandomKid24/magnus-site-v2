import 'server-only';
import { products, services, whyChooseUs } from '@/constants';
import type { SiteSettings } from '@/lib/cms/settings';
import { getProfileViews } from '@/lib/profile/views';

/** Profile-only legal / about-table fields (edit here until CMS-backed). */
const PROFILE_ABOUT = {
  natureOfBusiness: 'Manufacturer and Service Provider',
  gstNumber: 'Available on request',
  gstRegistration: '—',
  contactPerson: 'Available on request',
} as const;

const HOW_WE_WORK = [
  {
    title: '1. Share Drawing',
    description: 'Send via WhatsApp, email, or our enquiry form.',
  },
  {
    title: '2. Get Quote',
    description: 'We review your requirement and respond with scope and pricing.',
  },
  {
    title: '3. Manufacturing',
    description:
      'Precision machining and component manufacture as per agreed drawings and schedule.',
  },
  {
    title: '4. Delivery',
    description: 'Inspection, packing, and dispatch to your location.',
  },
] as const;

export interface ProfileServiceItem {
  title: string;
  description: string;
}

export interface ProfileGalleryItem {
  url: string;
  title: string;
}

export interface ProfileHowWeWorkStep {
  title: string;
  description: string;
}

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  logoUrl: string;
  locationLine: string;
  address: string;
  phone: string;
  email: string;
  natureOfBusiness: string;
  gstNumber: string;
  gstRegistration: string;
  contactPerson: string;
  specialities: string[];
  narrative: string;
  services: ProfileServiceItem[];
  howWeWork: ProfileHowWeWorkStep[];
  gallery: ProfileGalleryItem[];
  views: number;
}

function shortServiceDescription(points: string[]): string {
  const first = points.find((p) => p.trim().length > 0) ?? '';
  if (first.length <= 120) return first;
  return `${first.slice(0, 117)}…`;
}

function locationFromAddress(address: string): string {
  const parts = address
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return parts.slice(-2).join(', ');
  }
  return address;
}

/**
 * Assembles the public `/profile` payload from site settings + hardcoded
 * Magnus content fallbacks. Never throws — callers always get a full profile.
 */
export async function getBusinessProfile(
  settings: SiteSettings
): Promise<BusinessProfile> {
  const { identity, contact } = settings;
  const businessName = `${identity.name} ${identity.suffix}`.trim();
  const views = await getProfileViews();

  return {
    businessName,
    tagline: identity.tagline,
    logoUrl: identity.logo_url,
    locationLine: locationFromAddress(contact.address),
    address: contact.address,
    phone: contact.phone,
    email: contact.email,
    natureOfBusiness: PROFILE_ABOUT.natureOfBusiness,
    gstNumber: PROFILE_ABOUT.gstNumber,
    gstRegistration: PROFILE_ABOUT.gstRegistration,
    contactPerson: PROFILE_ABOUT.contactPerson,
    specialities: [...whyChooseUs],
    narrative: `${businessName} is a high-precision manufacturing hub dedicated to the electrical, switchgear, and heavy engineering sectors (GST ${PROFILE_ABOUT.gstNumber}). Based in ${contact.address}, we supply CNC machining, VMC milling, fabrication, and switchgear assembly for power, automobile, agriculture, and related industries. Share your drawing via WhatsApp, email, or the enquiry form — we review scope, quote, manufacture to agreed drawings, then inspect, pack, and dispatch.`,
    services: services.map((s) => ({
      title: s.title,
      description: shortServiceDescription(s.description),
    })),
    howWeWork: HOW_WE_WORK.map((s) => ({ ...s })),
    gallery: products.slice(0, 12).map((p) => ({
      url: p.image,
      title: p.title,
    })),
    views,
  };
}
