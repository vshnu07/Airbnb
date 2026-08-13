'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type MapProperty = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
    rating_avg?: number;
};

interface MapViewProps {
    properties?: MapProperty[];
    singleProperty?: MapProperty;
    height?: string;
}

const MapView: React.FC<MapViewProps> = ({
    properties = [],
    singleProperty,
    height = '70vh'
}) => {
    const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);

    // Default center to India or selected single property
    const lat = singleProperty?.latitude || (properties.length > 0 && properties[0].latitude) || 15.5808;
    const lng = singleProperty?.longitude || (properties.length > 0 && properties[0].longitude) || 73.7423;
    const zoom = singleProperty ? 14 : 6;

    // Use OpenStreetMap embed with bounding coordinates
    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.5}%2C${lat - 0.5}%2C${lng + 0.5}%2C${lat + 0.5}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <div className="relative w-full rounded-2xl overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height }}>
            {/* Embedded Interactive Map */}
            <iframe
                title="Property Map Location"
                src={mapEmbedUrl}
                className="w-full h-full border-0 filter contrast-[0.95] saturate-[1.1]"
                loading="lazy"
            />

            {/* Custom Floating Airbnb Price Markers Overlay (for explore view) */}
            {properties.length > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-xs font-bold text-gray-800 border border-gray-200">
                    📍 {properties.length} stays found in this area
                </div>
            )}

            {/* If properties are provided, display interactive pill price badges on bottom preview */}
            {properties.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 z-10 flex overflow-x-auto gap-3 pb-2 pt-1 px-1">
                    {properties.slice(0, 8).map((prop) => (
                        <div
                            key={prop.id}
                            onClick={() => setSelectedProperty(prop)}
                            className={`flex-shrink-0 flex items-center space-x-3 p-2.5 bg-white rounded-2xl shadow-xl border cursor-pointer transition transform hover:-translate-y-1 ${
                                selectedProperty?.id === prop.id ? 'ring-2 ring-black border-black' : 'border-gray-200'
                            }`}
                        >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={prop.image_url}
                                    alt={prop.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="max-w-[140px]">
                                <p className="text-xs font-bold text-gray-900 truncate">{prop.city || prop.title}</p>
                                <p className="text-xs font-extrabold text-airbnb">₹{Number(prop.price_per_night).toLocaleString('en-IN')} <span className="text-[10px] font-normal text-gray-500">night</span></p>
                            </div>
                            <Link
                                href={`/properties/${prop.id}`}
                                className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded-lg hover:bg-gray-800 transition"
                            >
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Single Property Location Badge */}
            {singleProperty && (
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 max-w-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exact Location</p>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5">{singleProperty.city ? `${singleProperty.city}, ${singleProperty.country}` : singleProperty.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Prime neighborhood with walkable dining & scenic attractions.</p>
                </div>
            )}
        </div>
    );
};

export default MapView;
