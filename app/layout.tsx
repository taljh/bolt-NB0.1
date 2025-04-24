import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { Toaster } from 'sonner';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'نَسيق - نظام تسعير وإدارة ذكي لمشاريع العبايات',
  description: 'نظام ERP ذكي مصمم خصيصًا لقطاع العبايات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmPlexSansArabic.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}