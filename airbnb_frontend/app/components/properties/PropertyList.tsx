'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyListItem, { PropertyType } from "./PropertyListItem";
import MapView, { MapProperty } from "../map/MapView";
import apiService from '@/app/services/apiService';
import useSearchModal from '@/app/hooks/useSearchModal';

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
    showMap?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites,
    showMap = false
}) => {
    const params = useSearchParams();
    const searchModal = useSearchModal();
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const markFavorite = (id: string, is_favorite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id === id) {
                return { ...property, is_favorite };
            }
            return property;
        });
        setProperties(tmpProperties);
    };

    const getProperties = async (targetPage = 1) => {
        setLoading(true);
        try {
            let url = `/api/properties/?page=${targetPage}&limit=12`;

            if (landlord_id) {
                url += `&landlord_id=${landlord_id}`;
            } else if (favorites) {
                url += '&is_favorites=true';
            } else {
                const q = searchModal.query;

                if (q.query) {
                    url += `&query=${encodeURIComponent(q.query)}`;
                }
                if (q.country) {
                    url += `&country=${encodeURIComponent(q.country)}`;
                }
                if (q.city) {
                    url += `&city=${encodeURIComponent(q.city)}`;
                }
                if (q.category) {
                    url += `&category=${encodeURIComponent(q.category)}`;
                }
                if (q.propertyType) {
                    url += `&property_type=${encodeURIComponent(q.propertyType)}`;
                }
                if (q.guests && q.guests > 1) {
                    url += `&numGuests=${q.guests}`;
                }
                if (q.bedrooms && q.bedrooms > 0) {
                    url += `&numBedrooms=${q.bedrooms}`;
                }
                if (q.bathrooms && q.bathrooms > 0) {
                    url += `&numBathrooms=${q.bathrooms}`;
                }
                if (q.beds && q.beds > 0) {
                    url += `&numBeds=${q.beds}`;
                }
                if (q.minPrice) {
                    url += `&min_price=${q.minPrice}`;
                }
                if (q.maxPrice) {
                    url += `&max_price=${q.maxPrice}`;
                }
                if (q.amenities && q.amenities.length > 0) {
                    url += `&amenities=${encodeURIComponent(q.amenities.join(','))}`;
                }
                if (q.checkIn && q.checkOut && new Date(q.checkIn) < new Date(q.checkOut)) {
                    url += `&checkIn=${format(q.checkIn, 'yyyy-MM-dd')}`;
                    url += `&checkOut=${format(q.checkOut, 'yyyy-MM-dd')}`;
                }
            }

            const response = await apiService.get(url);

            const rawList = response.data || response.results || [];
            const favIds = response.favorites || [];

            const formatted = rawList.map((property: PropertyType) => ({
                ...property,
                is_favorite: favIds.includes(property.id)
            }));

            setProperties(formatted);
            setTotalCount(response.count || formatted.length);
            setTotalPages(response.total_pages || 1);
            setPage(response.current_page || targetPage);
        } catch (err) {
            console.error('Failed to fetch properties:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProperties(1);
    }, [searchModal.query, landlord_id, favorites, params]);

    if (loading) {
        return (
            <div className="col-span-full py-16 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-airbnb"></div>
                <p className="text-sm font-semibold text-gray-500">Searching stays across the globe...</p>
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-3xl border border-gray-200 p-8">
                <span className="text-5xl">🏖️</span>
                <h3 className="text-xl font-bold text-gray-900">No exact matches found</h3>
                <p className="text-sm text-gray-500 max-w-md">
                    Try adjusting or resetting your search dates, location, price filters, or category to find available stays.
                </p>
                <button
                    type="button"
                    onClick={() => searchModal.resetQuery()}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition shadow-md"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    // Map View
    if (showMap) {
        const mapProperties: MapProperty[] = properties.map(p => ({
            id: p.id,
            title: p.title,
            image_url: p.image_url,
            price_per_night: p.price_per_night,
            city: p.city,
            country: p.country,
            rating_avg: p.rating_avg,
        }));

        return (
            <div className="col-span-full w-full">
                <MapView properties={mapProperties} height="75vh" />
            </div>
        );
    }

    return (
        <div className="col-span-full w-full space-y-8">
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <PropertyListItem 
                        key={property.id}
                        property={property}
                        markFavorite={(is_favorite: boolean) => markFavorite(property.id, is_favorite)}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-gray-500">
                        Showing page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages}</span> ({totalCount} total stays)
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => getProperties(page - 1)}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:border-black disabled:opacity-40 disabled:hover:border-gray-300 transition"
                        >
                            ← Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                type="button"
                                onClick={() => getProperties(i + 1)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                                    page === i + 1
                                        ? 'bg-black text-white'
                                        : 'border border-gray-300 text-gray-700 hover:border-black'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => getProperties(page + 1)}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:border-black disabled:opacity-40 disabled:hover:border-gray-300 transition"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyList;