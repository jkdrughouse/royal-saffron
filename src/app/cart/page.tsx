"use client";

import { Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../lib/cart-context";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { sendOrderViaWhatsApp } from "../lib/whatsapp";

export default function Cart() {
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
        if (!formData.phone.trim()) errors.phone = "Phone is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) errors.phone = "Invalid phone number";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Invalid pincode";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = () => {
        if (!showCheckoutForm) {
            setShowCheckoutForm(true);
            return;
        }
        
        if (!validateForm()) {
            return;
        }

        setIsCheckingOut(true);
        
        // Generate order ID
        const orderId = `JK${Date.now()}`;
        
        // Send order via WhatsApp if phone number is provided
        if (formData.phone) {
            sendOrderViaWhatsApp({
                customerPhone: formData.phone,
                orderId: orderId,
                items: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: cartTotal + (cartTotal >= 1000 ? 0 : 50),
                customerName: formData.name
            });
        }
        
        setTimeout(() => {
            clearCart();
            setShowCheckoutForm(false);
            setFormData({ name: "", email: "", phone: "", address: "", city: "", pincode: "" });
            alert("Order placed successfully! We'll contact you soon for payment confirmation.");
            setIsCheckingOut(false);
        }, 2000);
    };

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;
        
        const orderId = `JK${Date.now()}`;
        const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919876543210";
        
        let message = `🎉 New Order - Jhelum Kesar Co.\n\n`;
        message += `Order ID: ${orderId}\n\n`;
        message += `Items:\n`;
        
        items.forEach(item => {
            message += `• ${item.name}${item.selectedVariant ? ` (${item.selectedVariant}${item.unit || 'g'})` : ''} x${item.quantity} - ₹${item.price * item.quantity}\n`;
        });
        
        const shipping = cartTotal >= 1000 ? 0 : 50;
        const total = cartTotal + shipping;
        
        message += `\nSubtotal: ₹${cartTotal.toFixed(2)}`;
        message += `\nShipping: ₹${shipping.toFixed(2)}`;
        message += `\nTotal: ₹${total.toFixed(2)}`;
        message += `\n\nPlease confirm this order.`;
        
        const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (items.length === 0 && !isCheckingOut) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h2 className="font-serif text-3xl mb-4">Your cart is empty</h2>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
                <h1 className="font-serif text-4xl mb-8">Shopping Cart</h1>
                {items.map((item) => (
                    <Card key={`${item.id}-${item.selectedVariant || 'default'}`} className="flex gap-6 p-6 items-center">
                        <Link href={`/products/${item.id}`} className="h-24 w-24 bg-muted/20 rounded-md p-2 flex-shrink-0 hover:opacity-80 transition-opacity">
                            <img src={item.image} className="h-full w-full object-contain mix-blend-multiply" alt={item.name} />
                        </Link>
                        <div className="flex-1">
                            <Link href={`/products/${item.id}`}>
                                <h3 className="font-serif text-lg hover:text-saffron-crimson transition-colors">{item.name}</h3>
                            </Link>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                {item.selectedVariant && (
                                    <span>Size: {item.selectedVariant} {item.unit || 'g'}</span>
                                )}
                                <span>Price: ₹{item.price}</span>
                            </div>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-sm text-muted-foreground">Quantity:</span>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-medium mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                            <button
                                onClick={() => removeItem(item.id, item.selectedVariant)}
                                className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm ml-auto"
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="h-fit sticky top-24">
                <Card className="p-6">
                    <h3 className="font-serif text-2xl mb-6">Summary</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span>{cartTotal >= 1000 ? "Free" : "₹50"}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between text-lg font-medium">
                            <span>Total</span>
                            <span>₹{(cartTotal + (cartTotal >= 1000 ? 0 : 50)).toFixed(2)}</span>
                        </div>
                    </div>

                    {showCheckoutForm && (
                        <div className="mb-6 space-y-4 border-t pt-6">
                            <h4 className="font-serif text-lg mb-4">Shipping Information</h4>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.name ? "border-red-500" : "border-gray-200"}`}
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.email ? "border-red-500" : "border-gray-200"}`}
                                />
                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.phone ? "border-red-500" : "border-gray-200"}`}
                                />
                                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address *</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.address ? "border-red-500" : "border-gray-200"}`}
                                />
                                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City *</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg ${formErrors.city ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Pincode *</label>
                                    <input
                                        type="text"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg ${formErrors.pincode ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {!showCheckoutForm && (
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleWhatsAppCheckout}
                                variant="outline"
                                style={{ borderColor: '#25D366', color: '#25D366' }}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Order via WhatsApp
                            </Button>
                        )}
                        <div className="flex gap-2">
                            {showCheckoutForm && (
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowCheckoutForm(false)}
                                    disabled={isCheckingOut}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                className={showCheckoutForm ? "flex-1" : "w-full"}
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? "Processing..." : showCheckoutForm ? "Place Order" : "Proceed to Checkout"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
