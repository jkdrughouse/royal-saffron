"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User, Package, MapPin, Phone, Mail, Edit2, Save, X,
  Plus, Star, Trash2, Home, Briefcase, MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SavedAddress {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  addresses?: SavedAddress[];
  // legacy compat
  shippingAddress?: any;
  billingAddress?: any;
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

const EMPTY_ADDRESS_FORM = {
  label: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_ADDRESS_FORM });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Pincode auto-fill
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Scroll to addresses section on hash
  const addressesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!loading && window.location.hash === "#addresses" && addressesRef.current) {
      setTimeout(() => {
        addressesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [loading]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.status === 401) {
        router.push("/login?redirect=/account");
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch {
      router.push("/login?redirect=/account");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/auth/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Pincode auto-fill
  const handlePincodeChange = async (pincode: string) => {
    setFormData((f) => ({ ...f, pincode }));
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const json = await res.json();
        if (json?.[0]?.Status === "Success") {
          const po = json[0].PostOffice?.[0];
          if (po) {
            setFormData((f) => ({
              ...f,
              city: po.District || f.city,
              state: po.State || f.state,
            }));
          }
        }
      } catch {
        // silent
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormData({ ...EMPTY_ADDRESS_FORM, name: user?.name || "", phone: user?.phone || "" });
    setFormError("");
    setShowAddressForm(true);
  };

  const openEditForm = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setFormData({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setFormError("");
    setShowAddressForm(true);
  };

  const closeForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setFormData({ ...EMPTY_ADDRESS_FORM });
    setFormError("");
  };

  const handleSaveAddress = async () => {
    setFormError("");
    const required: (keyof typeof formData)[] = ["name", "phone", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!formData[field].trim()) {
        setFormError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    setFormSaving(true);
    try {
      let res: Response;
      if (editingAddress) {
        res = await fetch("/api/auth/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAddress.id, action: "update", ...formData }),
        });
      } else {
        res = await fetch("/api/auth/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, isDefault: addresses.length === 0 }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save address");
        return;
      }

      await fetchAddresses();
      closeForm();
    } catch {
      setFormError("Failed to save address. Please try again.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await fetch("/api/auth/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "setDefault" }),
      });
      await fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await fetch(`/api/auth/addresses?id=${id}`, { method: "DELETE" });
      await fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getLabelIcon = (label: string) => {
    if (label.toLowerCase() === "work") return <Briefcase className="w-4 h-4" />;
    if (label.toLowerCase() === "home") return <Home className="w-4 h-4" />;
    return <MoreHorizontal className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <p className="text-deep-taupe">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

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
              <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
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

          {/* ── ADDRESS BOOK ── */}
          <div ref={addressesRef} id="addresses">
            <Card className="border border-soft-silk-border bg-white">
              <CardHeader className="border-b border-soft-silk-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Book
                  </CardTitle>
                  {!showAddressForm && (
                    <Button variant="outline" size="sm" onClick={openAddForm}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Add / Edit Form */}
                {showAddressForm && (
                  <div className="mb-6 p-5 border border-saffron-crimson/20 rounded-xl bg-saffron-crimson/5 space-y-4">
                    <h3 className="font-semibold text-ink-charcoal">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h3>

                    {formError && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
                    )}

                    {/* Label */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-ink-charcoal">Label</label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {["Home", "Work", "Other"].map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setFormData((f) => ({ ...f, label: lbl }))}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${formData.label === lbl
                                ? "bg-saffron-crimson text-white border-saffron-crimson"
                                : "border-soft-silk-border text-ink-charcoal hover:bg-muted"
                              }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                      {!["Home", "Work", "Other"].includes(formData.label) && (
                        <input
                          type="text"
                          value={formData.label}
                          onChange={(e) => setFormData((f) => ({ ...f, label: e.target.value }))}
                          placeholder="Custom label"
                          className="w-full px-3 py-2 border border-soft-silk-border rounded-lg text-sm"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address *</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
                        rows={2}
                        placeholder="House/Flat, Street, Area"
                        className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Pincode *</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            maxLength={6}
                            placeholder="6-digit"
                            className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                          />
                          {pincodeLoading && (
                            <span className="absolute right-2 top-2.5 text-xs text-deep-taupe">...</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData((f) => ({ ...f, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-soft-silk-border rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button onClick={handleSaveAddress} disabled={formSaving} className="flex-1">
                        {formSaving ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingAddress ? "Save Changes" : "Add Address"}
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={closeForm} disabled={formSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Address Cards */}
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-deep-taupe/40 mx-auto mb-3" />
                    <p className="text-deep-taupe mb-4">No saved addresses yet</p>
                    <Button variant="outline" onClick={openAddForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative p-4 rounded-xl border-2 transition-all ${addr.isDefault
                            ? "border-saffron-crimson bg-saffron-crimson/5"
                            : "border-soft-silk-border bg-white hover:border-saffron-crimson/30"
                          }`}
                      >
                        {/* Default badge */}
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-saffron-crimson bg-saffron-crimson/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-current" />
                            Default
                          </span>
                        )}

                        {/* Label */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-saffron-crimson">{getLabelIcon(addr.label)}</span>
                          <span className="text-sm font-semibold text-ink-charcoal">{addr.label}</span>
                        </div>

                        {/* Details */}
                        <div className="text-sm text-deep-taupe space-y-0.5 mb-4">
                          <p className="font-medium text-ink-charcoal">{addr.name}</p>
                          <p>{addr.address}</p>
                          <p>
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                          <p>📞 +91 {addr.phone}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-saffron-crimson/40 text-saffron-crimson hover:bg-saffron-crimson/10 transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => openEditForm(addr)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-soft-silk-border text-ink-charcoal hover:bg-muted transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                    >
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
