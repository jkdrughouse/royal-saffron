// Analytics tracking utility
// Supports Google Analytics 4, Plausible, or custom analytics

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Plausible Analytics
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Custom analytics - log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
}

export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: path,
    });
  }

  // Plausible automatically tracks page views
  // Custom tracking can be added here
}

export function trackPurchase(orderId: string, value: number, currency: string = 'INR', items?: Array<{ name: string; quantity: number; price: number }>) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 - ecommerce event
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value,
      currency,
      items: items?.map(item => ({
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  // Custom tracking
  trackEvent('purchase', {
    order_id: orderId,
    value,
    currency,
    items,
  });
}

export function trackAddToCart(productId: string, productName: string, price: number) {
  trackEvent('add_to_cart', {
    product_id: productId,
    product_name: productName,
    price,
  });
}

export function trackRemoveFromCart(productId: string, productName: string) {
  trackEvent('remove_from_cart', {
    product_id: productId,
    product_name: productName,
  });
}

export function trackSearch(query: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
}

export function trackProductView(productId: string, productName: string, category?: string) {
  trackEvent('view_item', {
    product_id: productId,
    product_name: productName,
    category,
  });
}

export function trackAddToWishlist(productId: string, productName: string) {
  trackEvent('add_to_wishlist', {
    product_id: productId,
    product_name: productName,
  });
}

export function trackRemoveFromWishlist(productId: string, productName: string) {
  trackEvent('remove_from_wishlist', {
    product_id: productId,
    product_name: productName,
  });
}
