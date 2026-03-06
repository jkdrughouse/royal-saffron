"use client";

import React from "react";
import Link from "next/link";

const reviews = [
    {
        name: "Amit B.",
        initial: "A",
        title: "Pure & Authentic! ❤️",
        text: "The saffron threads are deep red with an incredible aroma. You can tell it's genuine Kashmiri kesar. My milk turned golden in seconds!",
        stars: 5,
        emoji: "❤️",
        productId: "kashmiri-saffron",
    },
    {
        name: "Priya S.",
        initial: "P",
        title: "Best Kesar I've Found 🔥",
        text: "I've tried many brands but Jhelum Kesar Co. is on another level. The flavor in my biryani was extraordinary. Will never switch!",
        stars: 5,
        emoji: "🔥",
        productId: "kashmiri-saffron",
    },
    {
        name: "Meera J.",
        initial: "M",
        title: "Beautiful Packaging ✨",
        text: "Gifted this to my mother-in-law and she absolutely loved it. The packaging is so elegant and the quality speaks for itself.",
        stars: 5,
        emoji: "✨",
        productId: "saffron-face-wash",
    },
    {
        name: "Vikram S.",
        initial: "V",
        title: "Worth Every Rupee 💯",
        text: "Premium quality saffron at a fair price. The threads are long and aromatic. Perfect for my morning kesar doodh routine.",
        stars: 5,
        emoji: "💯",
        productId: "kashmiri-saffron",
    },
    {
        name: "Deepa N.",
        initial: "D",
        title: "Incredible Aroma 🌸",
        text: "Just opening the box fills the room with the most divine fragrance. Using it in my desserts has been a game-changer!",
        stars: 5,
        emoji: "🌸",
        productId: "saffron-honey",
    },
    {
        name: "Fatima K.",
        initial: "F",
        title: "A Family Favorite ❤️",
        text: "We use this for special occasions — Eid, Diwali, birthdays. The quality is always consistent and the taste is unmatched.",
        stars: 5,
        emoji: "❤️",
        productId: "saffron-honey",
    },
    {
        name: "Rohan M.",
        initial: "R",
        title: "Fast Delivery! 🚀",
        text: "Ordered on Monday, received by Wednesday. Perfectly sealed and fresh. The color payoff in my phirni was stunning.",
        stars: 5,
        emoji: "🚀",
        productId: "kashmiri-saffron",
    },
    {
        name: "Sunita P.",
        initial: "S",
        title: "Skin Care Magic ✨",
        text: "I use this saffron in my face masks and the glow is real! Love that it's pure enough for both cooking and beauty routines.",
        stars: 4,
        emoji: "✨",
        productId: "saffron-face-wash",
    },
];

const StarRating = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`h-4 w-4 ${i < count ? "text-primary" : "text-border"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => (
    <div
        style={{ width: "300px", flexShrink: 0 }}
        className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer"
    >
        <div className="flex items-center justify-between mb-3">
            <StarRating count={review.stars} />
            <span className="text-lg">{review.emoji}</span>
        </div>
        <h3 className="font-serif text-base font-semibold text-foreground mb-2">
            {review.title}
        </h3>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
            &ldquo;{review.text}&rdquo;
        </p>
        <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-sans font-semibold text-sm">
                {review.initial}
            </div>
            <div>
                <p className="font-sans text-sm font-medium text-foreground">{review.name}</p>
                <p className="font-sans text-xs text-primary">✓ Verified Buyer</p>
            </div>
        </div>
    </div>
);

const ReviewsCarousel: React.FC = () => {
    // Duplicate the reviews for seamless infinite loop
    const allCards = [...reviews, ...reviews];

    return (
        <section className="w-full py-16 bg-background">
            <div className="text-center mb-10 px-4">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary mb-2">
                    ✦ What Our Customers Say ✦
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    Loved by <em>thousands</em>
                </h2>
            </div>

            {/* Fade-edge mask + overflow clipping */}
            <div
                className="ticker-outer"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                }}
            >
                <div className="ticker-track">
                    {allCards.map((r, i) => (
                        <Link
                            key={i}
                            href={`/product/${r.productId}#reviews`}
                            style={{ display: "block", flexShrink: 0 }}
                        >
                            <ReviewCard review={r} />
                        </Link>
                    ))}
                </div>
            </div>

            <p className="text-center mt-6 font-sans text-xs text-muted-foreground tracking-wide">
                Hover to pause · {reviews.length} featured reviews
            </p>
        </section>
    );
};

export default ReviewsCarousel;

// Named export alias so existing imports using ReviewTicker still work
export { ReviewsCarousel as ReviewTicker };
