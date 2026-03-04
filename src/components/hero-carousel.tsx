"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const heroImages = [
    {
        src: "/hero-clean.webp",
        alt: "Royal Saffron Hero",
        title: "The Gold of",
        subtitle: "Spices",
        description: "Discover the unmatched aroma and color of our premium Super Negin saffron. Hand-harvested for the purest culinary experience.",
        ctaLabel: "Shop Collection",
        ctaHref: "/shop",
        badge: null,
    },
    {
        src: "/hero-sale-1.webp",
        alt: "Premium Kashmiri Saffron Threads — Special Offer",
        title: "Pure Kashmiri",
        subtitle: "Saffron — 20% Off",
        description: "Limited-time offer: our finest Grade A+ Super Negin saffron threads, sourced directly from the fields of Kashmir. Unmatched colour, aroma, and potency.",
        ctaLabel: "Buy Saffron Now",
        ctaHref: "/product/kashmiri-saffron",
        badge: "LIMITED OFFER",
    },
    {
        src: "/hero-sale-2.webp",
        alt: "Gift-Ready Kashmiri Saffron Box",
        title: "Gift the World's",
        subtitle: "Finest Saffron",
        description: "Handcrafted gift boxes of pure Kashmiri saffron — the perfect luxury gift. Straight from the valleys of Kashmir to your doorstep.",
        ctaLabel: "Shop Gift Boxes",
        ctaHref: "/shop",
        badge: "FREE SHIPPING",
    },
];

export function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const current = heroImages[currentIndex];

    return (
        <section className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden bg-white">
            {/* Hero Images */}
            <div className="absolute inset-0 z-0">
                {/* First slide: plain div + CSS transition = instant LCP paint, no JS dependency */}
                <div
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{ opacity: currentIndex === 0 ? 1 : 0 }}
                >
                    <Image
                        src={heroImages[0].src}
                        alt={heroImages[0].alt}
                        fill
                        priority
                        fetchPriority="high"
                        loading="eager"
                        sizes="100vw"
                        className="object-cover object-center brightness-[0.85]"
                    />
                </div>

                {/* Slides 2 & 3: Framer Motion (lazy, non-LCP) */}
                {heroImages.slice(1).map((hero, i) => {
                    const index = i + 1;
                    return (
                        <motion.div
                            key={index}
                            className="absolute inset-0"
                            animate={{
                                opacity: currentIndex === index ? 1 : 0,
                                scale: currentIndex === index ? 1 : 1.05,
                            }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <Image
                                src={hero.src}
                                alt={hero.alt}
                                fill
                                loading="lazy"
                                sizes="100vw"
                                className="object-cover object-center brightness-[0.85]"
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-2 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="p-4 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-0"
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentIndex ? "true" : undefined}
                    >
                        <span
                            className={`block rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-pure-ivory h-2 w-6 sm:w-8"
                                : "bg-pure-ivory/50 hover:bg-pure-ivory/75 h-1.5 w-1.5 sm:h-2 sm:w-2"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Hero text overlay */}
            {/* Hero text overlay — unified, data-driven */}
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    {/* Badge for sale slides */}
                    {current.badge && (
                        <span className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-estate-gold text-ink-charcoal shadow-md">
                            {current.badge}
                        </span>
                    )}
                    <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl mb-4 sm:mb-6 md:mb-8 text-white leading-tight">
                        {current.title} <br />
                        <span className="italic font-light">{current.subtitle}</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl font-light leading-relaxed">
                        {current.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link href={current.ctaHref} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-saffron-crimson hover:bg-estate-gold border-none text-pure-ivory font-medium shadow-lg hover:shadow-xl transition-all">
                                {current.ctaLabel}
                            </Button>
                        </Link>
                        {currentIndex === 0 && (
                            <Link href="#our-story" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-pure-ivory border-pure-ivory bg-transparent hover:bg-pure-ivory/10 font-medium">
                                    Our Story
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
