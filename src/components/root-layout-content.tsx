"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartProvider } from "@/app/lib/cart-context";
import { WishlistProvider } from "@/app/lib/wishlist-context";
import { MobileMenu } from "@/components/mobile-menu";
import { WishlistIcon } from "@/components/wishlist-icon";
import { UserAccount } from "@/components/user-account";
import { CartIcon } from "@/components/cart-icon";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BottomNav } from "@/components/bottom-nav";
import { Analytics } from "@/components/analytics";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <CartProvider>
            <WishlistProvider>
                {/* Top Announcement Bar */}
                <div className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold tracking-widest text-center py-2 px-4 uppercase w-full max-w-full overflow-x-hidden">
                    Free shipping on all orders over ₹1000
                </div>

                <header
                    className={`sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border transition-all duration-300 ${isScrolled ? "shadow-md backdrop-blur-md" : "shadow-sm"
                        }`}
                >
                    <div className="container flex h-16 sm:h-[68px] items-center justify-between px-4 sm:px-6 relative">
                        <Link
                            href="/"
                            className="logo-container flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
                            style={{
                                border: "none",
                                borderWidth: 0,
                                borderStyle: "none",
                                borderColor: "transparent",
                                textDecoration: "none",
                                outline: "none",
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
                                        border: "none",
                                        borderWidth: 0,
                                        borderStyle: "none",
                                        borderColor: "transparent",
                                        outline: "none",
                                        boxShadow: "none",
                                        background: "transparent",
                                        padding: 0,
                                        margin: 0,
                                    }}
                                    priority
                                    unoptimized
                                />
                            </div>
                            <span className="font-serif text-lg sm:text-2xl font-bold text-primary tracking-tight">
                                Jhelum Kesar Co.
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
                            <Link
                                href="/"
                                className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase"
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/categories"
                                className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/our-story"
                                className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase"
                            >
                                Our Story
                            </Link>
                            <Link
                                href="/contact"
                                className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase"
                            >
                                Contact
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="lg:hidden">
                                <MobileMenu />
                            </div>
                            <WishlistIcon />
                            <div className="hidden lg:block">
                                <UserAccount />
                            </div>
                            <div className="hidden lg:block">
                                <CartIcon />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Add padding bottom on mobile to account for bottom nav */}
                <div className="pb-0 lg:pb-0">{children}</div>

                <Footer />

                {/* WhatsApp Floating Button */}
                <WhatsAppButton
                    phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "917889852247"}
                    message="Hello! I'm interested in Jhelum Kesar Co. products."
                />

                {/* Bottom Navigation (Mobile Only) */}
                <BottomNav />

                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>
            </WishlistProvider>
        </CartProvider>
    );
}
