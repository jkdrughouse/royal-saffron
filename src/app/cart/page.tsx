"use client";

import { Trash2, Plus, Minus, MessageCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../lib/cart-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function Cart() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingData, setBillingData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                
                // Pre-fill form with user data if available
                if (data.user.shippingAddress) {
                    setFormData({
                        name: data.user.shippingAddress.name,
                        email: data.user.email,
                        phone: data.user.shippingAddress.phone,
                        address: data.user.shippingAddress.address,
                        city: data.user.shippingAddress.city,
                        state: data.user.shippingAddress.state,
                        pincode: data.user.shippingAddress.pincode,
                    });
                } else if (data.user) {
                    setFormData({
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone,
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
        if (!formData.phone.trim()) errors.phone = "Phone is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) errors.phone = "Invalid phone number";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Invalid pincode";
        
        if (!billingSameAsShipping) {
            if (!billingData.name.trim()) errors.billingName = "Billing name is required";
            if (!billingData.phone.trim()) errors.billingPhone = "Billing phone is required";
            if (!billingData.address.trim()) errors.billingAddress = "Billing address is required";
            if (!billingData.city.trim()) errors.billingCity = "Billing city is required";
            if (!billingData.state.trim()) errors.billingState = "Billing state is required";
            if (!billingData.pincode.trim()) errors.billingPincode = "Billing pincode is required";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async () => {
        // If user is not logged in, redirect to login
        if (!user) {
            router.push("/login?redirect=/cart");
            return;
        }

        // If user has saved address, skip form
        if (user.shippingAddress && !showCheckoutForm) {
            await placeOrder(user.shippingAddress, user.billingAddress || user.shippingAddress);
            return;
        }

        // Show form for new customers or if address needs update
        if (!showCheckoutForm) {
            setShowCheckoutForm(true);
            return;
        }
        
        if (!validateForm()) {
            return;
        }

        const shippingAddress = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
        };

        const billingAddress = billingSameAsShipping ? shippingAddress : {
            name: billingData.name,
            phone: billingData.phone,
            address: billingData.address,
            city: billingData.city,
            state: billingData.state,
            pincode: billingData.pincode,
        };

        await placeOrder(shippingAddress, billingAddress);
    };

    const placeOrder = async (shippingAddress: any, billingAddress: any) => {
        setIsCheckingOut(true);

        try {
            const orderItems = items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.selectedVariant,
                unit: item.unit,
            }));

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress,
                    billingAddress,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to place order");
            }

            // Clear cart and redirect
            clearCart();
            router.push(`/orders?order=${data.order.id}`);
        } catch (error: any) {
            alert(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;
        
        const orderId = `JK${Date.now()}`;
        const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "917889852247";
        
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
                <p className="text-deep-taupe">Loading...</p>
            </div>
        );
    }

    if (items.length === 0 && !isCheckingOut) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
                <h2 className="font-serif text-2xl sm:text-3xl mb-4 sm:mb-6">Your cart is empty</h2>
                <Link href="/shop">
                    <Button className="w-full sm:w-auto">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    const needsAddressForm = !user || !user.shippingAddress || showCheckoutForm;
    const shipping = cartTotal >= 1000 ? 0 : 50;
    const total = cartTotal + shipping;

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">Shopping Cart</h1>
                </div>
                
                {items.map((item) => (
                    <Card key={`${item.id}-${item.selectedVariant || 'default'}`} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                        <div className="h-32 w-32 sm:h-24 sm:w-24 bg-muted/20 rounded-md p-2 flex-shrink-0 hover:opacity-80 transition-opacity self-center sm:self-auto">
                            <img src={item.image} className="h-full w-full object-contain mix-blend-multiply" alt={item.name} />
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-serif text-base sm:text-lg hover:text-saffron-crimson transition-colors">{item.name}</h3>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                                    {item.selectedVariant && (
                                        <span>Size: {item.selectedVariant} {item.unit || 'g'}</span>
                                    )}
                                    <span>Price: ₹{item.price}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Quantity:</span>
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)}
                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)}
                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-4">
                                <p className="font-mono font-medium text-base sm:text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeItem(item.id, item.selectedVariant)}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs sm:text-sm"
                                >
                                    <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" /> Remove
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            
            <div className="h-fit lg:sticky lg:top-24">
                <Card className="p-4 sm:p-6">
                    <h3 className="font-serif text-xl sm:text-2xl mb-4 sm:mb-6">Summary</h3>
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                        </div>
                        <div className="border-t pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-medium">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {needsAddressForm && showCheckoutForm && (
                        <div className="mb-6 space-y-4 border-t pt-6">
                            <h4 className="font-serif text-lg mb-4">Shipping Information</h4>
                            
                            {user && user.shippingAddress && (
                                <div className="p-3 bg-muted/30 rounded-lg mb-4">
                                    <p className="text-sm text-deep-taupe mb-2">Saved Address:</p>
                                    <p className="text-sm text-ink-charcoal">
                                        {user.shippingAddress.name}<br />
                                        {user.shippingAddress.address}<br />
                                        {user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.pincode}
                                    </p>
                                    <button
                                        onClick={() => setShowCheckoutForm(false)}
                                        className="text-xs text-saffron-crimson hover:text-estate-gold mt-2"
                                    >
                                        Use this address
                                    </button>
                                </div>
                            )}

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
                                    <label className="block text-sm font-medium mb-1">State *</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg ${formErrors.state ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                                </div>
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

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="billingSame"
                                    checked={billingSameAsShipping}
                                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="billingSame" className="text-sm text-ink-charcoal">
                                    Billing address same as shipping
                                </label>
                            </div>

                            {!billingSameAsShipping && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h5 className="font-semibold text-sm">Billing Address</h5>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={billingData.name}
                                            onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingName ? "border-red-500" : "border-gray-200"}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            value={billingData.phone}
                                            onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingPhone ? "border-red-500" : "border-gray-200"}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Address *</label>
                                        <textarea
                                            value={billingData.address}
                                            onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                            rows={2}
                                            className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingAddress ? "border-red-500" : "border-gray-200"}`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City *</label>
                                            <input
                                                type="text"
                                                value={billingData.city}
                                                onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingCity ? "border-red-500" : "border-gray-200"}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State *</label>
                                            <input
                                                type="text"
                                                value={billingData.state}
                                                onChange={(e) => setBillingData({ ...billingData, state: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingState ? "border-red-500" : "border-gray-200"}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            value={billingData.pincode}
                                            onChange={(e) => setBillingData({ ...billingData, pincode: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg ${formErrors.billingPincode ? "border-red-500" : "border-gray-200"}`}
                                        />
                                    </div>
                                </div>
                            )}
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
