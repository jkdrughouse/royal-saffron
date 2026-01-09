"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, Package } from "lucide-react";

export function MobileMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />
          <nav className="fixed top-16 left-0 right-0 bg-pure-ivory shadow-lg z-50 md:hidden border-b border-soft-silk-border">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={closeMenu}
                className="px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase border-b border-soft-silk-border"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase border-b border-soft-silk-border"
              >
                Shop
              </Link>
              <Link
                href="#our-story"
                onClick={closeMenu}
                className="px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase border-b border-soft-silk-border"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase border-b border-soft-silk-border"
              >
                Contact
              </Link>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/account");
                      closeMenu();
                    }}
                    className="w-full px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase border-b border-soft-silk-border flex items-center gap-2 text-left"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      router.push("/orders");
                      closeMenu();
                    }}
                    className="w-full px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase flex items-center gap-2 text-left"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    closeMenu();
                  }}
                  className="w-full px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase flex items-center gap-2 text-left"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
