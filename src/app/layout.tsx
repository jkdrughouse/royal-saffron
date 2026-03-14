import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { RootLayoutContent } from "@/components/root-layout-content";
import JsonLd from "@/components/json-ld";
import {
  CONTACT_PHONE,
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  siteNavigationLinks,
  toAbsoluteUrl,
} from "@/app/lib/site-metadata";

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Premium Kashmiri Saffron`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["kashmiri saffron", "kesar", "pampore saffron", "buy saffron online india", "super negin saffron", "jhelum kesar"],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "1763x1763" },
      { url: "/logo-final.png", type: "image/png", sizes: "1763x1763" },
    ],
    shortcut: ["/icon.png"],
    apple: [{ url: "/icon.png", sizes: "1763x1763" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium Kashmiri Saffron`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero-clean.webp",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Premium Kashmiri Saffron`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Premium Kashmiri Saffron`,
    description: SITE_DESCRIPTION,
    images: ["/hero-clean.webp"],
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
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: toAbsoluteUrl("/logo-final.png"),
              description: SITE_DESCRIPTION,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: CONTACT_PHONE,
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              address: {
                "@type": "PostalAddress",
                addressRegion: "Jammu & Kashmir",
                addressCountry: "IN",
              },
              sameAs: [INSTAGRAM_URL],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "en-IN",
            },
            ...siteNavigationLinks.map((link) => ({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: link.name,
              url: toAbsoluteUrl(link.href),
            })),
          ]}
        />
        {/* Preload LCP hero image — tells browser to fetch it immediately */}
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <link
          rel="preload"
          as="image"
          href="/hero-clean.webp"
          // @ts-expect-error fetchpriority is valid HTML but not yet in React types
          fetchpriority="high"
        />
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
