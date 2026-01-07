import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Bellefair, Beau_Rivage } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { CartProvider } from "./lib/cart-context";
import Link from "next/link";
import { CartIcon } from "@/components/cart-icon";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MobileMenu } from "@/components/mobile-menu";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  display: "swap",
});
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const bellefair = Bellefair({
  subsets: ["latin"],
  variable: "--font-bellefair",
  weight: ["400"],
  display: "swap",
});
const beauRivage = Beau_Rivage({
  subsets: ["latin"],
  variable: "--font-beau-rivage",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jhelum Kesar Co.",
  description: "The World's Finest Saffron",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Using explicit colors from screenshot
  // Top bar: Orange #FF4F1B (approx)
  // Text: White

  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cormorant.variable} ${bellefair.variable} font-sans bg-background text-foreground`}>
        <CartProvider>
          {/* Top Announcement Bar */}
          <div className="bg-saffron-crimson text-pure-ivory text-[10px] sm:text-xs font-bold tracking-widest text-center py-2 px-4 uppercase">
            Free shipping on all orders over ₹1000
          </div>

          <header className="sticky top-0 z-50 w-full bg-pure-ivory/95 backdrop-blur-sm shadow-sm border-b border-soft-silk-border">
            <div className="container flex h-16 sm:h-[68px] items-center justify-between px-4 sm:px-6 relative">
              <Link 
                href="/" 
                className="logo-container flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
                style={{ 
                  border: 'none', 
                  borderWidth: 0, 
                  borderStyle: 'none', 
                  borderColor: 'transparent',
                  textDecoration: 'none',
                  outline: 'none'
                }}
              >
                <div className="flex items-center justify-center">
                  <Image 
                    src="/logo-final.png" 
                    alt="Jhelum Kesar Co." 
                    width={40}
                    height={40}
                    className="object-contain sm:w-[60px] sm:h-[60px]"
                    style={{ 
                      border: 'none', 
                      borderWidth: 0, 
                      borderStyle: 'none', 
                      borderColor: 'transparent',
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                      padding: 0,
                      margin: 0
                    }}
                    priority
                    unoptimized
                  />
                </div>
                <span className="font-bellefair text-lg sm:text-2xl font-bold text-saffron-crimson tracking-tight hidden xs:inline">Jhelum Kesar Co.</span>
              </Link>

              <nav className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="text-xs font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson transition-colors uppercase">
                  Home
                </Link>
                <Link href="/shop" className="text-xs font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson transition-colors uppercase">
                  Shop
                </Link>
                <Link href="#our-story" className="text-xs font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson transition-colors uppercase">
                  Our Story
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <div className="md:hidden">
                  <MobileMenu />
                </div>
                <div>
                  <CartIcon />
                </div>
              </div>
            </div>
          </header>
          {children}
          <Footer />
          {/* WhatsApp Floating Button - Add your phone number here */}
          <WhatsAppButton 
            phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919876543210"} 
            message="Hello! I'm interested in Jhelum Kesar Co. products."
          />
        </CartProvider>
      </body>
    </html>
  );
}
