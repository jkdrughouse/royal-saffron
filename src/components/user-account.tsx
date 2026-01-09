"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserAccount() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setShowMenu(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors"
        aria-label="Account"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors relative"
        aria-label="Account"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors relative"
        aria-label="Account"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
        {showMenu && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-saffron-crimson rounded-full"></span>
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-soft-silk-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-soft-silk-border">
              <p className="text-sm font-medium text-ink-charcoal">{user.name}</p>
              <p className="text-xs text-deep-taupe truncate">{user.email}</p>
            </div>
            <div className="p-1">
              <button
                onClick={() => {
                  router.push("/account");
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-charcoal hover:bg-muted rounded transition-colors text-left"
              >
                <User className="w-4 h-4" />
                My Account
              </button>
              <button
                onClick={() => {
                  router.push("/orders");
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-charcoal hover:bg-muted rounded transition-colors text-left"
              >
                <Package className="w-4 h-4" />
                My Orders
              </button>
              <div className="border-t border-soft-silk-border my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
