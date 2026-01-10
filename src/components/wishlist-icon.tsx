"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/app/lib/wishlist-context";

export function WishlistIcon() {
  const { items } = useWishlist();
  const count = items.length;

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center p-2 rounded-full hover:bg-muted/50 transition-colors"
      aria-label={`Wishlist (${count} items)`}
    >
      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" fill={count > 0 ? "currentColor" : "none"} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
