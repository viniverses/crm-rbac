import '@crm/ui/globals.css';

import { Toaster } from '@crm/ui/components/sonner';
import { TooltipProvider } from '@crm/ui/components/tooltip';
import { cn } from '@crm/ui/lib/utils';
import { Geist_Mono, Inter } from 'next/font/google';
import * as React from 'react';

import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body className="h-svh overflow-hidden">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
