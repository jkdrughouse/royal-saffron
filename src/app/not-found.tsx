'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="font-serif text-6xl md:text-8xl mb-4 text-ink-charcoal">404</h1>
                <h2 className="font-serif text-2xl md:text-3xl mb-4 text-ink-charcoal">Page Not Found</h2>
                <p className="text-deep-taupe mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="gap-2 w-full sm:w-auto">
                            <Home className="w-5 h-5" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                            <ShoppingBag className="w-5 h-5" />
                            Shop Products
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
