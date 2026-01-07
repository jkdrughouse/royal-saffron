"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "./lib/products";
import { Leaf, Award, ShieldCheck } from "lucide-react";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-clean.png"
            className="w-full h-full object-cover brightness-[0.8]"
            alt="Royal Saffron Hero"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-6xl md:text-8xl mb-8 text-white leading-tight">
              The Gold of <br />
              <span className="italic font-light">Spices</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl font-light leading-relaxed">
              Discover the unmatched aroma and color of our premium Super Negin saffron. Hand-harvested for the purest culinary experience.
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-saffron-crimson hover:bg-estate-gold border-none text-pure-ivory font-medium shadow-lg hover:shadow-xl transition-all">
                  Shop Collection
                </Button>
              </Link>
              <Link href="#our-story">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg text-pure-ivory border-pure-ivory bg-transparent hover:bg-pure-ivory/10 font-medium">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-24 bg-parchment-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pure-ivory rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf size={40} strokeWidth={1.5} className="text-saffron-crimson" />
              </div>
              <h3 className="font-serif text-2xl text-ink-charcoal mb-3">100% Organic</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Grown without pesticides, harvested by hand.</p>
            </div>
            <div className="bg-pure-ivory rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award size={40} strokeWidth={1.5} className="text-saffron-crimson" />
              </div>
              <h3 className="font-serif text-2xl text-ink-charcoal mb-3">Premium Grade A+</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Certified Super Negin quality with max potency.</p>
            </div>
            <div className="bg-pure-ivory rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={40} strokeWidth={1.5} className="text-saffron-crimson" />
              </div>
              <h3 className="font-serif text-2xl text-ink-charcoal mb-3">Lab Tested</h3>
              <p className="text-deep-taupe font-light text-sm leading-relaxed">Verified for purity, color, and aroma strength.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-parchment-cream">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl mb-4 text-ink-charcoal">Best Sellers</h2>
              <p className="text-deep-taupe">Our most loved saffron products</p>
            </div>
            <Link href="/shop" className="text-saffron-crimson font-medium hover:text-estate-gold transition-colors flex items-center gap-2">
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href="/shop">
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-pure-ivory mb-6 shadow-sm group-hover:shadow-md transition-all">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-pure-ivory/90 backdrop-blur px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full">Threads</span>
                    </div>
                    <img
                      src={product.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={product.name}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-xl text-ink-charcoal group-hover:text-saffron-crimson transition-colors max-w-[70%] leading-tight">{product.name}</h3>
                    <span className="font-mono text-lg font-medium text-ink-charcoal">₹{product.price}</span>
                  </div>
                  <p className="text-sm text-deep-taupe mt-2 line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section id="our-story" className="py-32 bg-parchment-cream text-center border-b border-pure-ivory">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-saffron-crimson mb-6 flex justify-center">
            <Award size={40} strokeWidth={1} />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mb-8 text-ink-charcoal">A Legacy of Purity</h2>
          <p className="text-saffron-crimson text-lg leading-relaxed mb-12 font-sans">
            Saffron is more than just a spice; it's a labor of love. Each flower produces only three crimson stigmas, which must be hand-picked at dawn before the sun becomes too strong. It takes over 150,000 flowers to produce just one kilogram of our Royal Saffron.
          </p>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="rounded-lg px-8 py-6 bg-pure-ivory text-saffron-crimson border-saffron-crimson hover:bg-saffron-crimson hover:text-pure-ivory transition-all uppercase tracking-wide text-sm font-medium">
              Read Our Full Story
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
