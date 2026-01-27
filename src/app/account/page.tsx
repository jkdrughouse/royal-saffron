"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Phone, Mail, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface UserData {
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

interface Order {
  id: string;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.status === 401) {
        router.push("/login?redirect=/account");
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login?redirect=/account");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleEdit = (field: string, data: any) => {
    setEditingField(field);
    setEditData(data || {});
  };

  const handleSaveAddress = async (type: "shipping" | "billing") => {
    try {
      // Validate required fields
      if (!editData.name || !editData.phone || !editData.address || !editData.city || !editData.state || !editData.pincode) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await fetch("/api/auth/update-address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          address: editData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      // Update local state with saved address
      setUser(data.user);
      setEditingField(null);
      setEditData({});
    } catch (error: any) {
      console.error("Error saving address:", error);
      alert(error.message || "Failed to save address");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <p className="text-deep-taupe">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-charcoal mb-2">
          My Account
        </h1>
        <p className="text-deep-taupe">Manage your profile, addresses, and orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-soft-silk-border bg-white">
            <CardHeader className="border-b border-soft-silk-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-saffron-crimson" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-deep-taupe mb-1">Full Name</p>
                  <p className="font-medium text-ink-charcoal">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-saffron-crimson" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-deep-taupe mb-1">Email</p>
                  <p className="font-medium text-ink-charcoal">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-saffron-crimson" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-deep-taupe mb-1">Phone</p>
                  <p className="font-medium text-ink-charcoal">+91 {user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border border-soft-silk-border bg-white">
            <CardHeader className="border-b border-soft-silk-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
                {editingField !== "shipping" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("shipping", user.shippingAddress || {
                      name: user.name,
                      phone: user.phone,
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                    })}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {user.shippingAddress ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {editingField === "shipping" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <textarea
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        value={editData.city || ""}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        value={editData.state || ""}
                        onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={editData.pincode || ""}
                      onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveAddress("shipping")}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingField(null);
                        setEditData({});
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : user.shippingAddress ? (
                <div className="space-y-2">
                  <p className="font-medium text-ink-charcoal">{user.shippingAddress.name}</p>
                  <p className="text-deep-taupe">{user.shippingAddress.address}</p>
                  <p className="text-deep-taupe">
                    {user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.pincode}
                  </p>
                  <p className="text-deep-taupe">Phone: {user.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-deep-taupe">No shipping address saved. Click "Add" to add one.</p>
              )}
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="border border-soft-silk-border bg-white">
            <CardHeader className="border-b border-soft-silk-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Billing Address
                </CardTitle>
                {editingField !== "billing" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("billing", user.billingAddress || {
                      name: user.name,
                      phone: user.phone,
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                    })}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {user.billingAddress ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {editingField === "billing" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <textarea
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        value={editData.city || ""}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        value={editData.state || ""}
                        onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={editData.pincode || ""}
                      onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveAddress("billing")}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingField(null);
                        setEditData({});
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : user.billingAddress ? (
                <div className="space-y-2">
                  <p className="font-medium text-ink-charcoal">{user.billingAddress.name}</p>
                  <p className="text-deep-taupe">{user.billingAddress.address}</p>
                  <p className="text-deep-taupe">
                    {user.billingAddress.city}, {user.billingAddress.state} - {user.billingAddress.pincode}
                  </p>
                  <p className="text-deep-taupe">Phone: {user.billingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-deep-taupe">No billing address saved. Click "Add" to add one.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Orders Summary */}
        <div className="space-y-6">
          <Card className="border border-soft-silk-border bg-white">
            <CardHeader className="border-b border-soft-silk-border">
              <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                <Package className="w-5 h-5" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-ink-charcoal mb-1">{orders.length}</p>
                <p className="text-sm text-deep-taupe">Total Orders</p>
              </div>
              <Link href="/orders">
                <Button className="w-full" variant="outline">
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-soft-silk-border bg-white">
            <CardContent className="p-6 space-y-3">
              <Link href="/account/change-password">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id} className="border border-soft-silk-border bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-ink-charcoal">Order #{order.id}</p>
                      <p className="text-sm text-deep-taupe">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-orange-100 text-orange-800"
                      }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-deep-taupe">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="font-semibold text-ink-charcoal">₹{order.total.toFixed(2)}</p>
                  </div>
                  <Link href="/orders">
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
