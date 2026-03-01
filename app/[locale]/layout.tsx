import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';
import { PwaRegister } from '@/components/PwaRegister';

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-plex-mono',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'System' });

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: "Advanced visual dashboard for global intelligence and data feeds.",
    manifest: '/manifest.json', // Added manifest
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://global-hud.vercel.app',
      title: t('title'),
      description: "Advanced visual dashboard for global intelligence and data feeds.",
      siteName: t('title'),
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: "Advanced visual dashboard for global intelligence and data feeds.",
      images: ['/og-image.jpg'],
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
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    import('next/navigation').then(m => m.notFound());
    return null;
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${plexMono.variable} font-mono antialiased bg-[#05080f] text-[#00f0ff] overflow-hidden`}>
        <NextIntlClientProvider messages={messages}>
          <PwaRegister />
          <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Global HUD",
              "url": "https://global-hud.vercel.app",
              "description": "Advanced Cyberpunk Intelligence Dashboard tracking geopolitics and crypto.",
              "applicationCategory": "DashboardApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </Script>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
