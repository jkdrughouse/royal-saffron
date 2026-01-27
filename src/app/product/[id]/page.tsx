"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products, ProductVariant } from "@/app/lib/products";
import { useCart } from "@/app/lib/cart-context";
import { useWishlist } from "@/app/lib/wishlist-context";
import { ProductReviews } from "@/components/product-reviews";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { StickyAddToCart } from "@/components/sticky-add-to-cart";
import { FrequentlyBoughtTogether } from "@/components/frequently-bought-together";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage() {
    const params = useParams();
    const { addItem } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    const productId = params.id as string;
    const product = products.find(p => p.id === productId);

    // State for selected variant
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product?.variants && product.variants.length > 0 ? product.variants[0] : null
    );

    // State for active tab
    const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');

    // State for current user and review count
    const [currentUserId, setCurrentUserId] = useState<string | undefined>();
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        // Fetch current user
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setCurrentUserId(data.user.id);
                }
            })
            .catch(() => { });

        // Fetch review count
        fetch(`/api/reviews?productId=${productId}`)
            .then(res => res.json())
            .then(data => {
                setReviewCount(data.totalReviews || 0);
            })
            .catch(() => { });
    }, [productId]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
                <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                <Link href="/shop">
                    <Button>Back to Shop</Button>
                </Link>
            </div>
        );
    }

    // Get current price based on selected variant
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;

    const handleAddToCart = () => {
        // Create a product object with the selected variant
        const productToAdd = {
            ...product,
            price: currentPrice,
            originalPrice: currentOriginalPrice,
            selectedVariant: selectedVariant ? `${selectedVariant.weight}${selectedVariant.weight === 1 ? 'g' : 'gms'}` : undefined,
            variantPrice: currentPrice,
        } as any;
        addItem(productToAdd);
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Shop</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Product Image Gallery */}
                {product.images && product.images.length > 0 ? (
                    <ProductImageGallery images={product.images} productName={product.name} />
                ) : (
                    <div className="aspect-square bg-muted/10 rounded-lg p-6 sm:p-8 flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                )}

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <span className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</span>
                    </div>

                    {/* Pain-Point Headline */}
                    {product.painPointHeadline && (
                        <h2 className="font-serif text-xl sm:text-2xl text-saffron-crimson mb-2">
                            {product.painPointHeadline}
                        </h2>
                    )}

                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">{product.name}</h1>

                    {/* Rating Summary */}
                    {product.averageRating && product.reviewCount && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{product.averageRating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                        </div>
                    )}

                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline gap-3">
                            <span className="font-mono text-4xl md:text-5xl font-bold">₹{currentPrice}</span>
                            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                                <>
                                    <span className="text-xl text-muted-foreground line-through">₹{currentOriginalPrice}</span>
                                    <span className="text-sm font-semibold text-primary">
                                        Save ₹{currentOriginalPrice - currentPrice}
                                    </span>
                                </>
                            )}
                        </div>
                        {product.variants && product.variants.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Price range: ₹{product.variants[0].price} – ₹{product.variants[product.variants.length - 1].price}
                            </p>
                        )}
                    </div>

                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6 sm:mb-8">
                            <label className="block font-serif text-lg sm:text-xl mb-3">
                                Weight (Gms)
                            </label>
                            <select
                                value={selectedVariant ? `${selectedVariant.weight}-${selectedVariant.price}` : ''}
                                onChange={(e) => {
                                    const [weight, price] = e.target.value.split('-').map(Number);
                                    const variant = product.variants!.find(v => v.weight === weight && v.price === price);
                                    setSelectedVariant(variant || null);
                                }}
                                className="w-full px-4 py-3 text-base border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                {product.variants.map((variant, index) => (
                                    <option key={index} value={`${variant.weight}-${variant.price}`}>
                                        {variant.weight} {variant.weight === 1 ? 'Gm' : 'Gms'} - ₹{variant.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(product.weightMl || product.sku) && (
                        <div className="mb-6 sm:mb-8 p-4 bg-muted/10 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                {product.weightMl && (
                                    <div>
                                        <span className="text-sm text-muted-foreground">Weight/Volume</span>
                                        <p className="font-medium">{product.weightMl}</p>
                                    </div>
                                )}
                                {product.sku && (
                                    <div>
                                        <span className="text-sm text-muted-foreground">SKU</span>
                                        <p className="font-medium">{product.sku}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Sensory Description */}
                    {product.sensoryDescription && (
                        <div className="mb-6 p-4 bg-gradient-to-br from-[#FFF8F0] to-white rounded-lg border border-saffron-crimson/20">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {product.sensoryDescription}
                            </p>
                        </div>
                    )}

                    {/* Benefits */}
                    {product.benefits && product.benefits.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-serif text-xl md:text-2xl mb-4">Why Choose This Product</h3>
                            <div className="space-y-3">
                                {product.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                                        <div>
                                            <span className="font-medium text-base">{benefit.title}:</span>
                                            <span className="text-base text-muted-foreground ml-1">{benefit.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock & Trust Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {product.stockLevel === 'low-stock' && product.stockCount && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                                <span>⚡</span>
                                Only {product.stockCount} left in stock
                            </div>
                        )}
                        {product.trustBadges && product.trustBadges.map((badge, index) => (
                            <div key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                {badge.replace(/-/g, ' ')}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t flex gap-3">
                        <Button
                            onClick={handleAddToCart}
                            size="lg"
                            className="flex-1 gap-2 text-lg px-8 py-7 min-h-[56px]"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </Button>
                        <Button
                            onClick={() => {
                                if (isInWishlist(product.id)) {
                                    removeFromWishlist(product.id);
                                } else {
                                    addToWishlist(product);
                                }
                            }}
                            variant="outline"
                            size="lg"
                            className="px-6 py-6"
                            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Sticky Add to Cart (Mobile Only) */}
                <StickyAddToCart
                    product={product}
                    selectedVariant={selectedVariant}
                    onAddToCart={handleAddToCart}
                    onVariantChange={setSelectedVariant}
                />

                {/* Frequently Bought Together */}
                {product.frequentlyBoughtWith && product.frequentlyBoughtWith.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <FrequentlyBoughtTogether currentProduct={product} />
                    </div>
                )}

                <div className="mt-12 sm:mt-16">
                    <div className="border-b border-muted">
                        <nav className="flex gap-4 sm:gap-8 -mb-px">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 px-2 sm:px-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'description'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('additional')}
                                className={`pb-4 px-2 sm:px-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'additional'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Additional Information
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 px-2 sm:px-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'reviews'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Reviews ({reviewCount})
                            </button>
                        </nav>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-sm sm:prose-base max-w-none">
                                <div className="text-muted-foreground leading-relaxed">
                                    {product.detailedDescription ? (
                                        <div className="space-y-4">
                                            {product.detailedDescription
                                                .replace(/Description\s+/g, '') // Remove "Description" prefix
                                                .split(/(?=[A-Z][a-z]+:)/) // Split on headings like "Why Choose"
                                                .map((section, sectionIdx) => {
                                                    if (!section.trim()) return null;

                                                    // Check if it's a heading (ends with ? or : and is short)
                                                    if (section.match(/^[A-Z][^.!?]*[?:]$/)) {
                                                        return (
                                                            <div key={sectionIdx} className="mt-6 mb-4">
                                                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4">
                                                                    {section.replace(/[?:]$/, '')}
                                                                </h3>
                                                            </div>
                                                        );
                                                    }

                                                    // Split into paragraphs
                                                    const paragraphs = section.split(/(?=\n|$)/).filter(p => p.trim());
                                                    return (
                                                        <div key={sectionIdx} className="space-y-3">
                                                            {paragraphs.map((paragraph, pIdx) => {
                                                                const trimmed = paragraph.trim();
                                                                if (!trimmed) return null;

                                                                // Check for bullet points (emoji or •)
                                                                if (trimmed.match(/^[🌼🍯🌿☕💋🌸🛡️🚫🥝💚😋✨🍒☀️🥜🧈💪🌰🧠🌱🌹🍫🎁🧼•]/)) {
                                                                    const cleanText = trimmed.replace(/^[🌼🍯🌿☕💋🌸🛡️🚫🥝💚😋✨🍒☀️🥜🧈💪🌰🧠🌱🌹🍫🎁🧼•]\s*/, '');
                                                                    return (
                                                                        <p key={pIdx} className="flex items-start gap-2">
                                                                            <span className="text-primary mt-1">•</span>
                                                                            <span>{cleanText}</span>
                                                                        </p>
                                                                    );
                                                                }

                                                                // Regular paragraph
                                                                return <p key={pIdx} className="mb-3">{trimmed}</p>;
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <p>{product.description}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'additional' && (
                            <div className="space-y-4">
                                <table className="w-full border-collapse">
                                    <tbody className="divide-y divide-muted">
                                        {product.weightMl && (
                                            <tr>
                                                <th className="text-left py-3 px-4 font-semibold text-foreground border-r border-muted w-1/3">
                                                    Weight
                                                </th>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {product.weightMl}
                                                </td>
                                            </tr>
                                        )}
                                        {product.sku && (
                                            <tr>
                                                <th className="text-left py-3 px-4 font-semibold text-foreground border-r border-muted w-1/3">
                                                    SKU
                                                </th>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {product.sku}
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground border-r border-muted w-1/3">
                                                Category
                                            </th>
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {product.category}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ProductReviews productId={productId} currentUserId={currentUserId} />
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16 sm:mt-20">
                    <h2 className="font-serif text-2xl sm:text-3xl mb-8 sm:mb-12 text-center">You May Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products
                            .filter(p => p.category === product.category && p.id !== product.id)
                            .slice(0, 4)
                            .map((relatedProduct) => (
                                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                                    <Card className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="aspect-square p-4 bg-muted/10 rounded-t-lg">
                                            <img
                                                src={relatedProduct.image}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                                alt={relatedProduct.name}
                                            />
                                        </div>
                                        <CardContent className="flex-grow pt-4">
                                            <h3 className="font-serif text-base sm:text-lg mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                            <p className="font-mono text-sm sm:text-base font-medium">₹{relatedProduct.price}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
