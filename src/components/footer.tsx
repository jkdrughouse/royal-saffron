"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Footer() {
    const [email, setEmail] = useState("");
    const [openSection, setOpenSection] = useState<'company' | 'links' | 'newsletter' | null>(null);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        alert("Thank you for subscribing!");
        setEmail("");
    };

    const toggleSection = (section: 'company' | 'links' | 'newsletter') => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-secondary border-t border-border mb-16 lg:mb-0">
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Mobile Accordion View */}
                <div className="md:hidden space-y-2 mb-8">
                    {/* Company Section */}
                    <div className="border-b border-border">
                        <button
                            onClick={() => toggleSection('company')}
                            className="w-full flex items-center justify-between py-4 text-left"
                        >
                            <h3 className="font-serif text-lg font-bold text-secondary-foreground">
                                Jhelum Kesar Co.
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-secondary-foreground transition-transform duration-300 ${openSection === 'company' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openSection === 'company' ? 'max-h-96 pb-4' : 'max-h-0'
                                }`}
                        >
                            <p className="text-secondary-foreground/90 mb-4 leading-relaxed text-sm">
                                Bringing the world's most precious spice directly from the fields to your kitchen. Ethically sourced, premium quality.
                            </p>
                            <p className="text-secondary-foreground/80 text-xs">
                                © 2026 Jhelum Kesar Co. All rights reserved.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="border-b border-border">
                        <button
                            onClick={() => toggleSection('links')}
                            className="w-full flex items-center justify-between py-4 text-left"
                        >
                            <h3 className="font-serif text-lg font-bold text-secondary-foreground">
                                Quick Links
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-secondary-foreground transition-transform duration-300 ${openSection === 'links' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openSection === 'links' ? 'max-h-96 pb-4' : 'max-h-0'
                                }`}
                        >
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
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-b border-border">
                        <button
                            onClick={() => toggleSection('newsletter')}
                            className="w-full flex items-center justify-between py-4 text-left"
                        >
                            <h3 className="font-serif text-lg font-bold text-secondary-foreground">
                                Newsletter
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-secondary-foreground transition-transform duration-300 ${openSection === 'newsletter' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openSection === 'newsletter' ? 'max-h-96 pb-4' : 'max-h-0'
                                }`}
                        >
                            <p className="text-secondary-foreground/90 mb-4 leading-relaxed text-sm">
                                Subscribe for exclusive offers and rewards.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mb-6">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-card hover:bg-card/90 text-primary px-4 rounded-lg text-sm"
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
                                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, '') || '917889852247'}?text=${encodeURIComponent("Hello! I'm interested in Jhelum Kesar Co. products.")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary-foreground hover:text-[#25D366] transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Grid View - Hidden on Mobile */}
                <div className="hidden md:grid grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    {/* Left Column - Jhelum Kesar Co. Information */}
                    <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-secondary-foreground mb-3 sm:mb-4">
                            Jhelum Kesar Co.
                        </h3>
                        <p className="text-secondary-foreground/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            Bringing the world's most precious spice directly from the fields to your kitchen. Ethically sourced, premium quality.
                        </p>
                        <p className="text-secondary-foreground/80 text-xs sm:text-sm">
                            © 2026 Jhelum Kesar Co. All rights reserved.
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
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, '') || '917889852247'}?text=${encodeURIComponent("Hello! I'm interested in Jhelum Kesar Co. products.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-foreground hover:text-[#25D366] transition-colors"
                                aria-label="WhatsApp"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
