"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './products';

type CartItem = Product & { 
    quantity: number;
    selectedVariant?: string; // e.g., "1g", "2gms", "250g"
    variantPrice?: number; // price for the selected variant
    unit?: string; // unit for display (e.g., "g", "gms")
};

type CartContextType = {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string, variant?: string) => void;
    updateQuantity: (productId: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Hydrate from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product) => {
        setItems(current => {
            const variantKey = (product as any).selectedVariant || undefined;
            const variantPrice = (product as any).variantPrice || product.price;
            
            const existing = current.find(item => 
                item.id === product.id && 
                item.selectedVariant === variantKey
            );
            if (existing) {
                return current.map(item => 
                    item.id === product.id && item.selectedVariant === variantKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { 
                ...product, 
                quantity: 1, 
                selectedVariant: variantKey,
                variantPrice: variantPrice,
                price: variantPrice, // Use variant price
                unit: variantKey ? (variantKey.includes('gms') ? 'gms' : 'g') : undefined
            }];
        });
    };

    const removeItem = (productId: string, variant?: string) => {
        setItems(current => current.filter(item => 
            !(item.id === productId && (variant === undefined || item.selectedVariant === variant))
        ));
    };

    const updateQuantity = (productId: string, quantity: number, variant?: string) => {
        if (quantity <= 0) {
            removeItem(productId, variant);
            return;
        }
        setItems(current => current.map(item =>
            item.id === productId && item.selectedVariant === variant
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
