"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, ProductVariant } from "@/app/lib/products";

interface StickyAddToCartProps {
    product: Product;
    selectedVariant?: ProductVariant | null;
    onAddToCart: () => void;
    onVariantChange?: (variant: ProductVariant) => void;
}

export function StickyAddToCart({
    product,
    selectedVariant,
    onAddToCart,
    onVariantChange,
}: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky cart when user scrolls past 500px
            const shouldShow = window.scrollY > 500;
            setIsVisible(shouldShow && !isDismissed);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDismissed]);

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-16 left-0 right-0 z-45 lg:bottom-0 lg:z-40 transform transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <div className="bg-white border-t shadow-2xl opacity-100">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-3">
                        {/* Product Thumbnail */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted/10">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply p-1"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-sm font-medium text-ink-charcoal truncate">
                                {product.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono text-lg font-bold text-ink-charcoal">
                                    ₹{currentPrice}
                                </span>
                                {product.originalPrice && product.originalPrice > currentPrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Variant Selector (if applicable) */}
                        {product.variants && product.variants.length > 0 && onVariantChange && (
                            <select
                                value={selectedVariant ? `${selectedVariant.weight}-${selectedVariant.price}` : ""}
                                onChange={(e) => {
                                    const [weight, price] = e.target.value.split("-").map(Number);
                                    const variant = product.variants!.find(
                                        (v) => v.weight === weight && v.price === price
                                    );
                                    if (variant) onVariantChange(variant);
                                }}
                                className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-saffron-crimson"
                            >
                                {product.variants.map((variant, index) => (
                                    <option key={index} value={`${variant.weight}-${variant.price}`}>
                                        {variant.weight}{variant.weight === 1 ? 'g' : 'gms'}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Add to Cart Button */}
                        <Button
                            onClick={() => {
                                onAddToCart();
                                setIsDismissed(true);
                            }}
                            size="sm"
                            className="flex-shrink-0 gap-2 bg-saffron-crimson hover:bg-estate-gold text-white px-4"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Add</span>
                        </Button>

                        {/* Dismiss Button */}
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Dismiss sticky cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
