"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Flower2,
    Sparkles,
    Nut,
    Apple,
    Coffee,
    Hexagon,
    Flame,
    Droplet,
    Leaf,
    Crown,
    Package
} from "lucide-react";

// Define categories with their icons and colors
const categories = [
    {
        name: "Saffron",
        slug: "Saffron",
        icon: Flower2,
        bgColor: "bg-gradient-to-br from-amber-200 to-yellow-300",
        borderColor: "border-amber-900"
    },
    {
        name: "Beauty",
        slug: "Beauty",
        icon: Sparkles,
        bgColor: "bg-gradient-to-br from-pink-200 to-rose-300",
        borderColor: "border-pink-900"
    },
    {
        name: "Nuts",
        slug: "Nuts",
        icon: Nut,
        bgColor: "bg-gradient-to-br from-amber-100 to-orange-200",
        borderColor: "border-amber-800"
    },
    {
        name: "Food",
        slug: "Food",
        icon: Apple,
        bgColor: "bg-gradient-to-br from-green-200 to-emerald-300",
        borderColor: "border-green-900"
    },
    {
        name: "Tea",
        slug: "Tea",
        icon: Coffee,
        bgColor: "bg-gradient-to-br from-green-200 to-teal-300",
        borderColor: "border-green-800"
    },
    {
        name: "Honey",
        slug: "Honey",
        icon: Hexagon,
        bgColor: "bg-gradient-to-br from-yellow-200 to-amber-300",
        borderColor: "border-yellow-900"
    },
    {
        name: "Oils",
        slug: "Oils",
        icon: Droplet,
        bgColor: "bg-gradient-to-br from-amber-200 to-yellow-300",
        borderColor: "border-amber-900"
    },
    {
        name: "Spices",
        slug: "Spices",
        icon: Flame,
        bgColor: "bg-gradient-to-br from-red-200 to-orange-300",
        borderColor: "border-red-900"
    },
    {
        name: "Fragrance",
        slug: "Fragrance",
        icon: Leaf,
        bgColor: "bg-gradient-to-br from-purple-200 to-violet-300",
        borderColor: "border-purple-900"
    },
    {
        name: "Kashmiri Special",
        slug: "Kashmiri Special",
        icon: Crown,
        bgColor: "bg-gradient-to-br from-yellow-200 to-amber-300",
        borderColor: "border-yellow-900"
    },
    {
        name: "Other",
        slug: "Other",
        icon: Package,
        bgColor: "bg-gradient-to-br from-slate-200 to-gray-300",
        borderColor: "border-slate-800"
    },
];

export function CategoryShowcase() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-pure-ivory">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-ink-charcoal">
                        Shop by Category
                    </h2>
                    <p className="text-deep-taupe text-sm sm:text-base max-w-2xl mx-auto">
                        Explore our curated collection of premium Kashmiri products
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                            <Link
                                href={`/shop?category=${encodeURIComponent(category.slug)}`}
                                className="group block"
                            >
                                <div className="flex flex-col items-center gap-3 sm:gap-4">
                                    {/* Circular Badge */}
                                    <div className={`
                    relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                    rounded-full 
                    ${category.bgColor}
                    border-4 ${category.borderColor}
                    shadow-lg
                    flex items-center justify-center
                    transition-all duration-300
                    group-hover:scale-110 group-hover:shadow-2xl
                    group-hover:-translate-y-2
                  `}>
                                        {/* Icon */}
                                        <category.icon
                                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-ink-charcoal/80"
                                            strokeWidth={1.5}
                                        />

                                        {/* Shine effect on hover */}
                                        <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 transition-all duration-300" />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="font-serif text-sm sm:text-base md:text-lg text-ink-charcoal text-center group-hover:text-saffron-crimson transition-colors leading-tight">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
