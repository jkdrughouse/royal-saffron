"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/app/lib/analytics";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view when route changes
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, searchParams]);

  // GA scripts are loaded in layout.tsx via next/script (strategy="afterInteractive")
  // No inline scripts here to keep CSP nonce-based policy clean
  return null;
}
