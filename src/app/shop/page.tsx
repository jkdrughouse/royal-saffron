"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "../lib/products";
import { useCart } from "../lib/cart-context";
import { useWishlist } from "../lib/wishlist-context";
import { Heart } from "lucide-react";

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { addItem } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    // Filter products by category and search query
    const filteredProducts = useMemo(() => {
        let filtered = activeCategory === "All"
            ? products
            : products.filter(p => p.category === activeCategory);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.detailedDescription && p.detailedDescription.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [activeCategory, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-8 sm:mb-10 md:mb-12">Our Collection</h1>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products by name, description, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-4 text-base border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-ink-charcoal transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                        Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </p>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        onClick={() => setActiveCategory(cat)}
                        className="rounded-full text-sm px-5 py-3 min-h-[44px]"
                    >
                        {cat}
                    </Button>
                ))}
            </div>
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">No products found matching your search.</p>
                    <Button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} variant="outline">
                        Clear Search
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-lg transition-all relative group">
                            <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                                <div className="aspect-square bg-muted/10 rounded-t-lg cursor-pointer relative overflow-hidden">
                                    <div className="w-full h-full p-6 md:p-8 flex items-center justify-center">
                                        <img src={product.image} className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply" alt={product.name} />
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isInWishlist(product.id)) {
                                                removeFromWishlist(product.id);
                                            } else {
                                                addToWishlist(product);
                                            }
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
                                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                                    </button>
                                </div>
                                <CardContent className="flex-grow pt-6 pb-4 px-6">
                                    <h3 className="font-serif text-xl md:text-2xl mb-3 hover:text-primary transition-colors">{product.name}</h3>
                                    <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                                </CardContent>
                            </Link>
                            <CardFooter className="flex justify-between items-center border-t p-6 bg-muted/5">
                                <span className="font-mono text-xl md:text-2xl font-medium">₹{product.price}</span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product);
                                    }}
                                    size="lg"
                                    className="gap-2 text-base min-h-[44px] px-6"
                                >
                                    <ShoppingCart className="w-5 h-5" /> Add
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
