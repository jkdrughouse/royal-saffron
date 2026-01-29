import { Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Our Story - Jhelum Kesar Co.",
    description: "Six generations of saffron cultivation by the Jhelum River in Pampore, Kashmir. Discover our heritage and commitment to authentic, hand-harvested saffron.",
};

export default function OurStoryPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-12 sm:py-20 md:py-24 bg-saffron-crimson">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-pure-ivory mb-8 sm:mb-12 flex justify-center">
                        <Award size={56} strokeWidth={1} className="sm:w-16 sm:h-16" />
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-12 sm:mb-16 text-pure-ivory text-center leading-tight">
                        Rooted by the River, Refined by Six Generations
                    </h1>
                </div>
            </section>

            {/* Story Content */}
            <section className="py-16 sm:py-24 md:py-32 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg md:prose-xl mx-auto">
                        <div className="space-y-8 sm:space-y-10">
                            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-ink-charcoal font-light text-center">
                                Jhelum Saffron Co. was born where our history began: on the banks of the Jhelum River, in the heart of Pampore.
                            </p>

                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                                Known to the world as the "Saffron Gateway" of Kashmir, this land is more than just our location—it is our identity. Our name is a tribute to the river that has nourished our ancestral fields for centuries and stands as a silent witness to the unique purple blooms that define our region.
                            </p>

                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                                For us, saffron is not just a spice; it is a sacred tradition. Our story spans six generations of cultivators who have lived the art of saffron farming. From the great-grandfathers who first tilled this soil to the current generation, we have preserved the delicate, labor-intensive methods of hand-harvesting that ensure true potency.
                            </p>

                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                                We do not simply source saffron; we have lived its cultivation for over a century. Today, we honor that legacy by bridging the gap between our history and your home, ensuring that every thread you receive carries the authentic aroma, color, and purity of a heritage that runs as deep as the Jhelum itself.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-parchment-cream">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 text-ink-charcoal">
                        Experience Our Heritage
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 font-light">
                        Every thread of our saffron carries over a century of tradition and craftsmanship.
                    </p>
                    <Link href="/shop">
                        <Button size="lg" className="bg-saffron-crimson hover:bg-saffron-crimson/90 text-white px-8 sm:px-12 py-6 sm:py-8 text-base sm:text-lg rounded-lg font-medium uppercase tracking-wide">
                            Explore Our Collection
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
