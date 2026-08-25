import { z } from 'zod';

/**
 * Zod schemas for every block type. These validate the JSONB `data` column at
 * render time: malformed or missing content degrades to safe fallbacks instead
 * of crashing the page.
 */

const shortText = z.string().max(300);
const mediumText = z.string().max(2000);
const safeUrl = z
  .string()
  .max(1000)
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v) || v.startsWith('#') || v.startsWith('mailto:') || v.startsWith('tel:'),
    { message: 'URL must be a path, #anchor, mailto:, tel: or https:// link' }
  );

// ---------------------------------------------------------------------------
// hero
// ---------------------------------------------------------------------------
export const heroSchema = z.object({
  tagline: shortText,
  button_text: shortText,
  button_target: safeUrl,
});
export type HeroData = z.infer<typeof heroSchema>;

// ---------------------------------------------------------------------------
// features ("Why Choose Us" bento grid)
// ---------------------------------------------------------------------------
export const featureItemSchema = z.object({
  title: shortText,
  description: mediumText,
});
export const featuresSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  items: z.array(featureItemSchema).min(1).max(12),
});
export type FeaturesData = z.infer<typeof featuresSchema>;

// ---------------------------------------------------------------------------
// products (image portfolio grid)
// ---------------------------------------------------------------------------
export const productItemSchema = z.object({
  title: shortText,
  image_url: safeUrl,
});
export const productsSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  quote: shortText,
  items: z.array(productItemSchema).min(1).max(64),
});
export type ProductsData = z.infer<typeof productsSchema>;

// ---------------------------------------------------------------------------
// usps
// ---------------------------------------------------------------------------
export const uspItemSchema = z.object({
  title: shortText,
  description: mediumText,
});
export const uspsSchema = z.object({
  title_plain: shortText,
  title_accent: shortText,
  intro: mediumText,
  items: z.array(uspItemSchema).min(1).max(24),
});
export type UspsData = z.infer<typeof uspsSchema>;

// ---------------------------------------------------------------------------
// customers
// ---------------------------------------------------------------------------
export const customersSchema = z.object({
  title_plain: shortText,
  title_accent: shortText,
  subtitle: mediumText,
  items: z.array(shortText).min(1).max(24),
});
export type CustomersData = z.infer<typeof customersSchema>;

// ---------------------------------------------------------------------------
// services
// ---------------------------------------------------------------------------
export const serviceItemSchema = z.object({
  title: shortText,
  icon: z.string().max(60),
  points: z.array(z.string().max(200)).max(12),
});
export const servicesSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  items: z.array(serviceItemSchema).min(1).max(36),
});
export type ServicesData = z.infer<typeof servicesSchema>;

// ---------------------------------------------------------------------------
// industries
// ---------------------------------------------------------------------------
export const industriesSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  intro: mediumText,
  items: z.array(shortText).min(1).max(10),
});
export type IndustriesData = z.infer<typeof industriesSchema>;

// ---------------------------------------------------------------------------
// fleet
// ---------------------------------------------------------------------------
export const specRowSchema = z.object({
  machine_class: shortText,
  specification: shortText,
  application: shortText,
});
export const fleetSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  note: mediumText,
  machines: z.array(shortText).min(1).max(18),
  spec_rows: z.array(specRowSchema).max(20),
});
export type FleetData = z.infer<typeof fleetSchema>;

// ---------------------------------------------------------------------------
// gallery
// ---------------------------------------------------------------------------
export const galleryImageSchema = z.object({
  url: safeUrl,
  title: shortText,
  category: shortText,
});
export const gallerySchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
  note: shortText,
  images: z.array(galleryImageSchema).min(1).max(24),
});
export type GalleryData = z.infer<typeof gallerySchema>;

// ---------------------------------------------------------------------------
// about
// ---------------------------------------------------------------------------
export const pillarSchema = z.object({
  title: shortText,
  description: mediumText,
  icon: z.string().max(60),
});
export const aboutSchema = z.object({
  established_label: shortText,
  title_plain: shortText,
  title_accent: shortText,
  title_suffix: shortText,
  side_note: shortText,
  narrative_lead: mediumText,
  narrative_body: mediumText,
  pillars: z.array(pillarSchema).min(1).max(6),
  image_url: safeUrl,
});
export type AboutData = z.infer<typeof aboutSchema>;

// ---------------------------------------------------------------------------
// quality
// ---------------------------------------------------------------------------
export const qualitySchema = z.object({
  quote_plain: mediumText,
  quote_accent: shortText,
  certification: shortText,
  certification_sub: shortText,
  checklist: z.array(shortText).max(8),
});
export type QualityData = z.infer<typeof qualitySchema>;

// ---------------------------------------------------------------------------
// contact
// ---------------------------------------------------------------------------
export const contactSchema = z.object({
  eyebrow: shortText,
  title_plain: shortText,
  title_accent: shortText,
});
export type ContactData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// text — generic rich-ish text section
// ---------------------------------------------------------------------------
export const textSchema = z.object({
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  body: z.string().max(8000),
  align: z.enum(['left', 'center']).default('left'),
});
export type TextData = z.infer<typeof textSchema>;

// ---------------------------------------------------------------------------
// image — single image display
// ---------------------------------------------------------------------------
export const imageSchema = z.object({
  url: safeUrl,
  alt: shortText,
  caption: shortText.optional(),
  full_width: z.boolean().default(false),
});
export type ImageData = z.infer<typeof imageSchema>;

// ---------------------------------------------------------------------------
// pricing
// ---------------------------------------------------------------------------
export const pricingTierSchema = z.object({
  name: shortText,
  price: shortText,
  period: shortText,
  description: mediumText,
  features: z.array(shortText).max(10),
  highlighted: z.boolean().default(false),
  button_text: shortText,
  button_url: safeUrl,
});
export const pricingSchema = z.object({
  eyebrow: shortText.optional(),
  heading: shortText,
  tiers: z.array(pricingTierSchema).min(1).max(4),
});
export type PricingData = z.infer<typeof pricingSchema>;

// ---------------------------------------------------------------------------
// testimonials
// ---------------------------------------------------------------------------
export const testimonialSchema = z.object({
  quote: mediumText,
  author: shortText,
  role: shortText.optional(),
});
export const testimonialsSchema = z.object({
  eyebrow: shortText.optional(),
  heading: shortText,
  items: z.array(testimonialSchema).min(1).max(9),
});
export type TestimonialsData = z.infer<typeof testimonialsSchema>;

// ---------------------------------------------------------------------------
// faq
// ---------------------------------------------------------------------------
export const faqItemSchema = z.object({
  question: shortText,
  answer: mediumText,
});
export const faqSchema = z.object({
  eyebrow: shortText.optional(),
  heading: shortText,
  items: z.array(faqItemSchema).min(1).max(20),
});
export type FaqData = z.infer<typeof faqSchema>;

// ---------------------------------------------------------------------------
// cta
// ---------------------------------------------------------------------------
export const ctaSchema = z.object({
  heading: shortText,
  subheading: mediumText.optional(),
  button_text: shortText,
  button_url: safeUrl,
  secondary_button_text: shortText.optional(),
  secondary_button_url: safeUrl.optional(),
});
export type CtaData = z.infer<typeof ctaSchema>;

// ---------------------------------------------------------------------------
// custom — free-form JSONB rendered as key/value details (safe fallback)
// ---------------------------------------------------------------------------
export const customSchema = z.object({
  heading: shortText.optional(),
  body: z.string().max(8000).optional(),
  entries: z.array(z.object({ label: shortText, value: shortText })).max(30),
});
export type CustomData = z.infer<typeof customSchema>;

// ---------------------------------------------------------------------------
// Registry of schemas — unknown block types fall back to `custom`.
// ---------------------------------------------------------------------------
export const BLOCK_SCHEMAS: Record<string, z.ZodTypeAny> = {
  hero: heroSchema,
  features: featuresSchema,
  products: productsSchema,
  usps: uspsSchema,
  customers: customersSchema,
  services: servicesSchema,
  industries: industriesSchema,
  fleet: fleetSchema,
  gallery: gallerySchema,
  about: aboutSchema,
  quality: qualitySchema,
  contact: contactSchema,
  text: textSchema,
  image: imageSchema,
  pricing: pricingSchema,
  testimonials: testimonialsSchema,
  faq: faqSchema,
  cta: ctaSchema,
  custom: customSchema,
};

/** Validates raw JSONB block data; returns undefined when invalid. */
export function parseBlockData<T = Record<string, unknown>>(
  type: string,
  data: unknown
): T | undefined {
  const schema = BLOCK_SCHEMAS[type];
  if (!schema) return undefined;
  const result = schema.safeParse(data);
  return result.success ? (result.data as T) : undefined;
}
