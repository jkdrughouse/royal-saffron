"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "../lib/products";
import { useCart } from "../lib/cart-context";

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState("All");
    const { addItem } = useCart();

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="font-serif text-5xl text-center mb-12">Our Collection</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        onClick={() => setActiveCategory(cat)}
                        className="rounded-full"
                    >
                        {cat}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-square p-6 bg-muted/10 rounded-t-lg">
                            <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <CardContent className="flex-grow pt-6">
                            <h3 className="font-serif text-xl mb-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t p-6 bg-muted/5">
                            <span className="font-mono text-lg font-medium">₹{product.price}</span>
                            <Button onClick={() => addItem(product)} size="sm" className="gap-2">
                                <ShoppingCart className="w-4 h-4" /> Add
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
