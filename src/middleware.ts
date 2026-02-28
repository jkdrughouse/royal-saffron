import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Generate a cryptographically random nonce using the Web Crypto API.
 *  This works in the Edge Runtime (no Node.js built-ins required).
 */
function generateNonce(): string {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes));
}

export function middleware(request: NextRequest) {
    const nonce = generateNonce();
    const cspHeader = [
        // Default — only allow same-origin
        `default-src 'self'`,

        // Scripts: self + Google Analytics/Tag Manager + nonce for inline scripts
        `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com`,

        // Styles: self + Google Fonts + unsafe-inline (Next.js injects inline styles for critical CSS)
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,

        // Fonts: self + Google Fonts CDN
        `font-src 'self' https://fonts.gstatic.com`,

        // Images: self + data URIs + blob (Next.js image optimisation) + Google (maps placeholder)
        `img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com`,

        // Frames: only Google Maps embed on contact page
        `frame-src https://www.google.com`,

        // Fetch/XHR: self + GA + pincode API
        `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://api.postalpincode.in`,

        // Form actions: self only
        `form-action 'self'`,

        // No plugins
        `object-src 'none'`,

        // Base URI: self only — blocks base tag injection
        `base-uri 'self'`,

        // Upgrade insecure requests (forces HTTPS on all resources)
        `upgrade-insecure-requests`,
    ].join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('Content-Security-Policy', cspHeader);

    return response;
}

export const config = {
    matcher: [
        // Apply to all routes except static files and API routes
        // (API routes don't serve HTML so don't need CSP)
        {
            source: '/((?!_next/static|_next/image|favicon.ico|api/).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
