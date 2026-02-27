"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ShoppingCart, Search, X, SlidersHorizontal, ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "../lib/products";
import { useCart } from "../lib/cart-context";
import { useWishlist } from "../lib/wishlist-context";
import { Heart } from "lucide-react";

type GridSize = 2 | 3 | 4 | 5;
type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "rating";

const GRID_CLASSES: Record<GridSize, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "rating", label: "Top Rated" },
];

const ALL_PRICES = products.map((p) => p.price);
const PRICE_MIN = Math.min(...ALL_PRICES);
const PRICE_MAX = Math.max(...ALL_PRICES);

function ShopContent() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [gridSize, setGridSize] = useState<GridSize>(3);
    const [sortBy, setSortBy] = useState<SortOption>("featured");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("shop-grid-size");
        if (saved && [2, 3, 4, 5].includes(Number(saved))) {
            setGridSize(Number(saved) as GridSize);
        }
    }, []);

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

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

    const hasActiveFilters =
        activeCategory !== "All" ||
        searchQuery.trim() !== "" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        sortBy !== "featured";

    const clearAllFilters = () => {
        setActiveCategory("All");
        setSearchQuery("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("featured");
    };

    const filteredProducts = useMemo(() => {
        let filtered =
            activeCategory === "All"
                ? products
                : products.filter((p) => p.category === activeCategory);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query) ||
                    (p.detailedDescription && p.detailedDescription.toLowerCase().includes(query))
            );
        }

        const min = minPrice !== "" ? parseFloat(minPrice) : null;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : null;
        if (min !== null) filtered = filtered.filter((p) => p.price >= min);
        if (max !== null) filtered = filtered.filter((p) => p.price <= max);

        const sorted = [...filtered];
        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "rating":
                sorted.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
                break;
        }

        return sorted;
    }, [activeCategory, searchQuery, sortBy, minPrice, maxPrice]);

    const isCompact = gridSize >= 4;
    const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-8 sm:mb-10 md:mb-12">
                Our Collection
            </h1>

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
                        Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} matching &quot;{searchQuery}&quot;
                    </p>
                )}
            </div>

            {/* Category Filters + Controls row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
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

                <div className="flex items-center gap-2">
                    {/* Filters toggle */}
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${showFilters
                                ? "bg-saffron-crimson text-white border-saffron-crimson"
                                : "border-gray-200 text-ink-charcoal hover:bg-muted"
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {(minPrice || maxPrice) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron-crimson ml-0.5" />
                        )}
                    </button>

                    {/* Sort By dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu((v) => !v)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-ink-charcoal hover:bg-muted transition-colors"
                        >
                            {activeSortLabel}
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showSortMenu && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-soft-silk-border rounded-xl shadow-lg z-30 overflow-hidden">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSortBy(opt.value);
                                            setShowSortMenu(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value
                                                ? "bg-saffron-crimson/10 text-saffron-crimson font-medium"
                                                : "text-ink-charcoal hover:bg-muted"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Grid size controls */}
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
            </div>

            {/* Price Filter Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white border border-soft-silk-border rounded-xl shadow-sm flex flex-wrap items-center gap-4">
                    <p className="text-sm font-medium text-ink-charcoal">Price Range (₹)</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder={`Min (${PRICE_MIN})`}
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-28 px-3 py-2 text-sm border border-soft-silk-border rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-crimson"
                        />
                        <span className="text-deep-taupe text-sm">—</span>
                        <input
                            type="number"
                            placeholder={`Max (${PRICE_MAX})`}
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-28 px-3 py-2 text-sm border border-soft-silk-border rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-crimson"
                        />
                    </div>
                    {/* Quick presets */}
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { label: "Under ₹500", min: "", max: "500" },
                            { label: "₹500–₹1000", min: "500", max: "1000" },
                            { label: "₹1000–₹2000", min: "1000", max: "2000" },
                            { label: "₹2000+", min: "2000", max: "" },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => {
                                    setMinPrice(preset.min);
                                    setMaxPrice(preset.max);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${minPrice === preset.min && maxPrice === preset.max
                                        ? "bg-saffron-crimson text-white border-saffron-crimson"
                                        : "border-soft-silk-border text-ink-charcoal hover:bg-muted"
                                    }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    {(minPrice || maxPrice) && (
                        <button
                            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                            className="text-xs text-saffron-crimson hover:underline"
                        >
                            Clear price
                        </button>
                    )}
                </div>
            )}

            {/* Active filter summary */}
            {hasActiveFilters && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <p className="text-sm text-deep-taupe">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                    </p>
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-saffron-crimson border border-saffron-crimson/30 rounded-full px-3 py-1 hover:bg-saffron-crimson/5 transition-colors"
                    >
                        ✕ Clear all filters
                    </button>
                </div>
            )}

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
                    <Button onClick={clearAllFilters} variant="outline">
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className={`grid gap-4 md:gap-6 ${GRID_CLASSES[gridSize]}`}>
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-lg transition-all relative group">
                            <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                                <div className={`aspect-square bg-muted/10 rounded-t-lg cursor-pointer relative overflow-hidden`}>
                                    <div className={`w-full h-full ${isCompact ? "p-3" : "p-6 md:p-8"} flex items-center justify-center`}>
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
                                        <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
                                    </button>
                                </div>
                                <CardContent className={`flex-grow ${isCompact ? "pt-3 pb-2 px-3" : "pt-6 pb-4 px-6"}`}>
                                    <h3 className={`font-serif ${isCompact ? "text-base mb-1" : "text-xl md:text-2xl mb-3"} hover:text-primary transition-colors`}>{product.name}</h3>
                                    {!isCompact && (
                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                                    )}
                                </CardContent>
                            </Link>
                            <CardFooter className={`flex justify-between items-center border-t ${isCompact ? "p-3" : "p-6"} bg-muted/5`}>
                                <span className={`font-mono ${isCompact ? "text-base" : "text-xl md:text-2xl"} font-medium`}>₹{product.price}</span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product);
                                    }}
                                    size={isCompact ? "sm" : "lg"}
                                    className={`gap-1 ${isCompact ? "text-xs px-3 min-h-[36px]" : "text-base min-h-[44px] px-6"}`}
                                >
                                    <ShoppingCart className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} /> {isCompact ? "" : "Add"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Close sort menu on outside click */}
            {showSortMenu && (
                <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)} />
            )}
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Loading collection…</div>}>
            <ShopContent />
        </Suspense>
    );
}
