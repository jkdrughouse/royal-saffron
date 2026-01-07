"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/lib/cart-context";

export function CartIcon() {
    const { cartCount } = useCart();

    return (
        <Link href="/cart" className="relative text-ink-charcoal hover:text-saffron-crimson transition-colors">
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-saffron-crimson text-pure-ivory text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                </span>
            )}
        </Link>
    );
}
