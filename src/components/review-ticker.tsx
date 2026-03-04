// Server component — zero JS bundle impact
import { DB } from "@/app/lib/db";

interface FeaturedReview {
    id: string;
    userName: string;
    rating: number;
    title?: string;
    comment: string;
    productId: string;
    verified?: boolean;
    reactions?: Record<string, number>;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    viewBox="0 0 20 20"
                    fill={star <= rating ? "#C03221" : "none"}
                    stroke={star <= rating ? "#C03221" : "#D4C5B9"}
                    strokeWidth="1.5"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: FeaturedReview }) {
    // First name + last initial only for privacy
    const nameParts = review.userName.split(" ");
    const displayName =
        nameParts.length > 1
            ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
            : nameParts[0];

    // Truncate comment to 130 chars
    const snippet =
        review.comment.length > 130
            ? review.comment.slice(0, 127) + "…"
            : review.comment;

    // Top emoji reaction
    const topEmoji = review.reactions
        ? Object.entries(review.reactions).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;

    return (
        <article
            className="
        ticker-card flex-shrink-0 w-72 sm:w-80
        bg-pure-ivory border border-[#E8E1D6]
        rounded-2xl p-5
        shadow-[0_2px_8px_0_rgba(44,22,10,0.08),0_1px_2px_0_rgba(44,22,10,0.05)]
        hover:shadow-[0_8px_24px_0_rgba(44,22,10,0.14),0_2px_6px_0_rgba(44,22,10,0.08)]
        transition-shadow duration-300
        relative overflow-hidden
      "
            aria-label={`Review by ${displayName}`}
        >
            {/* Subtle warm gradient top-right accent */}
            <div
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, #C03221 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            {/* Top row: stars + optional emoji badge */}
            <div className="flex items-center justify-between mb-2">
                <StarRating rating={review.rating} />
                {topEmoji && (
                    <span className="text-lg leading-none" title="Most popular reaction" aria-hidden="true">
                        {topEmoji}
                    </span>
                )}
            </div>

            {/* Title */}
            {review.title && (
                <p className="font-serif text-sm font-semibold text-ink-charcoal mb-1 leading-snug">
                    {review.title}
                </p>
            )}

            {/* Snippet */}
            <p className="text-xs text-deep-taupe leading-relaxed mb-3 font-light">
                &ldquo;{snippet}&rdquo;
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#EDE7DC] pt-2.5">
                <div className="flex items-center gap-1.5">
                    {/* Avatar circle */}
                    <div className="w-6 h-6 rounded-full bg-saffron-crimson/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-saffron-crimson uppercase">
                            {review.userName[0]}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-ink-charcoal">{displayName}</span>
                </div>
                {review.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5" aria-hidden="true">
                            <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm2.78 4.28l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 1.06z" />
                        </svg>
                        Verified
                    </span>
                )}
            </div>
        </article>
    );
}

export async function ReviewTicker() {
    let reviews: FeaturedReview[] = [];
    try {
        reviews = await DB.featuredReviews();
    } catch {
        // If DB is unavailable, render nothing — no error thrown to user
        reviews = [];
    }

    if (reviews.length === 0) return null;

    // Duplicate list for seamless infinite loop (CSS animates -50%)
    const doubled = [...reviews, ...reviews];

    return (
        <section className="py-10 sm:py-14 bg-[#FAF7F2] border-y border-[#EDE7DC]" aria-label="Customer Reviews">
            <div className="mb-5 px-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-saffron-crimson font-bold mb-1">
                    ✦ What our customers say ✦
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal">
                    Loved by <span className="italic font-light">thousands</span>
                </h2>
            </div>

            <div className="ticker-outer" role="region" aria-label="Scrolling customer reviews">
                <div className="ticker-track px-4">
                    {doubled.map((review, i) => (
                        <ReviewCard key={`${review.id}-${i}`} review={review} />
                    ))}
                </div>
            </div>

            <p className="text-[11px] text-deep-taupe text-center mt-4 font-light">
                Hover to pause • {reviews.length} featured reviews
            </p>
        </section>
    );
}
