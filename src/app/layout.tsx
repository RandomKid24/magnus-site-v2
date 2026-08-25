import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Magnus Enterprises | Precision Engineering & Industrial Solutions',
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
