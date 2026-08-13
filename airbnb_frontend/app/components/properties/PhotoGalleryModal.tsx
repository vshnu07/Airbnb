'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import usePhotoGalleryModal from '@/app/hooks/usePhotoGalleryModal';

const PhotoGalleryModal = () => {
    const gallery = usePhotoGalleryModal();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (gallery.isOpen) {
            setCurrentIndex(gallery.initialIndex || 0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [gallery.isOpen, gallery.initialIndex]);

    if (!gallery.isOpen || !gallery.images.length) return null;

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? gallery.images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === gallery.images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between backdrop-blur-md animate-fade-in">
            {/* Header */}
            <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={gallery.close}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold tracking-wide">
                        {gallery.title || 'Photo Gallery'}
                    </span>
                </div>
                <div className="text-sm font-medium px-4 py-1.5 rounded-full bg-white/10">
                    {currentIndex + 1} / {gallery.images.length}
                </div>
            </div>

            {/* Main Carousel Display */}
            <div className="relative flex-1 flex items-center justify-center p-4 md:p-8">
                {/* Previous Button */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 md:left-8 z-10 p-3.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition border border-white/20 shadow-xl"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Active Photo */}
                <div className="relative w-full h-[65vh] max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src={gallery.images[currentIndex]}
                        alt={`Photo ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Next Button */}
                <button
                    onClick={nextImage}
                    className="absolute right-4 md:right-8 z-10 p-3.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition border border-white/20 shadow-xl"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="p-4 bg-black/60 border-t border-white/10 overflow-x-auto">
                <div className="flex items-center justify-center space-x-3 max-w-4xl mx-auto">
                    {gallery.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition border-2 ${
                                currentIndex === idx ? 'border-airbnb scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhotoGalleryModal;
