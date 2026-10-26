import type { Metadata } from 'next';
import './globals.css';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Magnus Enterprises | CNC Machining & Switchgear Assembly in Nashik',
    template: '%s | Magnus Enterprises',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
