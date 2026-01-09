"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "../lib/products";
import { useCart } from "../lib/cart-context";

export default function CategoriesPage() {
    const { addItem } = useCart();
    
    // Get all unique categories
    const categories = Array.from(new Set(products.map(p => p.category))).sort();
    
    // Group products by category
    const productsByCategory = categories.reduce((acc, category) => {
        acc[category] = products.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, typeof products>);
    
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-8 sm:mb-10 md:mb-12">
                Shop by Category
            </h1>
            
            <div className="space-y-16 sm:space-y-20">
                {categories.map((category) => (
                    <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                        <div className="mb-8 sm:mb-12">
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2">{category}</h2>
                            <p className="text-muted-foreground">
                                {productsByCategory[category].length} {productsByCategory[category].length === 1 ? 'product' : 'products'}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {productsByCategory[category].map((product) => (
                                <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-md transition-shadow">
                                    <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                                        <div className="aspect-square p-4 sm:p-6 bg-muted/10 rounded-t-lg cursor-pointer">
                                            <img 
                                                src={product.image} 
                                                className="w-full h-full object-contain mix-blend-multiply" 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <CardContent className="flex-grow pt-4 sm:pt-6">
                                            <h3 className="font-serif text-lg sm:text-xl mb-2 hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.weightMl && (
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {product.weightMl}
                                                </p>
                                            )}
                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>
                                        </CardContent>
                                    </Link>
                                    <CardFooter className="flex justify-between items-center border-t p-4 sm:p-6 bg-muted/5">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-base sm:text-lg font-medium">₹{product.price}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <Button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addItem(product);
                                            }} 
                                            size="sm" 
                                            className="gap-2 text-xs sm:text-sm"
                                        >
                                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> Add
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
