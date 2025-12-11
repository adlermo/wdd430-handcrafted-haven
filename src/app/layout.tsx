import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

// Body font: Inter - Optimized for UI
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Note: Arvo will be loaded via Google Fonts in globals.css
// Google Fonts integration for optimal performance

export const metadata: Metadata = {
  metadataBase: new URL('https://handcrafted-haven.vercel.app'),
  title: {
    default: 'Handcrafted Haven - Unique Handmade Products',
    template: '%s | Handcrafted Haven',
  },
  description:
    'Discover unique handcrafted items from talented artisans. Support local creators and find one-of-a-kind treasures made with love.',
  keywords: ['handmade', 'crafts', 'artisan', 'handcrafted', 'marketplace', 'unique gifts', 'artisan marketplace', 'handmade products'],
  authors: [{ name: 'Handcrafted Haven Team' }],
  creator: 'Handcrafted Haven',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Handcrafted Haven',
    title: 'Handcrafted Haven - Unique Handmade Products',
    description: 'Discover unique handcrafted items from talented artisans. Support local creators and find one-of-a-kind treasures.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Handcrafted Haven - Artisan Marketplace',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handcrafted Haven - Unique Handmade Products',
    description: 'Discover unique handcrafted items from talented artisans.',
    images: ['/og-image.jpg'],
    creator: '@handcraftedhaven',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Optimized Google Fonts loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 
            focus:px-6 focus:py-3 focus:bg-terracotta focus:text-white focus:rounded-lg 
            focus:shadow-soft-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
