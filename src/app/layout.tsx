import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { RootLayoutContent } from "@/components/root-layout-content";

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
  title: "Jhelum Kesar Co. — Premium Kashmiri Saffron",
  description:
    "Authentic Kashmiri saffron sourced directly from the saffron fields of Pampore, Jammu & Kashmir.",
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
