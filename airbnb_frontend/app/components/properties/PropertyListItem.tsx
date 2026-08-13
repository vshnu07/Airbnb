'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import FavoriteButton from "../FavoriteButton";

export type PropertyType = {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    price_per_night: number;
    is_favorite: boolean;
    city?: string;
    country?: string;
    category?: string;
    property_type?: string;
    rating_avg?: number;
    reviews_count?: number;
    landlord?: {
        id: string;
        name: string;
        avatar_url: string;
        is_superhost?: boolean;
    };
};

interface PropertyProps {
    property: PropertyType;
    markFavorite?: (is_favorite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
    property,
    markFavorite
}) => {
    const router = useRouter();
    const isSuperhost = property.landlord?.is_superhost || (property.rating_avg && property.rating_avg >= 4.9);
    const locationDisplay = property.city 
        ? `${property.city}, ${property.country || 'India'}` 
        : property.country || 'India';

    const formattedPrice = Number(property.price_per_night).toLocaleString('en-IN');

    return (
        <div 
            className="cursor-pointer group flex flex-col w-full"
            onClick={() => router.push(`/properties/${property.id}`)}
        >
            {/* Image Container with Heart Button & Superhost Badge */}
            <div className="relative overflow-hidden aspect-[20/19] rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-md transition">
                <Image
                    fill
                    src={property.image_url}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="group-hover:scale-105 object-cover transition-transform duration-300 h-full w-full"
                    alt={property.title}
                />

                {/* Superhost Badge */}
                {isSuperhost && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-sm border border-gray-100 flex items-center space-x-1">
                        <span className="text-airbnb font-extrabold">★</span>
                        <span>Superhost</span>
                    </div>
                )}

                {/* Favorite Heart Button */}
                {markFavorite && (
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute top-3 right-3 z-10 transition transform hover:scale-110"
                    >
                        <FavoriteButton
                            id={property.id}
                            is_favorite={property.is_favorite}
                            markFavorite={(is_favorite) => markFavorite(is_favorite)}
                        />
                    </div>
                )}
            </div>

            {/* Info Section - Clean non-overlapping vertical flow */}
            <div className="mt-3 flex flex-col space-y-1 text-sm">
                {/* Row 1: Location on left, Rating on right */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <p className="font-bold text-gray-900 truncate min-w-0 flex-1">
                        {locationDisplay}
                    </p>

                    {/* Rating score */}
                    <div className="flex items-center space-x-1 flex-shrink-0 text-xs font-semibold text-gray-900">
                        <span className="text-black">★</span>
                        <span>{property.rating_avg ? Number(property.rating_avg).toFixed(2) : '4.95'}</span>
                        {property.reviews_count ? (
                            <span className="text-gray-400 font-normal">({property.reviews_count})</span>
                        ) : null}
                    </div>
                </div>

                {/* Row 2: Subtitle / Property Type */}
                <p className="text-xs text-gray-500 truncate">
                    {property.property_type || property.category || 'Entire rental unit'} • {property.title}
                </p>

                {/* Row 3: Price in Indian Rupees (₹) */}
                <div className="pt-0.5 flex items-baseline space-x-1">
                    <span className="font-extrabold text-gray-900 text-sm">
                        ₹{formattedPrice}
                    </span>
                    <span className="text-xs text-gray-500">night</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyListItem;