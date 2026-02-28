import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: "/(.*)",
                headers: [
                    // Fix 1: Prevent MIME type sniffing
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    // Fix 2: Prevent clickjacking
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    // Fix 5: Upgraded HSTS with subdomains + preload
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    // Fix 6a: Referrer Policy
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    // Fix 6b: Permissions Policy — disable unneeded browser features
                    {
                        key: "Permissions-Policy",
                        value:
                            "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)",
                    },
                    // Cross-Origin isolation headers
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Cross-Origin-Resource-Policy",
                        value: "same-origin",
                    },
                    // Reduce server info exposure
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                ],
            },
            // Fix 3: Restrict CORS — only allow our own domain on API routes
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "https://jhelumkesarco.com",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                    {
                        key: "Access-Control-Allow-Credentials",
                        value: "true",
                    },
                ],
            },
            // Fix 8: Long cache for hashed static assets
            {
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // Fix 8: Cache for public images/fonts
            {
                source: "/images/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/fonts/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
