"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "./lib/products";
import { Leaf, Award, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { LeadCaptureBanner } from "@/components/lead-capture-banner";

export default function Home() {
  const featuredProducts = products.slice(0, 3);
  
  // Hero images array
  const heroImages = [
    {
      src: "/hero-clean.png",
      alt: "Royal Saffron Hero",
      title: "The Gold of",
      subtitle: "Spices",
      description: "Discover the unmatched aroma and color of our premium Super Negin saffron. Hand-harvested for the purest culinary experience."
    },
    {
      src: "/hero-saffron-premium.png",
      alt: "Premium Kashmiri Saffron",
      title: "PREMIUM",
      subtitle: "KASHMIRI SAFFRON",
      description: "The Gold of Spices. Experience the finest quality saffron from the valleys of Kashmir."
    },
    {
      src: "/hero-shilajit.png",
      alt: "Kashmir Shilajit",
      title: "EXPERIENCE",
      subtitle: "PURE VITALITY",
      description: "100% Pure Kashmiri Shilajit. Sourced from the highest altitudes of the Himalayas."
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const currentHero = heroImages[currentImageIndex];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          {heroImages.map((hero, index) => (
            <motion.img
              key={index}
              src={hero.src}
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.85]"
              alt={hero.alt}
              style={{
                objectPosition: 'center center',
                objectFit: 'cover'
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.05
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
        </div>
        
        {/* Navigation dots */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? "bg-pure-ivory w-6 sm:w-8" 
                  : "bg-pure-ivory/50 hover:bg-pure-ivory/75 w-1.5 sm:w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {currentImageIndex === 0 && (
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl mb-4 sm:mb-6 md:mb-8 text-white leading-tight">
                {currentHero.title} <br />
                <span className="italic font-light">{currentHero.subtitle}</span>
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl font-light leading-relaxed">
                {currentHero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-saffron-crimson hover:bg-estate-gold border-none text-pure-ivory font-medium shadow-lg hover:shadow-xl transition-all">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="#our-story" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-pure-ivory border-pure-ivory bg-transparent hover:bg-pure-ivory/10 font-medium">
                    Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Trust Signals */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-pure-ivory rounded-xl p-6 sm:p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf size={32} strokeWidth={1.5} className="text-saffron-crimson sm:w-10 sm:h-10" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink-charcoal mb-2 sm:mb-3">100% Organic</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Grown without pesticides, harvested by hand.</p>
            </div>
            <div className="bg-pure-ivory rounded-xl p-6 sm:p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award size={32} strokeWidth={1.5} className="text-saffron-crimson sm:w-10 sm:h-10" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink-charcoal mb-2 sm:mb-3">Premium Grade A+</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Certified Super Negin quality with max potency.</p>
            </div>
            <div className="bg-pure-ivory rounded-xl p-6 sm:p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={32} strokeWidth={1.5} className="text-saffron-crimson sm:w-10 sm:h-10" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink-charcoal mb-2 sm:mb-3">Lab Tested</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Verified for purity, color, and aroma strength.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl mb-2 sm:mb-4 text-ink-charcoal">Best Sellers</h2>
              <p className="text-deep-taupe text-sm sm:text-base">Our most loved saffron products</p>
            </div>
            <Link href="/shop" className="text-saffron-crimson font-medium hover:text-estate-gold transition-colors flex items-center gap-2 text-sm sm:text-base">
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href="/shop">
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-pure-ivory mb-4 sm:mb-6 shadow-sm group-hover:shadow-md transition-all">
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className="bg-pure-ivory/90 backdrop-blur px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full">Threads</span>
                    </div>
                    <img
                      src={product.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={product.name}
                    />
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-lg sm:text-xl text-ink-charcoal group-hover:text-saffron-crimson transition-colors flex-1 leading-tight">{product.name}</h3>
                    <span className="font-mono text-base sm:text-lg font-medium text-ink-charcoal whitespace-nowrap">₹{product.price}</span>
                  </div>
                  <p className="text-sm text-deep-taupe mt-2 line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Banner */}
      <LeadCaptureBanner />

      {/* Legacy Section */}
      <section id="our-story" className="py-16 sm:py-24 md:py-32 bg-saffron-crimson text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-pure-ivory mb-4 sm:mb-6 flex justify-center">
            <Award size={32} strokeWidth={1} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 text-pure-ivory">A Legacy of Purity</h2>
          <p className="text-pure-ivory/90 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 font-sans px-2">
            Saffron is more than just a spice; it's a labor of love. Each flower produces only three crimson stigmas, which must be hand-picked at dawn before the sun becomes too strong. It takes over 150,000 flowers to produce just one kilogram of our Royal Saffron.
          </p>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="rounded-lg px-6 sm:px-8 py-4 sm:py-6 bg-pure-ivory text-saffron-crimson border-pure-ivory hover:bg-transparent hover:text-pure-ivory hover:border-pure-ivory transition-all uppercase tracking-wide text-xs sm:text-sm font-medium w-full sm:w-auto">
              Read Our Full Story
            </Button>
          </Link>
        </div>
      </section>

      {/* White Space Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white"></section>
    </div>
  );
}
