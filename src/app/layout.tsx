import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/css/bootstrap.css';

import 'aos/dist/aos.css';

import type { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

import './variables.css';
import './globals.css';

const ebGaramond = EB_Garamond({ subsets: ['latin'] }); // Pastikan nama variabel sesuai

export const metadata: Metadata = {
  title: 'Arion Mall',
  description: 'The Best One Stop Shopping Centre in East Jakarta',
  icons: '/favicon.ico',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon-96x96.png" />
      </head>
      <body className={ebGaramond.className}>
        {/* Tampilkan header dan footer secara kondisional */}
        {!String(children).includes('/admin') && <Header />}
        <main>
          {children}
        </main>
        {!String(children).includes('/admin') && <Footer />}
      </body>
    </html>
  );
}
