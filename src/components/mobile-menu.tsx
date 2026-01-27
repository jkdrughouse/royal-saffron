"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Grid3x3, MessageCircle, BookOpen } from "lucide-react";

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-800 hover:text-red-600 transition-colors"
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
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[70] md:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="font-serif text-2xl font-bold text-red-600">Menu</h2>
          <button
            onClick={closeMenu}
            className="p-2 text-gray-800 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links - Now with explicit rendering */}
        <div className="bg-white min-h-screen">
          <div className="py-2">
            {/* Home */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors border-b border-gray-100 ${pathname === "/"
                  ? "text-red-600 bg-red-50 font-semibold"
                  : "text-gray-800 hover:text-red-600 hover:bg-gray-50"
                }`}
              style={{ display: 'flex', visibility: 'visible' }}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              <span>Home</span>
            </Link>

            {/* Categories */}
            <Link
              href="/categories"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors border-b border-gray-100 ${pathname === "/categories"
                  ? "text-red-600 bg-red-50 font-semibold"
                  : "text-gray-800 hover:text-red-600 hover:bg-gray-50"
                }`}
              style={{ display: 'flex', visibility: 'visible' }}
            >
              <Grid3x3 className="w-5 h-5 flex-shrink-0" />
              <span>Categories</span>
            </Link>

            {/* Our Story */}
            <Link
              href="/#our-story"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-4 text-base font-medium text-gray-800 hover:text-red-600 hover:bg-gray-50 transition-colors border-b border-gray-100"
              style={{ display: 'flex', visibility: 'visible' }}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <span>Our Story</span>
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors border-b border-gray-100 ${pathname === "/contact"
                  ? "text-red-600 bg-red-50 font-semibold"
                  : "text-gray-800 hover:text-red-600 hover:bg-gray-50"
                }`}
              style={{ display: 'flex', visibility: 'visible' }}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
