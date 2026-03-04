"use client";

import { useState, useEffect } from "react";

const EMOJIS = [
    { emoji: "👍", label: "Helpful" },
    { emoji: "❤️", label: "Love it" },
    { emoji: "🔥", label: "Fire" },
    { emoji: "🌟", label: "Amazing" },
    { emoji: "😍", label: "Obsessed" },
];

interface ReviewReactionsProps {
    reviewId: string;
    initialReactions?: Record<string, number>;
}

export function ReviewReactions({ reviewId, initialReactions = {} }: ReviewReactionsProps) {
    const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
    const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
    const [animating, setAnimating] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    // Load user's previous reactions from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`reactions_${reviewId}`);
            if (stored) setMyReactions(new Set(JSON.parse(stored)));
        } catch { }
    }, [reviewId]);

    const handleReact = async (emoji: string) => {
        if (myReactions.has(emoji) || loading) return;

        // Optimistic update
        setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
        setMyReactions((prev) => new Set([...prev, emoji]));
        setAnimating(emoji);
        setLoading(emoji);

        // Animate bump
        setTimeout(() => setAnimating(null), 400);

        // Save to localStorage
        const updated = new Set([...myReactions, emoji]);
        localStorage.setItem(`reactions_${reviewId}`, JSON.stringify([...updated]));

        try {
            const res = await fetch(`/api/reviews/${reviewId}/react`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emoji }),
            });
            if (res.ok) {
                const data = await res.json();
                setReactions(data.reactions);
            }
        } catch {
            // Keep optimistic state — backend will sync eventually
        } finally {
            setLoading(null);
        }
    };

    const total = Object.values(reactions).reduce((s, c) => s + c, 0);

    return (
        <div className="mt-3 pt-3 border-t border-soft-silk-border">
            <p className="text-[11px] text-deep-taupe uppercase tracking-widest mb-2 font-medium">
                Was this helpful?
            </p>
            <div className="flex flex-wrap gap-2">
                {EMOJIS.map(({ emoji, label }) => {
                    const count = reactions[emoji] || 0;
                    const reacted = myReactions.has(emoji);
                    const bumping = animating === emoji;

                    return (
                        <button
                            key={emoji}
                            onClick={() => handleReact(emoji)}
                            title={label}
                            disabled={reacted || !!loading}
                            aria-label={`React with ${label}${count ? ` (${count})` : ""}`}
                            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                border transition-all duration-200 select-none
                ${reacted
                                    ? "bg-amber-50 border-amber-300 text-amber-800 cursor-default"
                                    : "bg-white border-soft-silk-border text-ink-charcoal hover:border-saffron-crimson hover:bg-red-50 active:scale-95 cursor-pointer"
                                }
                ${bumping ? "scale-125" : "scale-100"}
              `}
                            style={{
                                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.15s, border-color 0.15s",
                            }}
                        >
                            <span className="text-base leading-none">{emoji}</span>
                            {count > 0 && (
                                <span className="text-xs font-semibold tabular-nums">{count}</span>
                            )}
                        </button>
                    );
                })}
            </div>
            {total > 0 && (
                <p className="text-[11px] text-deep-taupe mt-2">
                    {total} {total === 1 ? "person found" : "people found"} this review helpful
                </p>
            )}
        </div>
    );
}
