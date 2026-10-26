import type { Metadata } from 'next';
import LegalPage, { Section } from '@/components/legal/LegalPage';
import { getSiteSettings } from '@/lib/cms/settings';

export const metadata: Metadata = {
  title: 'Privacy Policy | Magnus Enterprises',
  description: 'How Magnus Enterprises collects, uses and protects personal data.',
};

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  const { contact } = await getSiteSettings();

  return (
    <LegalPage title="Privacy Policy">
      <Section title="1. Who we are">
        <p>
          This website is operated by Magnus Enterprises, {contact.address} (&ldquo;Magnus&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are a precision machining and switchgear
          assembly business. This policy explains how we handle personal data in line with the
          Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <ul>
          <li>
            <strong className="text-white">Enquiry details</strong> &ndash; if you contact us
            through our enquiry, contact or feedback forms: your name, email address, phone number, the service
            you are interested in, your message, and any feedback rating you give.
          </li>
          <li>
            <strong className="text-white">Direct communication</strong> &ndash; anything you send
            us by email, phone or WhatsApp, including drawings and specifications.
          </li>
          <li>
            <strong className="text-white">Technical data</strong> &ndash; like most websites, our
            hosting providers may process your IP address and browser details in server logs to
            deliver the site and keep it secure. We keep an anonymous count of business-profile
            page visits; it is not linked to you.
          </li>
        </ul>
        <p>We do not knowingly collect data from children, and we do not collect payment details on this website.</p>
      </Section>

      <Section title="3. How we use it">
        <ul>
          <li>To respond to your enquiry and prepare quotations.</li>
          <li>To deliver orders, and for invoicing, accounting and tax records.</li>
          <li>To keep the website secure and working.</li>
          <li>To meet legal obligations.</li>
        </ul>
        <p>We do not sell your data and we do not use it for third-party advertising.</p>
      </Section>

      <Section title="4. Basis for processing">
        <p>
          We process your data with your consent, which you give by voluntarily submitting a form
          or contacting us, and for limited legitimate uses permitted by law such as responding to
          your request and complying with legal obligations. You may withdraw consent at any time
          (see section 9).
        </p>
      </Section>

      <Section title="5. Cookies and similar technologies">
        <p>
          We do not use advertising or analytics cookies. If you are an administrator signing in
          to our content system, a strictly necessary session cookie is used to keep you signed
          in. Our public pages may use your browser&rsquo;s session storage to avoid counting the
          same profile visit twice; it is cleared when you close the tab. Because we use only
          strictly necessary technologies, we do not show a cookie consent banner. If we add
          analytics or marketing tools in future, we will update this policy and ask for consent first.
        </p>
      </Section>

      <Section title="6. Third-party services">
        <p>We rely on the following providers, who may process limited data on our behalf:</p>
        <ul>
          <li>Supabase &ndash; database and authentication for site content.</li>
          <li>Cloudinary &ndash; hosting of images and media.</li>
          <li>Google Fonts &ndash; loads typefaces; your IP address is sent to Google when the page loads.</li>
          <li>QR Server (api.qrserver.com) &ndash; generates the QR code on our profile page from the page address only.</li>
          <li>WhatsApp (Meta) &ndash; if you choose to contact or share our profile via WhatsApp, that service&rsquo;s own privacy policy applies.</li>
          <li>Our hosting provider and email provider, for serving the site and receiving your messages.</li>
        </ul>
        <p>
          Some of these providers are located outside India. We do not otherwise transfer your
          data abroad, and we will not disclose it except to these providers, where required by
          law, or with your consent.
        </p>
      </Section>

      <Section title="7. Retention">
        <p>
          We keep enquiry information only as long as needed to respond and for any resulting
          business relationship, and for the period required by applicable accounting, tax or
          other law. After that we delete or anonymise it.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use reasonable safeguards, including encrypted connections (HTTPS), access-controlled
          administration, and role-based access to stored data. No online system is completely
          secure; if a personal data breach affecting you occurs, we will notify you and the
          authorities as required by law.
        </p>
      </Section>

      <Section title="9. Your rights">
        <p>Under the DPDP Act, 2023 you may ask us to:</p>
        <ul>
          <li>give you a summary of the personal data we hold and how we use it;</li>
          <li>correct or update inaccurate data;</li>
          <li>erase your data, or withdraw your consent;</li>
          <li>address a grievance, and nominate another person to exercise these rights if you die or become incapacitated.</li>
        </ul>
        <p>
          To exercise any right, email <a href={`mailto:${contact.email}`}>{contact.email}</a>. We
          aim to respond within 30 days. If you are not satisfied, you may complain to the Data
          Protection Board of India once it is operational.
        </p>
      </Section>

      <Section title="10. Grievance contact">
        <p>
          Grievance Officer, Magnus Enterprises, {contact.address}. Email:{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>. Phone: {contact.phone}.
        </p>
      </Section>

      <Section title="11. Changes">
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date above
          shows the current version.
        </p>
      </Section>
    </LegalPage>
  );
}
