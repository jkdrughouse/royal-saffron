"use client";

import { useWishlist } from "../lib/wishlist-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../lib/cart-context";
import Link from "next/link";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="font-serif text-2xl sm:text-3xl mb-4">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start adding products you love to your wishlist!
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearWishlist} size="sm">
            Clear All
          </Button>
          <Link href="/shop">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {items.map((product) => (
          <Card key={product.id} className="flex flex-col h-full border-muted/20 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/product/${product.id}`} className="flex flex-col h-full">
              <div className="aspect-square p-4 sm:p-6 bg-muted/10 rounded-t-lg cursor-pointer relative group">
                <img
                  src={product.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt={product.name}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                </button>
              </div>
              <CardContent className="flex-grow pt-4 sm:pt-6">
                <h3 className="font-serif text-lg sm:text-xl mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
            </Link>
            <CardFooter className="flex justify-between items-center border-t p-4 sm:p-6 bg-muted/5">
              <span className="font-mono text-base sm:text-lg font-medium">₹{product.price}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    removeItem(product.id);
                  }}
                  variant="ghost"
                  className="p-2"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
