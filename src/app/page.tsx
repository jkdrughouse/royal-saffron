import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { products } from "./lib/products";
import { Leaf, Award, ShieldCheck } from "lucide-react";
import { LeadCaptureBanner } from "@/components/lead-capture-banner";
import ShopByCategory from "@/components/ShopByCategory";
import { HeroCarousel } from "@/components/hero-carousel";
import { ReviewTicker } from "@/components/review-ticker";

// Server Component — no "use client", no useState, no useEffect
// Only the <HeroCarousel> child is a client component
export default function Home() {
  const featuredProducts = [
    products.find((p) => p.id === "kashmiri-saffron"),
    products.find((p) => p.id === "acacia-honey"),
    products.find((p) => p.id === "shilajit"),
  ].filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="flex flex-col">
      {/* Hero — client island, everything else is static HTML */}
      <HeroCarousel />

      {/* Trust Signals */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Why Choose Us</h2>
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

      {/* Category Showcase */}
      <ShopByCategory />

      {/* Customer Reviews Ticker */}
      <ReviewTicker />


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
            {featuredProducts.map((product) => {
              const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
              const discountPercent = hasDiscount && product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-pure-ivory mb-4 sm:mb-6 shadow-sm group-hover:shadow-md transition-all">
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="bg-pure-ivory/90 backdrop-blur px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full">Threads</span>
                      </div>
                      {discountPercent && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-saffron-crimson/90 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm backdrop-blur">
                            {discountPercent}% discount · Limited offer
                          </span>
                        </div>
                      )}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-lg sm:text-xl text-ink-charcoal group-hover:text-saffron-crimson transition-colors flex-1 leading-tight">{product.name}</h3>
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <span className="font-mono text-base sm:text-lg font-medium text-ink-charcoal">₹{product.price}</span>
                        {hasDiscount && product.originalPrice && (
                          <span className="text-xs text-deep-taupe line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-deep-taupe mt-2 line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              );
            })}
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
            Saffron is more than just a spice; it&apos;s a labor of love. Each flower produces only three crimson stigmas, which must be hand-picked at dawn before the sun becomes too strong. It takes over 150,000 flowers to produce just one kilogram of our Royal Saffron.
          </p>
          <Link href="/our-story">
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
