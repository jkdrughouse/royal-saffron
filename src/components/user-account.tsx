"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, LogIn, UserPlus, MapPin } from "lucide-react";

export function UserAccount() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Loading: show disabled icon (don't redirect)
  if (loading) {
    return (
      <button
        disabled
        className="p-2 text-ink-charcoal opacity-40 cursor-wait"
        aria-label="Loading account"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  // Not logged in: show dropdown with Sign In / Register
  if (!user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors"
          aria-label="Account"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-soft-silk-border rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => { router.push("/login"); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-ink-charcoal hover:bg-muted transition-colors text-left"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <div className="border-t border-soft-silk-border" />
            <button
              onClick={() => { router.push("/login?tab=register"); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-ink-charcoal hover:bg-muted transition-colors text-left"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>
        )}
      </div>
    );
  }

  // Logged in: show user dropdown
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors relative"
        aria-label="Account"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-saffron-crimson rounded-full" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-soft-silk-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-soft-silk-border">
            <p className="text-sm font-medium text-ink-charcoal">{user.name}</p>
            <p className="text-xs text-deep-taupe truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <button
              onClick={() => { router.push("/account"); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-charcoal hover:bg-muted rounded transition-colors text-left"
            >
              <User className="w-4 h-4" />
              My Account
            </button>
            <button
              onClick={() => { router.push("/orders"); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-charcoal hover:bg-muted rounded transition-colors text-left"
            >
              <Package className="w-4 h-4" />
              My Orders
            </button>
            <button
              onClick={() => { router.push("/account#addresses"); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-charcoal hover:bg-muted rounded transition-colors text-left"
            >
              <MapPin className="w-4 h-4" />
              Address Book
            </button>
            <div className="border-t border-soft-silk-border my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
