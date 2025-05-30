'use client';
import { ThemeProvider } from '@/stores/themeStore';
import Header from '@/components/common/layout/Header';
import Footer from '@/components/common/layout/Footer';
import { Geist, Geist_Mono } from 'next/font/google';
import GlobalErrorAlert from '@/components/common/ui/GlobalErrorAlert';
import GlobalProgressBar from '@/components/common/ui/GlobalProgressBar';
import ErrorBoundary from '@/components/common/error/ErrorBoundary';
import { useEffect } from 'react';
import PerformanceMonitoringService from '@/lib/api/monitoring/PerformanceMonitoringService';
import PerformanceDashboard from '@/components/common/debug/PerformanceDashboard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize performance monitoring
    const performanceMonitor = PerformanceMonitoringService.getInstance();
    performanceMonitor.startMonitoring();
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ErrorBoundary>
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
          <Footer />
          <PerformanceDashboard />
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}
