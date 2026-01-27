"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, Package, Home, ShoppingBag, Grid3x3 } from "lucide-react";

export function MobileMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not logged in
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Full-Screen Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={closeMenu}
        />

        {/* Slide-in Menu Panel */}
        <nav
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-soft-silk-border">
            <h2 className="font-serif text-2xl font-bold text-saffron-crimson">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 text-ink-charcoal hover:text-saffron-crimson transition-colors rounded-full hover:bg-parchment-cream"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col overflow-y-auto h-[calc(100%-88px)]">
            <div className="flex-1 py-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop</span>
              </Link>
              <Link
                href="/categories"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
              >
                <Grid3x3 className="w-5 h-5" />
                <span>Categories</span>
              </Link>

              <div className="my-4 border-t border-soft-silk-border" />

              <Link
                href="#our-story"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
              >
                <span>Our Story</span>
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
              >
                <span>Contact Us</span>
              </Link>
            </div>

            {/* User Section */}
            <div className="border-t border-soft-silk-border bg-parchment-cream/30">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/account");
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/orders");
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
