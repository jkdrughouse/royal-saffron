"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package, ShoppingBag, Users, TrendingUp,
  ChevronDown, ChevronUp, LogOut, RefreshCw, Mail,
  Search, Printer, Plus, X
} from "lucide-react";
import { products } from "@/app/lib/products";
import { summarizeOrderMetrics } from "@/app/lib/order-utils";

// ── Types ────────────────────────────────────────────────────────────────────
type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem { name: string; quantity: number; price: number; variant?: number; unit?: string; }
interface Address { name: string; phone: string; address: string; city: string; state: string; pincode: string; }
interface Order {
  id: string; userId: string; items: OrderItem[]; subtotal: number;
  shipping: number; discount?: number; total: number; status: OrderStatus;
  shippingAddress: Address; trackingNumber?: string; courierService?: string;
  createdAt: string; updatedAt: string; type?: string; paymentMethod?: string;
  guestEmail?: string;
}
interface CustomerRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: "account" | "guest" | "offline";
  orderCount?: number;
  totalSpend?: number;
  lastOrderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_TABS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const CUSTOMER_SOURCE_LABELS = {
  account: "Account",
  guest: "Guest",
  offline: "Offline",
} as const;

// ── POS Form ─────────────────────────────────────────────────────────────────
function POSForm({ onSuccess }: { onSuccess: (orderId: string) => void }) {
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState<Array<{ name: string; price: number; quantity: number; variant?: number; unit?: string }>>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const variants = selectedProduct?.variants ?? [];
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [productSearch]);
  const unitPrice = variants.length > 0
    ? variants[selectedVariantIdx]?.price ?? selectedProduct?.price ?? 0
    : selectedProduct?.price ?? 0;
  const variantWeight = variants.length > 0 ? variants[selectedVariantIdx]?.weight : undefined;

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  function addToCart() {
    if (!selectedProduct) return;
    const item = {
      name: selectedProduct.name,
      price: unitPrice,
      quantity: qty,
      variant: variantWeight,
      unit: variantWeight && variantWeight < 10 ? "g" : variantWeight ? "g" : undefined,
    };
    setCartItems(prev => {
      const key = `${item.name}-${item.variant}`;
      const existing = prev.find(i => `${i.name}-${i.variant}` === key);
      if (existing) return prev.map(i => `${i.name}-${i.variant}` === key ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, item];
    });
    setProductSearch(""); setSelectedProductId(""); setSelectedVariantIdx(0); setQty(1);
  }

  async function handleSubmit() {
    if (!customerName.trim() || !customerPhone.trim()) { setError("Customer name and phone are required."); return; }
    if (cartItems.length === 0) { setError("Add at least one product to the cart."); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders/offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerPhone, items: cartItems, paymentMethod, discount }),
      });
      if (!res.ok) { setError("Failed to create order. Try again."); return; }
      const data = await res.json();
      setSuccessOrderId(data.order.id);
      onSuccess(data.order.id);
    } catch { setError("Network error. Try again."); }
    finally { setSubmitting(false); }
  }

  if (successOrderId) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <div className="text-4xl">✅</div>
          <p className="font-semibold text-lg">Sale Created!</p>
          <p className="text-muted-foreground font-mono text-sm">{successOrderId}</p>
          <div className="flex justify-center gap-3">
            <a href={`/admin/receipt?orderId=${successOrderId}`} target="_blank">
              <Button size="sm"><Printer className="w-4 h-4 mr-1" /> Print Receipt</Button>
            </a>
            <Button size="sm" variant="outline" onClick={() => {
              setSuccessOrderId(""); setCartItems([]); setCustomerName(""); setCustomerPhone(""); setDiscount(0);
            }}>
              <Plus className="w-4 h-4 mr-1" /> New Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Product picker + cart */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add Products</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full text-sm border rounded-lg pl-9 pr-3 py-2"
              placeholder="Search product by name or category..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full text-sm border rounded-lg px-3 py-2"
            value={selectedProductId}
            onChange={e => { setSelectedProductId(e.target.value); setSelectedVariantIdx(0); }}
          >
            <option value="">— Select product —</option>
            {filteredProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} · {p.category} · ₹{p.price}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} in the dropdown
          </p>

          {selectedProduct && variants.length > 0 && (
            <select
              className="w-full text-sm border rounded-lg px-3 py-2"
              value={selectedVariantIdx}
              onChange={e => setSelectedVariantIdx(Number(e.target.value))}
            >
              {variants.map((v, i) => (
                <option key={i} value={i}>{v.weight}g — ₹{v.price}</option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button className="px-3 py-2 text-sm hover:bg-muted" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="px-3 text-sm font-medium">{qty}</span>
              <button className="px-3 py-2 text-sm hover:bg-muted" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            {selectedProduct && (
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-amber-800">{selectedProduct.name}</span>
                <span className="text-sm font-bold">₹{unitPrice * qty}</span>
              </div>
            )}
            <Button size="sm" onClick={addToCart} disabled={!selectedProduct}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Cart */}
          {cartItems.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cart</div>
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 border-t text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {item.variant && <span className="text-muted-foreground ml-1">({item.variant}g)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-muted-foreground">₹{item.price * item.quantity}</span>
                    {/* Quantity controls — minus removes item when qty reaches 0 */}
                    <div className="flex items-center border rounded overflow-hidden text-xs">
                      <button
                        className="px-2 py-1 hover:bg-muted"
                        onClick={() => setCartItems(prev =>
                          prev[i].quantity <= 1
                            ? prev.filter((_, j) => j !== i)
                            : prev.map((it, j) => j === i ? { ...it, quantity: it.quantity - 1 } : it)
                        )}
                      >−</button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-muted"
                        onClick={() => setCartItems(prev =>
                          prev.map((it, j) => j === i ? { ...it, quantity: it.quantity + 1 } : it)
                        )}
                      >+</button>
                    </div>
                    <button onClick={() => setCartItems(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-500" title="Remove">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right: Customer + payment + totals */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer Details</p>

          <input
            className="w-full text-sm border rounded-lg px-3 py-2"
            placeholder="Customer name *"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />
          <input
            className="w-full text-sm border rounded-lg px-3 py-2"
            placeholder="Phone number *"
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Payment Method</p>
            <div className="flex gap-2">
              {(["cash", "upi", "card"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 py-2 px-3 text-sm rounded-lg border font-medium capitalize transition-colors ${paymentMethod === m ? "bg-amber-600 text-white border-amber-600" : "border-muted-foreground/30 hover:border-amber-400"}`}
                >
                  {m === "cash" ? "💵" : m === "upi" ? "📱" : "💳"} {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Discount (₹)</p>
            <input
              className="w-full text-sm border rounded-lg px-3 py-2"
              type="number" min="0"
              value={discount || ""}
              placeholder="0"
              onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
            />
          </div>

          {/* Totals */}
          <div className="border rounded-lg overflow-hidden bg-muted/20">
            <div className="flex justify-between px-3 py-2 text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            {discount > 0 && <div className="flex justify-between px-3 py-2 text-sm border-t"><span className="text-muted-foreground">Discount</span><span className="text-green-600">−₹{discount}</span></div>}
            <div className="flex justify-between px-3 py-2 text-sm border-t font-bold bg-amber-50">
              <span>Total</span>
              <span className="text-amber-800">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || cartItems.length === 0 || !customerName || !customerPhone}
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Create Sale · ₹{grandTotal.toLocaleString("en-IN")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [trackingEdits, setTrackingEdits] = useState<Record<string, { trackingNumber: string; courierService: string }>>({});
  const [activeTab, setActiveTab] = useState<"orders" | "users" | "new-sale">("orders");
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    if (!res.ok) router.replace("/admin/login");
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
      ]);
      if (ordersRes.status === 401 || usersRes.status === 401) { router.replace("/admin/login"); return; }
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      setOrders(ordersData.orders || []);
      setTotalCustomers(usersData.total || 0);
      setCustomers(usersData.users || []);
    } catch (err) { console.error("Failed to load dashboard data:", err); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { checkAuth().then(loadData); }, [checkAuth, loadData]);

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
      if (!res.ok) return;
      const data = await res.json();
      setOrders(prev => prev.map(order => order.id === orderId ? data.order : order));
    } finally { setSavingOrderId(null); }
  };

  // Client-side filtered orders
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter(o => o.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.shippingAddress?.name ?? "").toLowerCase().includes(q) ||
        (o.shippingAddress?.phone ?? "").includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, searchQuery]);

  const orderMetrics = useMemo(() => summarizeOrderMetrics(orders), [orders]);
  const stats = {
    totalOrders: orders.length,
    recognizedRevenue: orderMetrics.recognizedRevenue,
    openSalesValue: orderMetrics.openSalesValue,
    totalCustomers,
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
            <Button variant="ghost" size="sm" onClick={loadData}><RefreshCw className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.totalOrders, note: `${orderMetrics.cancelledOrders} cancelled`, icon: ShoppingBag, color: "text-blue-600" },
            { label: "Net Revenue", value: `₹${stats.recognizedRevenue.toLocaleString("en-IN")}`, note: "Delivered web + non-cancelled POS", icon: TrendingUp, color: "text-green-600" },
            { label: "Open Sales", value: `₹${stats.openSalesValue.toLocaleString("en-IN")}`, note: `${orderMetrics.openSalesCount} online orders in pipeline`, icon: Package, color: "text-amber-600" },
            { label: "Customers", value: stats.totalCustomers, note: "Accounts, guests, and offline", icon: Users, color: "text-purple-600" },
          ].map(({ label, value, note, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-xl sm:text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Cancelled value excluded from revenue: ₹{orderMetrics.cancelledValue.toLocaleString("en-IN")}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {([
            { id: "orders", label: `Orders (${orders.length})` },
            { id: "new-sale", label: "New Sale" },
            { id: "users", label: `Customers (${totalCustomers})` },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id
                ? tab.id === "new-sale"
                  ? "border-amber-600 text-amber-800 bg-amber-50"
                  : "border-amber-600 text-amber-800"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.id === "new-sale" && <Plus className="w-3 h-3 inline mr-1" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Search + Status Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by order ID, name or phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {STATUS_TABS.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as "all" | OrderStatus)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${statusFilter === s
                      ? "bg-amber-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                  >
                    {s === "all" ? `All (${orders.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            {(searchQuery || statusFilter !== "all") && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
                {searchQuery && ` for "${searchQuery}"`}
                {statusFilter !== "all" && ` · status: ${statusFilter}`}
                <button className="ml-2 text-amber-600 hover:underline text-xs" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>Clear filters</button>
              </p>
            )}

            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const tracking = trackingEdits[order.id] ?? {
                  trackingNumber: order.trackingNumber || "",
                  courierService: order.courierService || "",
                };
                const isOffline = order.type === "offline";

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
                          {isOffline && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">
                              🏪 Walk-in
                            </span>
                          )}
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
                        {/* Print Receipt */}
                        <div className="flex justify-end">
                          <a href={`/admin/receipt?orderId=${order.id}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1">
                              <Printer className="w-3.5 h-3.5" /> Print Receipt
                            </Button>
                          </a>
                        </div>

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
                            {(order.discount ?? 0) > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>−₹{order.discount}</span>
                              </div>
                            )}
                            <div className="border-t pt-1 flex justify-between text-sm font-medium">
                              <span>Total</span>
                              <span>₹{order.total.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            {isOffline ? "Customer" : "Ship To"}
                          </p>
                          <p className="text-sm">
                            {order.shippingAddress?.name}<br />
                            {!isOffline && <>{order.shippingAddress?.address}<br /></>}
                            {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                            {order.shippingAddress?.state}{order.shippingAddress?.pincode ? ` – ${order.shippingAddress.pincode}` : ""}<br />
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
                                value={order.status}
                                onChange={e => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                                className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white"
                                disabled={savingOrderId === order.id}
                              >
                                {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(s => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
                              {savingOrderId === order.id && <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />}
                            </div>
                          </div>

                          {!isOffline && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tracking</p>
                              <input
                                type="text" placeholder="Tracking number"
                                value={tracking.trackingNumber}
                                onChange={e => setTrackingEdits(prev => ({ ...prev, [order.id]: { ...tracking, trackingNumber: e.target.value } }))}
                                className="w-full text-sm border rounded-lg px-3 py-2 mb-2"
                              />
                              <input
                                type="text" placeholder="Courier (e.g. India Post)"
                                value={tracking.courierService}
                                onChange={e => setTrackingEdits(prev => ({ ...prev, [order.id]: { ...tracking, courierService: e.target.value } }))}
                                className="w-full text-sm border rounded-lg px-3 py-2 mb-2"
                              />
                              <Button
                                size="sm" variant="outline" className="w-full"
                                disabled={savingOrderId === order.id}
                                onClick={() => updateOrder(order.id, tracking)}
                              >
                                <Mail className="w-3 h-3 mr-1" /> Save & Notify Customer
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* ── New Sale Tab ── */}
        {activeTab === "new-sale" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold">New Walk-in / Phone Sale</h2>
              <p className="text-sm text-muted-foreground">Add products, enter customer details, and create an offline order with a printable receipt.</p>
            </div>
            <POSForm onSuccess={() => { void loadData(); }} />
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === "users" && (
          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground text-xs">
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Source</th>
                      <th className="py-2 pr-4 font-medium">Contact</th>
                      <th className="py-2 pr-4 font-medium">Orders</th>
                      <th className="py-2 pr-4 font-medium">Spend</th>
                      <th className="py-2 font-medium">Recent Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No customers yet</td></tr>
                    ) : customers.map(customer => (
                      <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-2 pr-4 font-medium">{customer.name}</td>
                        <td className="py-2 pr-4">
                          <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                            {CUSTOMER_SOURCE_LABELS[(customer.source || "guest") as keyof typeof CUSTOMER_SOURCE_LABELS] || "Guest"}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          <div>{customer.email || "—"}</div>
                          <div>{customer.phone || "—"}</div>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">{customer.orderCount ?? 0}</td>
                        <td className="py-2 pr-4 text-muted-foreground">₹{(customer.totalSpend ?? 0).toLocaleString("en-IN")}</td>
                        <td className="py-2 text-muted-foreground">
                          {customer.lastOrderId ? (
                            <span className="font-mono text-xs">{customer.lastOrderId}</span>
                          ) : customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "—"}
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
