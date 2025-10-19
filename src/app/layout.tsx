import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {cn} from '@/lib/utils';
import { ServiceWorkerRegistrar } from '@/components/service-worker-registrar';
import { MonetagScripts } from '@/components/monetag-scripts';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'VerseMark',
  description: 'A modern Bible study and bookmarking app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <Script id="monetag-script-2" dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='9956044',s.src='https://forfrogadiertor.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://www.googletagmanager.com/gtag/js?id=G-Q3W38382J2" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@6..72,400;6..72,700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <MonetagScripts />
      </head>
      <body className={cn('font-body')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
