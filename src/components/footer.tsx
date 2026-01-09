"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { useState } from "react";

export function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        alert("Thank you for subscribing!");
        setEmail("");
    };

    return (
        <footer className="bg-secondary border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    {/* Left Column - Jhelum Kesar Co. Information */}
                    <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-secondary-foreground mb-3 sm:mb-4">
                            Jhelum Kesar Co.
                        </h3>
                        <p className="text-secondary-foreground/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            Bringing the world's most precious spice directly from the fields to your kitchen. Ethically sourced, premium quality.
                        </p>
                        <p className="text-secondary-foreground/80 text-xs sm:text-sm">
                            © 2024 Jhelum Kesar Co. All rights reserved.
                        </p>
                    </div>

                    {/* Middle Column - Quick Links */}
                    <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-secondary-foreground mb-3 sm:mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/shop" className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors">
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link href="#our-story" className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors">
                                    Shipping & Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column - Newsletter & Social Media */}
                    <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-secondary-foreground mb-3 sm:mb-4">
                            Newsletter
                        </h3>
                        <p className="text-secondary-foreground/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            Subscribe for exclusive offers and rewards.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                                required
                            />
                            <Button
                                type="submit"
                                className="bg-card hover:bg-card/90 text-primary px-4 sm:px-6 rounded-lg text-sm sm:text-base whitespace-nowrap"
                            >
                                Join
                            </Button>
                        </form>
                        
                        {/* Social Media Icons */}
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/jhelumkesar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-foreground hover:text-secondary-foreground/80 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, '') || '919876543210'}?text=${encodeURIComponent("Hello! I'm interested in Jhelum Kesar Co. products.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-foreground hover:text-[#25D366] transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
