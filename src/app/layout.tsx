import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { RootLayoutContent } from "@/components/root-layout-content";
import JsonLd from "@/components/json-ld";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jhelumkesarco.com'),
  title: {
    default: "Jhelum Kesar Co. — Premium Kashmiri Saffron",
    template: "%s | Jhelum Kesar Co.",
  },
  description:
    "Authentic Kashmiri saffron sourced directly from the saffron fields of Pampore, Jammu & Kashmir. Shop premium Super Negin saffron, Kashmiri honey, and natural wellness products.",
  keywords: ["kashmiri saffron", "kesar", "pampore saffron", "buy saffron online india", "super negin saffron", "jhelum kesar"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jhelumkesarco.com',
    siteName: 'Jhelum Kesar Co.',
    title: 'Jhelum Kesar Co. — Premium Kashmiri Saffron',
    description: 'Authentic Kashmiri saffron sourced directly from the saffron fields of Pampore, Jammu & Kashmir.',
    images: [
      {
        url: '/hero-clean.webp',
        width: 1200,
        height: 630,
        alt: 'Jhelum Kesar Co. — Premium Kashmiri Saffron',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jhelum Kesar Co. — Premium Kashmiri Saffron',
    description: 'Authentic Kashmiri saffron sourced directly from Pampore, J&K.',
    images: ['/hero-clean.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // Read the nonce injected by middleware (via x-nonce request header)
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Jhelum Kesar Co.",
          "url": "https://jhelumkesarco.com",
          "logo": "https://jhelumkesarco.com/logo-final.png",
          "description": "Authentic Kashmiri saffron sourced directly from the saffron fields of Pampore, Jammu & Kashmir.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7889852247",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Jammu & Kashmir",
            "addressCountry": "IN"
          },
          "sameAs": [
            "https://www.instagram.com/jhelumkesarco"
          ]
        }} />
      </head>
      {gaId && (
        <>
          {/* External GA script — nonce allows it through CSP script-src */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
            nonce={nonce}
          />
          {/* Inline GA init — nonce allows it through CSP script-src */}
          <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
      <body
        className={`${montserrat.variable} ${cormorant.variable} font-sans bg-background text-foreground overflow-x-hidden`}
      >
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
