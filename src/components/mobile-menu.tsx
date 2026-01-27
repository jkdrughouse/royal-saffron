"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, User, Package, Home, ShoppingBag, Grid3x3, MessageCircle, BookOpen } from "lucide-react";

export function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
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

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu Panel */}
      <nav
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[70] md:hidden overflow-hidden transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
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
        <div className="flex flex-col overflow-y-auto h-[calc(100%-88px)] bg-white">
          <div className="flex-1 py-4 bg-white">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors ${pathname === "/"
                ? "text-saffron-crimson bg-parchment-cream"
                : "text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream"
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              href="/shop"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors ${pathname.startsWith("/shop")
                ? "text-saffron-crimson bg-parchment-cream"
                : "text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream"
                }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop</span>
            </Link>

            <Link
              href="/categories"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors ${pathname === "/categories"
                ? "text-saffron-crimson bg-parchment-cream"
                : "text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream"
                }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span>Categories</span>
            </Link>

            <div className="my-4 border-t border-soft-silk-border" />

            <Link
              href="/#our-story"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Our Story</span>
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors ${pathname === "/contact"
                ? "text-saffron-crimson bg-parchment-cream"
                : "text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream"
                }`}
            >
              <MessageCircle className="w-5 h-5" />
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
                  className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors text-left"
                >
                  <User className="w-5 h-5" />
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/orders");
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors text-left"
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
                className="w-full flex items-center gap-4 px-6 py-4 text-base font-medium text-deep-taupe hover:text-saffron-crimson transition-colors text-left"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
