import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import './globals.css'
import LayoutShell from '@/components/LayoutShell'
import MatomoRouteTracker from '@/components/MatomoRouteTracker'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

export const viewport: Viewport = {
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.map.largeagentsystems.org'),
  title: 'LargeAgentSystems.com',
  description:
    'The hub for AI existential safety, providing resources to help you learn about and help mitigate the risks from advanced AI.',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
  openGraph: {
    title: 'LargeAgentSystems.com',
    description:
      'The hub for AI existential safety, providing resources to help you learn about and help mitigate the risks from advanced AI.',
    images: [{ url: '/images/link-preview.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LargeAgentSystems.com',
    description:
      'The hub for AI existential safety, providing resources to help you learn about and help mitigate the risks from advanced AI.',
    images: ['/images/link-preview.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(performance.getEntriesByType('navigation')[0]?.type==='reload')document.documentElement.classList.add('is-reload')}catch(e){}`,
          }}
        />
        <Script id="matomo" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            _paq.push(["disableCookies"]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://aisafety.matomo.cloud/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '1']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src='https://cdn.matomo.cloud/aisafety.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>
        <Suspense fallback={null}>
          <MatomoRouteTracker />
        </Suspense>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
