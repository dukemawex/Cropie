import type { Metadata } from 'next';
import { Syne, IBM_Plex_Mono } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-ibm-plex-mono' });

export const metadata: Metadata = {
  title: 'AgroSentinel',
  description: 'Satellite-powered crop disease detection for African farmers'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${mono.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
