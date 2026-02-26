import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    SaffronIcon, BeautyIcon, DryFruitsIcon, FoodIcon, TeaIcon,
    HoneyIcon, OilsIcon, SpicesIcon, FragranceIcon, KashmiriSpecialIcon,
} from "@/components/icons/CategoryIcons";
import { useIsMobile } from "@/hooks/use-mobile";

// slug must exactly match the category string used in products.ts
const categories = [
    { name: "Saffron", slug: "Saffron", Icon: SaffronIcon },
    { name: "Beauty", slug: "Beauty", Icon: BeautyIcon },
    { name: "Dry Fruits", slug: "Nuts", Icon: DryFruitsIcon },
    { name: "Food", slug: "Food", Icon: FoodIcon },
    { name: "Tea", slug: "Tea", Icon: TeaIcon },
    { name: "Honey", slug: "Honey", Icon: HoneyIcon },
    { name: "Oils", slug: "Oils", Icon: OilsIcon },
    { name: "Spices", slug: "Spices", Icon: SpicesIcon },
    { name: "Fragrance", slug: "Fragrance", Icon: FragranceIcon },
    { name: "Kashmiri Special", slug: "Kashmiri Special", Icon: KashmiriSpecialIcon },
];

const ShopByCategory: React.FC = () => {
    const isMobile = useIsMobile();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start", loop: false, slidesToScroll: 2, containScroll: "trimSnaps",
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-saffron-heading tracking-tight">
                        Shop by Category
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-3">
                        <span className="block w-10 h-px bg-saffron-primary/40" />
                        <span className="block w-2 h-2 rounded-full bg-saffron-primary/60" />
                        <span className="block w-10 h-px bg-saffron-primary/40" />
                    </div>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground">
                        Discover our curated collection of Kashmir&apos;s finest
                    </p>
                </div>

                <div className="relative">
                    {!isMobile && (
                        <>
                            <button
                                onClick={() => emblaApi?.scrollPrev()}
                                disabled={!canScrollPrev}
                                className={cn(
                                    "absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-saffron-primary/30 bg-background flex items-center justify-center transition-all duration-200",
                                    canScrollPrev ? "hover:bg-saffron-primary/10 hover:border-saffron-primary/60 text-saffron-primary" : "opacity-30 cursor-not-allowed text-muted-foreground"
                                )}
                                aria-label="Previous categories"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => emblaApi?.scrollNext()}
                                disabled={!canScrollNext}
                                className={cn(
                                    "absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-saffron-primary/30 bg-background flex items-center justify-center transition-all duration-200",
                                    canScrollNext ? "hover:bg-saffron-primary/10 hover:border-saffron-primary/60 text-saffron-primary" : "opacity-30 cursor-not-allowed text-muted-foreground"
                                )}
                                aria-label="Next categories"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <div ref={emblaRef} className="overflow-hidden mx-2 md:mx-8">
                        <div className="flex">
                            {categories.map(({ name, slug, Icon }) => (
                                <div key={name} className="flex-shrink-0 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[16.666%] px-2 md:px-3">
                                    <Link
                                        href={`/shop?category=${encodeURIComponent(slug)}`}
                                        className="group flex flex-col items-center w-full py-2 focus:outline-none"
                                    >
                                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-saffron-cream border-2 border-saffron-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-saffron-primary/15 group-hover:border-saffron-primary/50">
                                            <Icon className="w-10 h-10 md:w-12 md:h-12 text-saffron-icon transition-colors duration-300 group-hover:text-saffron-primary" />
                                        </div>
                                        <span className="mt-3 text-xs md:text-sm font-medium text-saffron-heading/80 group-hover:text-saffron-primary transition-colors duration-200 text-center leading-tight">
                                            {name}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isMobile && (
                    <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
                        Swipe to explore →
                    </p>
                )}
            </div>
        </section>
    );
};

export default ShopByCategory;
