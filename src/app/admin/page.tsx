"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package, ShoppingBag, Users, TrendingUp,
  ChevronDown, ChevronUp, LogOut, RefreshCw, Mail
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: number;
  unit?: string;
}

interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  trackingNumber?: string;
  courierService?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [trackingEdits, setTrackingEdits] = useState<Record<string, { trackingNumber: string; courierService: string }>>({});
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");
  const [users, setUsers] = useState<any[]>([]);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    if (!res.ok) router.replace("/admin/login");
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/users"),
      ]);
      if (ordersRes.status === 401 || usersRes.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      setOrders(ordersData.orders || []);
      setTotalUsers(usersData.total || 0);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth().then(loadData);
  }, [checkAuth, loadData]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    setSavingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await loadData();
      }
    } finally {
      setSavingOrderId(null);
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    pendingOrders: orders.filter(o => ["pending", "confirmed", "processing"].includes(o.status)).length,
    totalUsers,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-semibold text-amber-800">JKC Admin</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Jhelum Kesar Co.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600" },
            { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-600" },
            { label: "Pending", value: stats.pendingOrders, icon: Package, color: "text-amber-600" },
            { label: "Customers", value: stats.totalUsers, icon: Users, color: "text-purple-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-xl sm:text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {(["orders", "users"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                  ? "border-amber-600 text-amber-800"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab} {tab === "orders" ? `(${orders.length})` : `(${totalUsers})`}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No orders yet
                </CardContent>
              </Card>
            ) : (
              orders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const tracking = trackingEdits[order.id] ?? {
                  trackingNumber: order.trackingNumber || "",
                  courierService: order.courierService || "",
                };

                return (
                  <Card key={order.id} className="overflow-hidden">
                    {/* Order Row */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate">{order.shippingAddress?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.shippingAddress?.phone} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">₹{order.total.toFixed(0)}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t bg-muted/10 p-4 space-y-4">
                        {/* Items */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Items</p>
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span>{item.name}{item.variant ? ` (${item.variant}${item.unit || "g"})` : ""} × {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-1 flex justify-between text-sm font-medium">
                              <span>Total</span>
                              <span>₹{order.total.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ship To</p>
                          <p className="text-sm">
                            {order.shippingAddress?.name}<br />
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}<br />
                            📞 {order.shippingAddress?.phone}
                          </p>
                        </div>

                        {/* Status + Tracking */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                              Status <span className="text-amber-600 normal-case">(sends email on change)</span>
                            </p>
                            <div className="flex items-center gap-2">
                              <select
                                defaultValue={order.status}
                                onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                                className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white"
                                disabled={savingOrderId === order.id}
                              >
                                {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(s => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
                              {savingOrderId === order.id && (
                                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tracking</p>
                            <input
                              type="text"
                              placeholder="Tracking number"
                              value={tracking.trackingNumber}
                              onChange={(e) => setTrackingEdits(prev => ({
                                ...prev,
                                [order.id]: { ...tracking, trackingNumber: e.target.value }
                              }))}
                              className="w-full text-sm border rounded-lg px-3 py-2 mb-2"
                            />
                            <input
                              type="text"
                              placeholder="Courier (e.g. India Post)"
                              value={tracking.courierService}
                              onChange={(e) => setTrackingEdits(prev => ({
                                ...prev,
                                [order.id]: { ...tracking, courierService: e.target.value }
                              }))}
                              className="w-full text-sm border rounded-lg px-3 py-2 mb-2"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              disabled={savingOrderId === order.id}
                              onClick={() => updateOrder(order.id, tracking)}
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Save & Notify Customer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground text-xs">
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Email</th>
                      <th className="py-2 pr-4 font-medium">Phone</th>
                      <th className="py-2 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No users yet</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-2 pr-4 font-medium">{u.name}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{u.email}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{u.phone}</td>
                        <td className="py-2 text-muted-foreground">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
