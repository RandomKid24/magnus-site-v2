import { getSiteSettings } from '@/lib/cms/settings';
import { services, industries } from '@/constants';
import { SITE_URL, SITE_DESCRIPTION } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

/** Plain-text summary for AI assistants. Contact details come live from Site Settings. */
export async function GET() {
  const { identity, contact } = await getSiteSettings();
  const name = `${identity.name} ${identity.suffix}`.trim();

  const body = `# ${name}

> ${SITE_DESCRIPTION}

## Services
${services.map((s) => `- ${s.title}`).join('\n')}

## Industries served
${industries.map((i) => `- ${i}`).join('\n')}

## Contact
- Address: ${contact.address}
- Phone: ${contact.phone}
- Email: ${contact.email}
- To request a quote, send a drawing and requirements by WhatsApp, email or the enquiry form on the website.

## Pages
- [Home](${SITE_URL}/)
- [Business profile](${SITE_URL}/profile)
- [Privacy policy](${SITE_URL}/privacy-policy)
- [Terms and conditions](${SITE_URL}/terms)
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
