"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './products';

type CartItem = Product & { 
    quantity: number;
    selectedVariant?: number;
    unit?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (product: Product, variant?: number, unit?: string) => void;
    removeItem: (productId: string, variant?: number) => void;
    updateQuantity: (productId: string, quantity: number, variant?: number) => void;
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

    const addItem = (product: Product, variant?: number, unit?: string) => {
        setItems(current => {
            const existing = current.find(item => 
                item.id === product.id && 
                item.selectedVariant === variant
            );
            if (existing) {
                return current.map(item =>
                    item.id === product.id && item.selectedVariant === variant
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...product, quantity: 1, selectedVariant: variant, unit }];
        });
    };

    const removeItem = (productId: string, variant?: number) => {
        setItems(current => current.filter(item => 
            !(item.id === productId && item.selectedVariant === variant)
        ));
    };

    const updateQuantity = (productId: string, quantity: number, variant?: number) => {
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
