import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/css/bootstrap.css';

import 'aos/dist/aos.css';

import type { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';

import Header from '@/app/components/Header';

import './variables.css';
import './globals.css';
 
const ebGaramond = EB_Garamond({ subsets: ['latin'] }); // Pastikan nama variabel sesuai

export const metadata: Metadata = {
  title: 'Arion Mall', // Sesuaikan deng  an judul aplikasi Anda
  description: 'ArionMall_UsulanWeb', // Sesuaikan dengan deskripsi aplikasi Anda
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ebGaramond.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}