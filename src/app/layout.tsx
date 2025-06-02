import type { Metadata } from 'next';
import { ThemeProvider } from '@/stores/themeStore';
import Header from '@/components/common/layout/Header';
import Footer from '@/components/common/layout/Footer';
import { Geist, Geist_Mono } from 'next/font/google';
import GlobalErrorAlert from '@/components/common/ui/GlobalErrorAlert';
import GlobalProgressBar from '@/components/common/ui/GlobalProgressBar';
import ErrorBoundary from '@/components/common/error/ErrorBoundary';
import QueryProvider from '@/components/common/providers/QueryProvider';
import { getDatabaseCounts } from '@/lib/utils/databaseStats';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dashboard - League of Legends Aram',
  description: 'Dashboard for League of Legends Aram',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch database counts for the footer
  const databaseCounts = await getDatabaseCounts();

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider>
              <Header />
              <GlobalProgressBar />
              <GlobalErrorAlert />
              <ErrorBoundary
                fallback={
                  <div className='min-h-screen flex items-center justify-center'>
                    <div className='alert alert-error max-w-md'>
                      <div>
                        <div className='font-semibold'>Application Error</div>
                        <div className='text-sm'>
                          The main content failed to load. Please refresh the page.
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                {children}
              </ErrorBoundary>
              <Footer playersCount={databaseCounts.playersCount} matchesCount={databaseCounts.matchesCount} />
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
