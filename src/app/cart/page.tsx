"use client";

import { Trash2, Plus, Minus, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../lib/cart-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { WhatsAppLogo } from "@/components/whatsapp-logo";
import { lookupPincode, INDIAN_STATES } from "../lib/pincode";

interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    shippingAddress?: AddressData;
    billingAddress?: AddressData;
}

interface AddressData {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

const emptyAddress: AddressData = { name: "", phone: "", address: "", city: "", state: "", pincode: "" };

export default function Cart() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [guestMode, setGuestMode] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(false);

    const [formData, setFormData] = useState({ ...emptyAddress, email: "" });
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingData, setBillingData] = useState<AddressData>(emptyAddress);
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
                if (data.user.shippingAddress) {
                    setFormData({ ...data.user.shippingAddress, email: data.user.email });
                } else if (data.user) {
                    setFormData({ ...emptyAddress, name: data.user.name, email: data.user.email, phone: data.user.phone });
                }
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    // Pincode auto-lookup
    const handlePincodeBlur = async (value: string, target: "shipping" | "billing") => {
        if (!/^\d{6}$/.test(value)) return;
        setPincodeLoading(true);
        try {
            const result = await lookupPincode(value);
            if (result.found) {
                if (target === "shipping") {
                    setFormData(prev => ({ ...prev, state: result.state, city: result.district }));
                } else {
                    setBillingData(prev => ({ ...prev, state: result.state, city: result.district }));
                }
            }
        } finally {
            setPincodeLoading(false);
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
        // If user is not logged in and hasn't chosen guest, show options
        if (!user && !guestMode) {
            setGuestMode(true);
            setShowCheckoutForm(true);
            return;
        }

        // If user is logged in and has a saved address, use it directly
        if (user && user.shippingAddress && !showCheckoutForm) {
            await placeOrder(user.shippingAddress, user.billingAddress || user.shippingAddress);
            return;
        }

        // Show form if not shown yet
        if (!showCheckoutForm) {
            setShowCheckoutForm(true);
            return;
        }

        if (!validateForm()) return;

        const shippingAddress: AddressData = {
            name: formData.name, phone: formData.phone, address: formData.address,
            city: formData.city, state: formData.state, pincode: formData.pincode,
        };
        const billingAddress = billingSameAsShipping ? shippingAddress : { ...billingData };

        await placeOrder(shippingAddress, billingAddress);
    };

    const placeOrder = async (shippingAddress: AddressData, billingAddress: AddressData) => {
        setIsCheckingOut(true);
        try {
            const orderItems = items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.selectedVariant,
                unit: item.unit,
                image: item.image,
            }));

            const body: any = { items: orderItems, shippingAddress, billingAddress };
            if (!user && guestMode) {
                body.guestEmail = formData.email;
            }

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to place order");

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
        let message = `🎉 New Order - Jhelum Kesar Co.\n\nOrder ID: ${orderId}\n\nItems:\n`;
        items.forEach(item => {
            message += `• ${item.name}${item.selectedVariant ? ` (${item.selectedVariant}${item.unit || 'g'})` : ''} x${item.quantity} - ₹${item.price * item.quantity}\n`;
        });
        const shipping = cartTotal >= 1000 ? 0 : 50;
        message += `\nSubtotal: ₹${cartTotal.toFixed(2)}\nShipping: ₹${shipping.toFixed(2)}\nTotal: ₹${(cartTotal + shipping).toFixed(2)}\n\nPlease confirm this order.`;
        window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center"><p className="text-deep-taupe">Loading...</p></div>;
    }

    if (items.length === 0 && !isCheckingOut) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
                <h2 className="font-serif text-2xl sm:text-3xl mb-4 sm:mb-6">Your cart is empty</h2>
                <Link href="/shop"><Button className="w-full sm:w-auto">Continue Shopping</Button></Link>
            </div>
        );
    }

    const shipping = cartTotal >= 1000 ? 0 : 50;
    const total = cartTotal + shipping;
    const inputCls = (err?: string) => `w-full px-3 py-2 border rounded-lg text-sm ${err ? "border-red-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-saffron-crimson/40`;

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">Shopping Cart</h1>
                {items.map((item) => (
                    <Card key={`${item.id}-${item.selectedVariant || 'default'}`} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                        <div className="h-32 w-32 sm:h-24 sm:w-24 bg-muted/20 rounded-md p-2 flex-shrink-0 self-center sm:self-auto">
                            <img src={item.image} className="h-full w-full object-contain mix-blend-multiply" alt={item.name} />
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-serif text-base sm:text-lg hover:text-saffron-crimson transition-colors">{item.name}</h3>
                                <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                                    {item.selectedVariant && <span>Size: {item.selectedVariant} {item.unit || 'g'}</span>}
                                    <span>Price: ₹{item.price}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Quantity:</span>
                                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)} className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-all touch-manipulation" aria-label="Decrease"><Minus className="w-4 h-4" /></button>
                                        <span className="min-w-[3rem] text-center font-medium text-sm px-2 select-none">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)} className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-all touch-manipulation" aria-label="Increase"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                                <p className="font-mono font-medium text-base sm:text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeItem(item.id, item.selectedVariant)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs sm:text-sm">
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Order Summary + Checkout */}
            <div className="h-fit lg:sticky lg:top-24">
                <Card className="p-4 sm:p-6">
                    <h3 className="font-serif text-xl sm:text-2xl mb-4 sm:mb-6">Summary</h3>
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                            <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                            <span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                        </div>
                        <div className="border-t pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-medium">
                            <span>Total</span><span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Address Form */}
                    {showCheckoutForm && (
                        <div className="mb-6 space-y-3 border-t pt-5">
                            <h4 className="font-serif text-lg">
                                Shipping Information
                                {guestMode && <span className="ml-2 text-xs text-amber-600 font-sans font-normal bg-amber-50 px-2 py-0.5 rounded-full">Guest</span>}
                            </h4>

                            {/* Show saved address option for logged-in users */}
                            {user?.shippingAddress && (
                                <div className="p-3 bg-muted/30 rounded-lg text-sm">
                                    <p className="text-deep-taupe mb-1">Saved Address:</p>
                                    <p className="text-ink-charcoal">{user.shippingAddress.name}<br />{user.shippingAddress.address}<br />{user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.pincode}</p>
                                    <button onClick={() => setShowCheckoutForm(false)} className="text-xs text-saffron-crimson hover:text-estate-gold mt-2">Use this address</button>
                                </div>
                            )}

                            {["name", "email", "phone"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field} *</label>
                                    <input type={field === "email" ? "email" : field === "phone" ? "tel" : "text"} value={(formData as any)[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className={inputCls(formErrors[field])} />
                                    {formErrors[field] && <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>}
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-medium mb-1">Address *</label>
                                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} className={inputCls(formErrors.address)} />
                                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                            </div>

                            {/* Pincode first → auto-fills state + city */}
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                    Pincode *
                                    {pincodeLoading && <Loader2 className="w-3 h-3 animate-spin text-amber-600" />}
                                </label>
                                <input type="text" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} onBlur={(e) => handlePincodeBlur(e.target.value, "shipping")} className={inputCls(formErrors.pincode)} placeholder="6-digit pincode" />
                                {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">State *</label>
                                    <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputCls(formErrors.state)}>
                                        <option value="">Select state</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City / District *</label>
                                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputCls(formErrors.city)} />
                                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                </div>
                            </div>

                            {/* Billing same as shipping */}
                            <div className="flex items-center gap-2 pt-1">
                                <input type="checkbox" id="billingSame" checked={billingSameAsShipping} onChange={(e) => setBillingSameAsShipping(e.target.checked)} className="w-4 h-4" />
                                <label htmlFor="billingSame" className="text-sm">Billing address same as shipping</label>
                            </div>

                            {!billingSameAsShipping && (
                                <div className="space-y-3 pt-3 border-t">
                                    <h5 className="font-semibold text-sm">Billing Address</h5>
                                    {["name", "phone", "address"].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium mb-1 capitalize">{field} *</label>
                                            {field === "address"
                                                ? <textarea value={(billingData as any)[field]} onChange={(e) => setBillingData({ ...billingData, [field]: e.target.value })} rows={2} className={inputCls((formErrors as any)[`billing${field.charAt(0).toUpperCase() + field.slice(1)}`])} />
                                                : <input type={field === "phone" ? "tel" : "text"} value={(billingData as any)[field]} onChange={(e) => setBillingData({ ...billingData, [field]: e.target.value })} className={inputCls((formErrors as any)[`billing${field.charAt(0).toUpperCase() + field.slice(1)}`])} />}
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 flex items-center gap-2">Pincode * {pincodeLoading && <Loader2 className="w-3 h-3 animate-spin text-amber-600" />}</label>
                                        <input type="text" maxLength={6} value={billingData.pincode} onChange={(e) => setBillingData({ ...billingData, pincode: e.target.value })} onBlur={(e) => handlePincodeBlur(e.target.value, "billing")} className={inputCls(formErrors.billingPincode)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State *</label>
                                            <select value={billingData.state} onChange={(e) => setBillingData({ ...billingData, state: e.target.value })} className={inputCls(formErrors.billingState)}>
                                                <option value="">Select state</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City *</label>
                                            <input type="text" value={billingData.city} onChange={(e) => setBillingData({ ...billingData, city: e.target.value })} className={inputCls(formErrors.billingCity)} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Checkout Buttons */}
                    <div className="space-y-3">
                        {/* Guest / Sign-in prompt when not logged in and form not shown */}
                        {!user && !showCheckoutForm && (
                            <div className="text-center text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg">
                                <Link href="/login?redirect=/cart" className="text-saffron-crimson font-medium hover:underline">Sign in</Link>
                                {" "}for faster checkout, or continue as guest below.
                            </div>
                        )}

                        {!showCheckoutForm && (
                            <Button className="w-full" size="lg" onClick={handleWhatsAppCheckout} variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                                <WhatsAppLogo className="w-4 h-4 mr-2" />
                                Order via WhatsApp
                            </Button>
                        )}

                        <div className="flex gap-2">
                            {showCheckoutForm && (
                                <Button variant="outline" className="flex-1" onClick={() => { setShowCheckoutForm(false); setGuestMode(false); }} disabled={isCheckingOut}>
                                    Back
                                </Button>
                            )}
                            <Button className={showCheckoutForm ? "flex-1" : "w-full"} size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                                {isCheckingOut ? "Processing..." : showCheckoutForm ? "Place Order" : "Proceed to Checkout"}
                            </Button>
                        </div>

                        {!user && !showCheckoutForm && (
                            <button onClick={() => { setGuestMode(true); setShowCheckoutForm(true); }} className="w-full text-sm text-center text-muted-foreground underline hover:text-ink-charcoal">
                                Continue as Guest
                            </button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
