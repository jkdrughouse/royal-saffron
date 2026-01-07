"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
                className="px-6 py-4 text-sm font-bold tracking-widest text-deep-taupe hover:text-saffron-crimson hover:bg-parchment-cream transition-colors uppercase"
              >
                Our Story
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
