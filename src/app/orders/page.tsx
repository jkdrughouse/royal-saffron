"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: number;
  unit?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  courierService?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrackingInfo {
  status: string;
  location?: string;
  timestamp?: string;
  description?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<Record<string, any>>({});
  const [loadingTracking, setLoadingTracking] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Check for order success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("order")) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      // Clean URL
      window.history.replaceState({}, "", "/orders");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async (orderId: string, trackingNumber?: string, courierService?: string) => {
    if (!trackingNumber) {
      alert("Tracking number not available yet. Please contact support.");
      return;
    }

    setLoadingTracking({ ...loadingTracking, [orderId]: true });

    try {
      const response = await fetch(`/api/orders/${orderId}/track`);
      if (!response.ok) throw new Error("Failed to fetch tracking");
      
      const data = await response.json();
      setTrackingData({ ...trackingData, [orderId]: data });
    } catch (error) {
      console.error("Error tracking order:", error);
      alert("Unable to fetch tracking information. Please try again later.");
    } finally {
      setLoadingTracking({ ...loadingTracking, [orderId]: false });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
      case "processing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <p className="text-deep-taupe">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <Package className="w-16 h-16 text-deep-taupe mx-auto mb-4" />
        <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-ink-charcoal">No orders yet</h2>
        <p className="text-deep-taupe mb-6">Start shopping to see your orders here</p>
        <Link href="/shop">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          <p className="font-semibold">Order placed successfully! 🎉</p>
          <p className="text-sm">Your order has been confirmed. We'll process it shortly.</p>
        </div>
      )}
      
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12 text-ink-charcoal">
        My Orders
      </h1>

      <div className="space-y-6 sm:space-y-8">
        {orders.map((order) => {
          const tracking = trackingData[order.id];
          const isTrackingLoading = loadingTracking[order.id];

          return (
            <Card key={order.id} className="border border-soft-silk-border bg-white">
              <CardHeader className="border-b border-soft-silk-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-xl sm:text-2xl mb-2">
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-deep-taupe">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <Button
                      variant="outline"
                      onClick={() => handleTrackOrder(order.id, order.trackingNumber, order.courierService)}
                      disabled={isTrackingLoading}
                      className="w-full sm:w-auto"
                    >
                      {isTrackingLoading ? (
                        "Loading..."
                      ) : tracking ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Tracking
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 mr-2" />
                          Track Order
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Tracking Info */}
                {tracking && (
                  <div className="mb-6 p-4 bg-saffron-crimson/5 rounded-lg border border-saffron-crimson/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-ink-charcoal mb-1">Tracking Information</h3>
                        <p className="text-sm text-deep-taupe">
                          {tracking.courierService} • {tracking.trackingNumber}
                        </p>
                      </div>
                      {tracking.trackingUrl && (
                        <a
                          href={tracking.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-saffron-crimson hover:text-estate-gold text-sm flex items-center gap-1"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {tracking.trackingInfo && tracking.trackingInfo.length > 0 && (
                      <div className="space-y-2">
                        {tracking.trackingInfo.map((info: TrackingInfo, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-saffron-crimson mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-ink-charcoal">{info.status}</p>
                              {info.description && (
                                <p className="text-deep-taupe">{info.description}</p>
                              )}
                              {info.location && (
                                <p className="text-deep-taupe text-xs">📍 {info.location}</p>
                              )}
                              {info.timestamp && (
                                <p className="text-deep-taupe text-xs">
                                  {new Date(info.timestamp).toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-ink-charcoal mb-4">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-soft-silk-border last:border-0"
                      >
                        <div>
                          <p className="font-medium text-ink-charcoal">{item.name}</p>
                          {item.variant && (
                            <p className="text-sm text-deep-taupe">
                              {item.variant} {item.unit || "g"}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-ink-charcoal">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </p>
                          <p className="text-sm text-deep-taupe">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-ink-charcoal mb-2">Shipping Address</h3>
                  <p className="text-sm text-deep-taupe">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-4 border-t border-soft-silk-border">
                  <div className="text-sm text-deep-taupe">
                    <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
                    <p>Shipping: ₹{order.shipping.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-deep-taupe mb-1">Total</p>
                    <p className="font-serif text-2xl font-bold text-ink-charcoal">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
