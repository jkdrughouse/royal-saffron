import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/app/lib/products";
import ProductClientSection from "./ProductClientSection";
import JsonLd from "@/components/json-ld";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) return { title: "Product Not Found" };

    const title = `${product.name} — Authentic Kashmiri ${product.category}`;
    const ogImage = product.image.startsWith('/') ? `https://jhelumkesarco.com${product.image}` : product.image;

    return {
        title,
        description: product.description,
        alternates: { canonical: `/product/${id}` },
        openGraph: {
            title,
            description: product.description,
            url: `https://jhelumkesarco.com/product/${id}`,
            type: 'website',
            images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: product.description,
            images: [ogImage],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) notFound();

    const ogImage = product.image.startsWith('/') ? `https://jhelumkesarco.com${product.image}` : product.image;

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": ogImage,
        "sku": product.sku ?? product.id,
        "brand": { "@type": "Brand", "name": "Jhelum Kesar Co." },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": product.price,
            "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
            "availability": "https://schema.org/InStock",
            "url": `https://jhelumkesarco.com/product/${id}`,
            "seller": { "@type": "Organization", "name": "Jhelum Kesar Co." },
        },
        ...(product.averageRating
            ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": product.averageRating, "reviewCount": product.reviewCount ?? 1 } }
            : {}),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jhelumkesarco.com" },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://jhelumkesarco.com/shop" },
            { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://jhelumkesarco.com/product/${id}` },
        ],
    };

    return (
        <>
            <JsonLd data={productJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <ProductClientSection product={product} />
        </>
    );
}
