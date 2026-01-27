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
    const [isDragging, setIsDragging] = useState(false);
    const [swipeOffset, setSwipeOffset] = useState(0);

    const currentImage = images[selectedIndex];
    const minSwipeDistance = 50;

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentTouch = e.targetTouches[0].clientX;
        setTouchEnd(currentTouch);

        // Calculate swipe offset for visual feedback
        const offset = currentTouch - touchStart;
        // Add resistance at boundaries
        const resistanceFactor = 0.3;

        if ((selectedIndex === 0 && offset > 0) || (selectedIndex === images.length - 1 && offset < 0)) {
            setSwipeOffset(offset * resistanceFactor);
        } else {
            setSwipeOffset(offset);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        const swipeDistance = touchStart - touchEnd;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe left - next image
                handleNext();
            } else {
                // Swipe right - previous image
                handlePrevious();
            }
        }

        // Reset offset with animation
        setSwipeOffset(0);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-square bg-muted/10 rounded-2xl overflow-hidden group cursor-zoom-in"
                onClick={() => !isDragging && setIsLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    touchAction: "pan-y pinch-zoom",
                }}
            >
                <div
                    className="w-full h-full transition-transform duration-200 ease-out"
                    style={{
                        transform: isDragging ? `translateX(${swipeOffset}px)` : 'translateX(0)',
                    }}
                >
                    <img
                        src={currentImage?.url || images[0]?.url}
                        alt={currentImage?.alt || productName}
                        className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform group-hover:scale-105 duration-300"
                        draggable={false}
                    />
                </div>

                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-95"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-95"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Image Counter & Progress Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        {/* Dots Indicator */}
                        <div className="flex gap-1.5">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(index);
                                    }}
                                    className={`transition-all duration-300 rounded-full ${index === selectedIndex
                                            ? 'w-6 h-2 bg-white'
                                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                        {/* Counter */}
                        <div className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>
                )}

                {/* Swipe Hint (Mobile Only, shown briefly on first visit) */}
                {images.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/40 px-3 py-1.5 rounded-full md:hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        Swipe to browse
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
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${index === selectedIndex
                                    ? "border-saffron-crimson ring-2 ring-saffron-crimson/30 scale-105"
                                    : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-contain bg-muted/10 p-2"
                                draggable={false}
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
                            draggable={false}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevious();
                                    }}
                                    className="absolute left-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors active:scale-95"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    className="absolute right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors active:scale-95"
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
