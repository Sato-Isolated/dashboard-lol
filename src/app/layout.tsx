import type { Metadata } from 'next';
import ClientLayout from '@/components/common/layout/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard - League of Legends Aram',
  description: 'Dashboard for League of Legends Aram',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
