"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products, ProductVariant } from "@/app/lib/products";
import { useCart } from "@/app/lib/cart-context";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage() {
    const params = useParams();
    const { addItem } = useCart();
    
    const productId = params.id as string;
    const product = products.find(p => p.id === productId);
    
    // State for selected variant
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product?.variants && product.variants.length > 0 ? product.variants[0] : null
    );
    
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
                {/* Product Image */}
                <div className="aspect-square bg-muted/10 rounded-lg p-6 sm:p-8 flex items-center justify-center">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>
                
                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <span className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</span>
                    </div>
                    
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{product.name}</h1>
                    
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline gap-3">
                            <span className="font-mono text-3xl sm:text-4xl font-bold">₹{currentPrice}</span>
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
                                className="w-full sm:w-auto px-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                    
                    <div className="mb-6 sm:mb-8">
                        <h2 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4">Description</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.detailedDescription || product.description}
                        </p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t">
                        <Button 
                            onClick={handleAddToCart}
                            size="lg"
                            className="w-full sm:w-auto gap-2 text-base sm:text-lg px-8 py-6"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </Button>
                    </div>
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
    );
}
