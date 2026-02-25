"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Flower2,
    Sparkles,
    Nut,
    Apple,
    Coffee,
    Hexagon,
    Droplet,
    Flame,
    Wind,
    Crown,
    Package
} from "lucide-react";

// Define categories with their icons and brand colors
const categories = [
    {
        name: "Saffron",
        slug: "Saffron",
        icon: Flower2,
        color: "text-saffron-crimson",
        borderColor: "border-saffron-crimson",
        hoverBg: "hover:bg-saffron-crimson/5"
    },
    {
        name: "Beauty",
        slug: "Beauty",
        icon: Sparkles,
        color: "text-rose-600",
        borderColor: "border-rose-600",
        hoverBg: "hover:bg-rose-600/5"
    },
    {
        name: "Nuts",
        slug: "Nuts",
        icon: Nut,
        color: "text-amber-800",
        borderColor: "border-amber-800",
        hoverBg: "hover:bg-amber-800/5"
    },
    {
        name: "Food",
        slug: "Food",
        icon: Apple,
        color: "text-green-700",
        borderColor: "border-green-700",
        hoverBg: "hover:bg-green-700/5"
    },
    {
        name: "Tea",
        slug: "Tea",
        icon: Coffee,
        color: "text-teal-700",
        borderColor: "border-teal-700",
        hoverBg: "hover:bg-teal-700/5"
    },
    {
        name: "Honey",
        slug: "Honey",
        icon: Hexagon,
        color: "text-amber-600",
        borderColor: "border-amber-600",
        hoverBg: "hover:bg-amber-600/5"
    },
    {
        name: "Oils",
        slug: "Oils",
        icon: Droplet,
        color: "text-amber-700",
        borderColor: "border-amber-700",
        hoverBg: "hover:bg-amber-700/5"
    },
    {
        name: "Spices",
        slug: "Spices",
        icon: Flame,
        color: "text-red-600",
        borderColor: "border-red-600",
        hoverBg: "hover:bg-red-600/5"
    },
    {
        name: "Fragrance",
        slug: "Fragrance",
        icon: Wind,
        color: "text-purple-600",
        borderColor: "border-purple-600",
        hoverBg: "hover:bg-purple-600/5"
    },
    {
        name: "Kashmiri Special",
        slug: "Kashmiri Special",
        icon: Crown,
        color: "text-estate-gold",
        borderColor: "border-estate-gold",
        hoverBg: "hover:bg-estate-gold/5"
    },
    {
        name: "Other",
        slug: "Other",
        icon: Package,
        color: "text-deep-taupe",
        borderColor: "border-deep-taupe",
        hoverBg: "hover:bg-deep-taupe/5"
    },
];

export function HorizontalCategoryShowcase() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-pure-ivory/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-ink-charcoal">
                        Shop by Category
                    </h2>
                    <p className="text-deep-taupe text-sm sm:text-base">
                        Discover our curated collection
                    </p>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                     w-10 h-10 items-center justify-center rounded-full 
                     bg-white shadow-lg border border-soft-silk-border
                     hover:bg-pure-ivory transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-ink-charcoal" strokeWidth={1.5} />
                    </button>

                    {/* Scrollable Categories */}
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        <div className="flex gap-6 sm:gap-8 md:gap-10 px-4 py-6 justify-start md:justify-center min-w-min">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    className="flex-shrink-0"
                                >
                                    <Link
                                        href={`/shop?category=${encodeURIComponent(category.slug)}`}
                                        className="group block"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Circular Outline Badge */}
                                            <div
                                                className={`
                          relative w-24 h-24 sm:w-28 sm:h-28
                          rounded-full 
                          border-2 ${category.borderColor}
                          bg-white
                          ${category.hoverBg}
                          flex items-center justify-center
                          transition-all duration-300
                          group-hover:scale-105 group-hover:shadow-lg
                        `}
                                            >
                                                {/* Icon */}
                                                <category.icon
                                                    className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color}`}
                                                    strokeWidth={1.5}
                                                />
                                            </div>

                                            {/* Category Name */}
                                            <h3 className="font-serif text-sm sm:text-base text-ink-charcoal text-center group-hover:text-saffron-crimson transition-colors leading-tight max-w-[100px]">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                     w-10 h-10 items-center justify-center rounded-full 
                     bg-white shadow-lg border border-soft-silk-border
                     hover:bg-pure-ivory transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-ink-charcoal" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Mobile scroll hint */}
                <div className="md:hidden text-center mt-4">
                    <p className="text-xs text-deep-taupe/60">Swipe to explore →</p>
                </div>
            </div>

            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
