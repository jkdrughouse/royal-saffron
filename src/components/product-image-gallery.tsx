"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ProductImage } from "@/app/lib/products";

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const currentImage = images[selectedIndex];

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            // Swipe left
            handleNext();
        }

        if (touchStart - touchEnd < -75) {
            // Swipe right
            handlePrevious();
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-square bg-muted/10 rounded-2xl overflow-hidden group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    src={currentImage?.url || images[0]?.url}
                    alt={currentImage?.alt || productName}
                    className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform group-hover:scale-105 duration-300"
                />

                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>

                {/* Navigation Arrows (Desktop) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex
                                    ? "border-saffron-crimson ring-2 ring-saffron-crimson/30"
                                    : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-contain bg-muted/10 p-2"
                            />
                            {image.caption && (
                                <span className="sr-only">{image.caption}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
                        <img
                            src={currentImage?.url}
                            alt={currentImage?.alt}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevious();
                                    }}
                                    className="absolute left-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    className="absolute right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {currentImage?.caption && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg max-w-2xl text-center">
                            {currentImage.caption}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
