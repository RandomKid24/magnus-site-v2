import type { Metadata } from 'next';
import LegalPage, { Section } from '@/components/legal/LegalPage';
import { getSiteSettings } from '@/lib/cms/settings';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Magnus Enterprises',
  description: 'Terms of use and disclaimer for the Magnus Enterprises website.',
};

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const { contact } = await getSiteSettings();

  return (
    <LegalPage title="Terms & Conditions">
      <Section title="1. About these terms">
        <p>
          By using this website you agree to these terms. The website is operated by Magnus
          Enterprises, {contact.address}. If you do not agree, please do not use the site.
        </p>
      </Section>

      <Section title="2. Website purpose and no online sales">
        <p>
          This website presents our machining, fabrication and assembly capabilities and lets you
          send us enquiries. It is not an online store: nothing here is a binding offer, and no
          payment is taken on the site.
        </p>
      </Section>

      <Section title="3. Quotations and orders">
        <p>
          Quotations, prices, lead times and specifications are given only in writing after we
          review your drawings and requirements, and are valid for the period stated in the
          quotation. A contract is formed only when we confirm an order in writing. Detailed terms
          of supply (payment, delivery, inspection, warranty) are set out in that quotation or order confirmation.
        </p>
      </Section>

      <Section title="4. Information on this site">
        <p>
          Machine specifications, capacities, tolerances, certifications and images on this site
          are provided for general information and may change without notice. We try to keep
          them accurate but do not warrant that they are complete or current; confirm anything
          critical with us before relying on it. Product and client names and logos belong to
          their respective owners and are shown for identification only.
        </p>
      </Section>

      <Section title="5. Your submissions">
        <p>
          Content you send us (including drawings and designs) remains yours. You confirm that you
          have the right to share it and that it does not infringe anyone else&rsquo;s rights. We
          will use it only to respond to your enquiry and will treat it as confidential, as
          described in our <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p>
          You agree not to misuse the site, attempt unauthorised access to it or its admin areas,
          introduce malicious code, or send unlawful or abusive content.
        </p>
      </Section>

      <Section title="7. Intellectual property">
        <p>
          The text, design, logo, images and other content of this website belong to Magnus
          Enterprises or its licensors. You may view and share pages for personal or business
          reference, but may not copy or reuse the content commercially without written permission.
        </p>
      </Section>

      <Section title="8. Disclaimer and limitation of liability">
        <p>
          The website is provided &ldquo;as is&rdquo;. To the extent permitted by law, we are not
          liable for any indirect or consequential loss arising from use of, or inability to use,
          the site, or from links to third-party sites we do not control. Nothing here limits
          liability that cannot be excluded by law.
        </p>
      </Section>

      <Section title="9. Governing law">
        <p>
          These terms are governed by the laws of India. Courts at Nashik, Maharashtra have
          exclusive jurisdiction, subject to any different terms agreed in a written order.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these terms: <a href={`mailto:${contact.email}`}>{contact.email}</a> or {contact.phone}.
        </p>
      </Section>
    </LegalPage>
  );
}
