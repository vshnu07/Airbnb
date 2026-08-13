'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReservationSidebar from './ReservationSidebar';
import MapView from '../map/MapView';
import usePhotoGalleryModal from '@/app/hooks/usePhotoGalleryModal';
import useReviewModal from '@/app/hooks/useReviewModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

interface PropertyDetailContentProps {
    property: any;
    userId: string | null;
}

const amenityIconMap: Record<string, string> = {
    'Wifi': '📶',
    'Pool': '🏊',
    'Air conditioning': '❄️',
    'Kitchen': '🍳',
    'Dedicated workspace': '💻',
    'Free parking': '🚗',
    'TV': '📺',
    'Hot tub': '🛁',
    'Washer': '🧺',
    'EV charger': '⚡',
    'Beach access': '🏖️',
    'Mountain view': '🏔️',
    'Garden view': '🌿',
    'Balcony': '🌅',
    'Indoor fireplace': '🔥',
};

const PropertyDetailContent: React.FC<PropertyDetailContentProps> = ({
    property,
    userId
}) => {
    const photoGallery = usePhotoGalleryModal();
    const reviewModal = useReviewModal();
    const toast = useToast();

    const [isFavorite, setIsFavorite] = useState(property.is_favorite || false);
    const [reviews, setReviews] = useState(property.reviews || []);
    const [ratingAvg, setRatingAvg] = useState(property.rating_avg || 4.95);
    const [reviewsCount, setReviewsCount] = useState(property.reviews_count || (property.reviews ? property.reviews.length : 0));

    // Gallery photos
    const allImages: string[] = [];
    if (property.image_url) allImages.push(property.image_url);
    if (property.images && Array.isArray(property.images)) {
        property.images.forEach((img: any) => {
            const url = img.image_url || img.image;
            if (url && !allImages.includes(url)) {
                allImages.push(url);
            }
        });
    }
    // If fewer than 5 images, fill with beautiful complementary perspectives
    while (allImages.length < 5) {
        allImages.push('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    }

    const openGallery = (index = 0) => {
        photoGallery.open(allImages, property.title, index);
    };

    const toggleFavorite = async () => {
        if (!userId) {
            toast.show('Please log in to save to wishlists.', 'info');
            return;
        }
        try {
            const response = await apiService.post(`/api/properties/${property.id}/toggle_favorite/`, {});
            setIsFavorite(response.is_favorite);
            toast.show(response.message || (response.is_favorite ? 'Saved to Wishlist' : 'Removed from Wishlist'), 'success');
        } catch (err) {
            toast.show('Failed to update wishlist.', 'error');
        }
    };

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.show('Link copied to clipboard!', 'success');
        }
    };

    const refreshReviews = async () => {
        try {
            const res = await apiService.get(`/api/properties/${property.id}/reviews/`);
            if (res.reviews) {
                setReviews(res.reviews);
                setRatingAvg(res.rating_avg);
                setReviewsCount(res.reviews_count);
            }
        } catch (e) {
            console.error('Failed to refresh reviews:', e);
        }
    };

    const categoryRatings = property.category_ratings || {
        cleanliness: 4.9,
        accuracy: 4.9,
        communication: 5.0,
        location: 4.9,
        value: 4.8
    };

    return (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-8">
            {/* Header: Title & Actions */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {property.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 font-semibold text-gray-800">
                        <span className="text-airbnb">★</span>
                        <span>{Number(ratingAvg).toFixed(2)}</span>
                        <span>•</span>
                        <span className="underline cursor-pointer">{reviewsCount} reviews</span>
                        <span>•</span>
                        {property.landlord?.is_superhost && (
                            <>
                                <span className="text-gray-500">🏆 Superhost</span>
                                <span>•</span>
                            </>
                        )}
                        <span className="underline text-gray-600 font-medium">
                            {property.city ? `${property.city}, ${property.country || 'India'}` : property.country}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center space-x-1.5 underline font-semibold text-gray-700 hover:text-black transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Share</span>
                        </button>

                        <button
                            type="button"
                            onClick={toggleFavorite}
                            className="flex items-center space-x-1.5 underline font-semibold text-gray-700 hover:text-black transition"
                        >
                            <svg
                                className={`w-4 h-4 ${isFavorite ? 'fill-airbnb text-airbnb' : 'fill-none stroke-current'}`}
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span>{isFavorite ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 5-Photo Gallery Grid Layout */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[350px] sm:h-[420px] md:h-[480px]">
                    {/* Main Hero Photo (Left 2 cols) */}
                    <div 
                        onClick={() => openGallery(0)}
                        className="relative md:col-span-2 h-full cursor-pointer overflow-hidden group"
                    >
                        <Image
                            src={allImages[0]}
                            alt={property.title}
                            fill
                            priority
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                    </div>

                    {/* Right Grid (2 cols x 2 rows) */}
                    <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
                        {allImages.slice(1, 5).map((imgUrl, idx) => (
                            <div
                                key={idx}
                                onClick={() => openGallery(idx + 1)}
                                className="relative h-full cursor-pointer overflow-hidden group"
                            >
                                <Image
                                    src={imgUrl}
                                    alt={`${property.title} view ${idx + 2}`}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Show All Photos Button */}
                <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-900 shadow-md hover:bg-white hover:shadow-lg transition flex items-center space-x-2 border border-gray-200"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Show all {allImages.length} photos</span>
                </button>
            </div>

            {/* Main Content & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
                {/* Left Column: Property Details (2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Host Summary */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Entire {property.property_type || property.category || 'villa'} hosted by {property.landlord?.name || 'Superhost'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {property.guests} guests • {property.bedrooms} bedrooms • {property.beds} beds • {property.bathrooms} bathrooms
                            </p>
                        </div>

                        <Link href={`/landlords/${property.landlord?.id}`} className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 hover:border-black transition">
                            <Image
                                src={property.landlord?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                                alt={property.landlord?.name || 'Host avatar'}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </Link>
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-4 pb-6 border-b border-gray-200">
                        <div className="flex items-start space-x-4">
                            <span className="text-2xl">🗝️</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Self check-in</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Check yourself in with the smart lock & digital keypad.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Dedicated Superhost</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Superhosts are experienced, highly rated hosts committed to great stays.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <span className="text-2xl">📍</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Prime Location</h4>
                                <p className="text-xs text-gray-500 mt-0.5">95% of recent guests gave the location a 5-star rating.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <span className="text-2xl">🚗</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Free parking on premises</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Complimentary private parking available for multiple vehicles.</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About this place</h3>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {/* Sleeping Arrangements */}
                    <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Where you will sleep</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[...Array(Math.min(property.bedrooms || 2, 3))].map((_, i) => (
                                <div key={i} className="p-5 border border-gray-200 rounded-2xl space-y-2">
                                    <span className="text-2xl">🛏️</span>
                                    <h4 className="text-sm font-bold text-gray-900">Bedroom {i + 1}</h4>
                                    <p className="text-xs text-gray-500">{i === 0 ? '1 king bed' : '1 queen bed'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities ("What this place offers") */}
                    <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {(property.amenities && property.amenities.length > 0
                                ? property.amenities
                                : ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Dedicated workspace', 'Free parking', 'TV', 'Hot tub']
                            ).map((amenity: string) => (
                                <div key={amenity} className="flex items-center space-x-3 text-sm text-gray-800">
                                    <span className="text-xl">{amenityIconMap[amenity] || '✨'}</span>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Host Profile Section */}
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                                <Image
                                    src={property.landlord?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                                    alt={property.landlord?.name || 'Host'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Hosted by {property.landlord?.name || 'Superhost'}</h3>
                                <p className="text-xs text-gray-500">Superhost • 7 years hosting on Airbnb</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">
                            {property.landlord?.bio || 'Passionate boutique hospitality host dedicated to creating memorable, serene stays with handpicked local experiences and bespoke comfort.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 pt-2">
                            <div><strong>Response rate:</strong> 100%</div>
                            <div><strong>Response time:</strong> within an hour</div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href={`/landlords/${property.landlord?.id}`}
                                className="inline-block px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-xl shadow transition"
                            >
                                Contact Host
                            </Link>
                        </div>
                    </div>

                    {/* Location & Map Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Where you will be</h3>
                        <p className="text-xs text-gray-500">
                            {property.address ? `${property.address}, ` : ''}{property.city ? `${property.city}, ` : ''}{property.country || 'India'}
                        </p>
                        <MapView
                            singleProperty={{
                                id: property.id,
                                title: property.title,
                                image_url: property.image_url,
                                price_per_night: property.price_per_night,
                                latitude: property.latitude || 15.5808,
                                longitude: property.longitude || 73.7423,
                                city: property.city,
                                country: property.country
                            }}
                            height="380px"
                        />
                    </div>

                    {/* Reviews Section */}
                    <div className="pt-6 border-t border-gray-200 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2 text-2xl font-extrabold text-gray-900">
                                <span className="text-airbnb">★</span>
                                <span>{Number(ratingAvg).toFixed(2)}</span>
                                <span className="text-gray-400 font-normal">•</span>
                                <span>{reviewsCount} reviews</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => reviewModal.open(property.id, property.title, refreshReviews)}
                                className="px-5 py-2.5 border border-gray-300 hover:border-black font-bold text-xs rounded-xl transition shadow-sm"
                            >
                                Write a Review
                            </button>
                        </div>

                        {/* Category Rating Bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 text-xs">
                            {Object.entries(categoryRatings).map(([key, val]: any) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="capitalize text-gray-700 font-medium">{key}</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black rounded-full"
                                                style={{ width: `${(Number(val) / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-gray-900 w-6 text-right">{Number(val).toFixed(1)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reviews Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            {reviews.map((rev: any) => (
                                <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                            <Image
                                                src={rev.author?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                                                alt={rev.author?.name || 'Reviewer'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900">{rev.author?.name || 'Traveler'}</h4>
                                            <p className="text-[10px] text-gray-400">
                                                {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent stay'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                                        {rev.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Reservation Sidebar (1 col) */}
                <div className="lg:col-span-1">
                    <ReservationSidebar
                        property={property}
                        userId={userId}
                    />
                </div>
            </div>
        </main>
    );
};

export default PropertyDetailContent;
