"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Search, X, LayoutGrid, Grid2x2, Grid3x3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "../lib/products";
import { useCart } from "../lib/cart-context";
import { useWishlist } from "../lib/wishlist-context";
import { Heart } from "lucide-react";

type GridSize = 2 | 3 | 4 | 5;

const GRID_CLASSES: Record<GridSize, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

function ShopContent() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [gridSize, setGridSize] = useState<GridSize>(3);

    // Load saved grid preference
    useEffect(() => {
        const saved = localStorage.getItem("shop-grid-size");
        if (saved && [2, 3, 4, 5].includes(Number(saved))) {
            setGridSize(Number(saved) as GridSize);
        }
    }, []);

    // Pre-select category from ?category= query param
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    const { addItem } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    const changeGrid = (size: GridSize) => {
        setGridSize(size);
        localStorage.setItem("shop-grid-size", String(size));
    };

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    // Filter products
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

    // Compact card for 4/5 column grids
    const isCompact = gridSize >= 4;

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

            {/* Category Filters + Grid Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10 md:mb-12">
                <div className="flex flex-wrap gap-2 sm:gap-3">
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

                {/* Grid size controls — hidden on mobile (always 2 cols there) */}
                <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                    <span className="text-xs text-muted-foreground px-2">View</span>
                    {([2, 3, 4, 5] as GridSize[]).map((size) => (
                        <button
                            key={size}
                            onClick={() => changeGrid(size)}
                            title={`${size} columns`}
                            className={`flex items-center justify-center w-8 h-8 rounded text-xs font-semibold transition-colors ${gridSize === size
                                    ? "bg-saffron-crimson text-white"
                                    : "text-muted-foreground hover:bg-muted/50"
                                }`}
                        >
                            {size}×
                        </button>
                    ))}
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">No products found matching your search.</p>
                    <Button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} variant="outline">
                        Clear Search
                    </Button>
                </div>
            ) : (
                <div className={`grid gap-4 md:gap-6 ${GRID_CLASSES[gridSize]}`}>
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-lg transition-all relative group">
                            <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                                <div className={`aspect-square bg-muted/10 rounded-t-lg cursor-pointer relative overflow-hidden`}>
                                    <div className={`w-full h-full ${isCompact ? 'p-3' : 'p-6 md:p-8'} flex items-center justify-center`}>
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
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
                                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                                    </button>
                                </div>
                                <CardContent className={`flex-grow ${isCompact ? 'pt-3 pb-2 px-3' : 'pt-6 pb-4 px-6'}`}>
                                    <h3 className={`font-serif ${isCompact ? 'text-base mb-1' : 'text-xl md:text-2xl mb-3'} hover:text-primary transition-colors`}>{product.name}</h3>
                                    {!isCompact && (
                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                                    )}
                                </CardContent>
                            </Link>
                            <CardFooter className={`flex justify-between items-center border-t ${isCompact ? 'p-3' : 'p-6'} bg-muted/5`}>
                                <span className={`font-mono ${isCompact ? 'text-base' : 'text-xl md:text-2xl'} font-medium`}>₹{product.price}</span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product);
                                    }}
                                    size={isCompact ? "sm" : "lg"}
                                    className={`gap-1 ${isCompact ? 'text-xs px-3 min-h-[36px]' : 'text-base min-h-[44px] px-6'}`}
                                >
                                    <ShoppingCart className={isCompact ? 'w-3.5 h-3.5' : 'w-5 h-5'} /> {isCompact ? '' : 'Add'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// Suspense wrapper required by Next.js App Router for any component using useSearchParams()
export default function Shop() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Loading collection…</div>}>
            <ShopContent />
        </Suspense>
    );
}
