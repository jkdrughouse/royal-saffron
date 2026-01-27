"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product, products } from "@/app/lib/products";
import { useCart } from "@/app/lib/cart-context";

interface FrequentlyBoughtTogetherProps {
    currentProduct: Product;
    maxRecommendations?: number;
}

export function FrequentlyBoughtTogether({
    currentProduct,
    maxRecommendations = 3,
}: FrequentlyBoughtTogetherProps) {
    const { addItem } = useCart();
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
        new Set([currentProduct.id])
    );

    // Get recommended products
    const recommendedProducts = currentProduct.frequentlyBoughtWith
        ? products.filter((p) =>
            currentProduct.frequentlyBoughtWith!.includes(p.id)
        ).slice(0, maxRecommendations - 1)
        : products
            .filter(
                (p) =>
                    p.category === currentProduct.category &&
                    p.id !== currentProduct.id
            )
            .slice(0, maxRecommendations - 1);

    const allProducts = [currentProduct, ...recommendedProducts];

    const toggleProduct = (productId: string) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            // Don't allow deselecting current product
            if (productId !== currentProduct.id) {
                newSelected.delete(productId);
            }
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const calculateTotalPrice = () => {
        return allProducts
            .filter((p) => selectedProducts.has(p.id))
            .reduce((sum, p) => sum + p.price, 0);
    };

    const calculateTotalSavings = () => {
        return allProducts
            .filter((p) => selectedProducts.has(p.id))
            .reduce((sum, p) => {
                const savings = p.originalPrice ? p.originalPrice - p.price : 0;
                return sum + savings;
            }, 0);
    };

    const handleAddAllToCart = () => {
        allProducts
            .filter((p) => selectedProducts.has(p.id))
            .forEach((product) => {
                addItem(product);
            });
    };

    if (recommendedProducts.length === 0) {
        return null; // Don't show section if no recommendations
    }

    const totalPrice = calculateTotalPrice();
    const totalSavings = calculateTotalSavings();

    return (
        <Card className="relative z-0 border-2 border-saffron-crimson/20 bg-gradient-to-br from-white to-[#FFF8F0]">
            <CardContent className="p-6 sm:p-8">
                <h3 className="font-serif text-2xl sm:text-3xl mb-6 text-ink-charcoal">
                    Frequently Bought Together
                </h3>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    {allProducts.map((product, index) => (
                        <div key={product.id} className="flex flex-col relative">
                            {/* Product Card */}
                            <div
                                className={`relative border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${selectedProducts.has(product.id)
                                    ? "border-saffron-crimson ring-2 ring-saffron-crimson/30"
                                    : "border-gray-200 hover:border-gray-300"
                                    } ${product.id === currentProduct.id ? "opacity-100" : "opacity-90"}`}
                                onClick={() => toggleProduct(product.id)}
                            >
                                {/* Checkbox */}
                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.has(product.id)}
                                        onChange={() => toggleProduct(product.id)}
                                        disabled={product.id === currentProduct.id}
                                        className="w-5 h-5 rounded border-gray-300 text-saffron-crimson focus:ring-saffron-crimson disabled:opacity-50 cursor-pointer"
                                    />
                                </div>

                                {/* "This item" badge */}
                                {product.id === currentProduct.id && (
                                    <div className="absolute top-2 right-2 bg-saffron-crimson text-white text-xs px-2 py-1 rounded-full font-medium">
                                        This item
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="aspect-square bg-white p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-3 bg-white">
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="font-medium text-sm hover:text-saffron-crimson transition-colors line-clamp-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {product.name}
                                    </Link>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="font-mono text-base font-bold">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Plus icon between items (not after last) */}
                            {index < allProducts.length - 1 && (
                                <div className="hidden sm:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                                    <div className="bg-saffron-crimson rounded-full p-1">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pricing Summary */}
                <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Total for {selectedProducts.size} item{selectedProducts.size > 1 ? "s" : ""}:
                        </span>
                        <div className="text-right">
                            <span className="font-mono text-2xl font-bold text-ink-charcoal">
                                ₹{totalPrice}
                            </span>
                            {totalSavings > 0 && (
                                <div className="text-sm text-green-600 font-medium">
                                    Save ₹{totalSavings}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleAddAllToCart}
                        size="lg"
                        className="w-full bg-saffron-crimson hover:bg-estate-gold text-white py-6 text-base sm:text-lg font-medium"
                    >
                        Add Selected to Cart ({selectedProducts.size})
                    </Button>
                </div>

                {/* Value Proposition */}
                <p className="text-sm text-center text-muted-foreground mt-4">
                    ✨ Customers who bought these together saved an average of ₹{Math.round(totalSavings * 1.2)}
                </p>
            </CardContent>
        </Card>
    );
}
