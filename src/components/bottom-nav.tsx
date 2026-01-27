"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/lib/cart-context";

export function BottomNav() {
    const pathname = usePathname();
    const { items } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/shop", icon: ShoppingBag, label: "Shop" },
        { href: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
        { href: "/account", icon: User, label: "Account" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-border shadow-lg safe-area-inset-bottom">
            <div className="grid grid-cols-4 h-16 w-full max-w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${active
                                ? "text-saffron-crimson"
                                : "text-muted-foreground hover:text-saffron-crimson"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-saffron-crimson text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>
                                {item.label}
                            </span>
                            {active && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-saffron-crimson rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
