'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import useFilterModal from '@/app/hooks/useFilterModal';
import useSearchModal from '@/app/hooks/useSearchModal';

const propertyTypes = ['Any', 'House', 'Apartment', 'Villa', 'Cabin', 'Chalet', 'Loft', 'Heritage Haveli'];

const amenityOptions = [
    { id: 'Wifi', label: 'Wifi', icon: '📶' },
    { id: 'Pool', label: 'Pool', icon: '🏊' },
    { id: 'Air conditioning', label: 'Air conditioning', icon: '❄️' },
    { id: 'Kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'Dedicated workspace', label: 'Dedicated workspace', icon: '💻' },
    { id: 'Free parking', label: 'Free parking on premises', icon: '🚗' },
    { id: 'TV', label: 'TV', icon: '📺' },
    { id: 'Hot tub', label: 'Hot tub / Jacuzzi', icon: '🛁' },
    { id: 'Washer', label: 'Washer', icon: '🧺' },
    { id: 'EV charger', label: 'EV charger', icon: '⚡' },
    { id: 'Beach access', label: 'Beach access', icon: '🏖️' },
    { id: 'Mountain view', label: 'Mountain view', icon: '🏔️' },
];

const FilterModal = () => {
    const filterModal = useFilterModal();
    const searchModal = useSearchModal();

    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [propertyType, setPropertyType] = useState<string>('Any');
    const [bedrooms, setBedrooms] = useState<number>(0);
    const [beds, setBeds] = useState<number>(0);
    const [bathrooms, setBathrooms] = useState<number>(0);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    useEffect(() => {
        if (filterModal.isOpen) {
            setMinPrice(searchModal.query.minPrice ? searchModal.query.minPrice.toString() : '');
            setMaxPrice(searchModal.query.maxPrice ? searchModal.query.maxPrice.toString() : '');
            setPropertyType(searchModal.query.propertyType || 'Any');
            setBedrooms(searchModal.query.bedrooms || 0);
            setBeds(searchModal.query.beds || 0);
            setBathrooms(searchModal.query.bathrooms || 0);
            setSelectedAmenities(searchModal.query.amenities || []);
        }
    }, [filterModal.isOpen, searchModal.query]);

    const toggleAmenity = (amenityId: string) => {
        if (selectedAmenities.includes(amenityId)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== amenityId));
        } else {
            setSelectedAmenities([...selectedAmenities, amenityId]);
        }
    };

    const handleClearAll = () => {
        setMinPrice('');
        setMaxPrice('');
        setPropertyType('Any');
        setBedrooms(0);
        setBeds(0);
        setBathrooms(0);
        setSelectedAmenities([]);
    };

    const handleApplyFilters = () => {
        searchModal.setQuery({
            ...searchModal.query,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            propertyType: propertyType === 'Any' ? '' : propertyType,
            bedrooms: bedrooms,
            beds: beds,
            bathrooms: bathrooms,
            amenities: selectedAmenities
        });
        filterModal.close();
    };

    const content = (
        <div className="space-y-8 max-h-[70vh] overflow-y-auto px-1 pr-3">
            {/* Price Range */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Price range</h3>
                <p className="text-sm text-gray-500 mb-4">Nightly prices before taxes and fees</p>
                <div className="flex items-center space-x-4">
                    <div className="flex-1 p-3 border border-gray-300 rounded-xl focus-within:border-black transition">
                        <label className="block text-xs text-gray-500 font-medium">Minimum</label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-1">₹</span>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full font-semibold focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <span className="text-gray-400 font-bold">—</span>
                    <div className="flex-1 p-3 border border-gray-300 rounded-xl focus-within:border-black transition">
                        <label className="block text-xs text-gray-500 font-medium">Maximum</label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-1">₹</span>
                            <input
                                type="number"
                                placeholder="25000+"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full font-semibold focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Property Type */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Property type</h3>
                <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setPropertyType(type)}
                            className={`px-4 py-2.5 rounded-full border text-sm font-medium transition ${
                                propertyType === type
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 hover:border-gray-900 text-gray-700'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Rooms and beds */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rooms and beds</h3>
                
                {/* Bedrooms */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Bedrooms</p>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={`bed-${num}`}
                                type="button"
                                onClick={() => setBedrooms(num)}
                                className={`flex-1 py-2 rounded-full border text-xs font-semibold transition ${
                                    bedrooms === num
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-900 text-gray-700'
                                }`}
                            >
                                {num === 0 ? 'Any' : `${num}+`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Beds */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Beds</p>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={`beds-${num}`}
                                type="button"
                                onClick={() => setBeds(num)}
                                className={`flex-1 py-2 rounded-full border text-xs font-semibold transition ${
                                    beds === num
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-900 text-gray-700'
                                }`}
                            >
                                {num === 0 ? 'Any' : `${num}+`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bathrooms */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Bathrooms</p>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={`bath-${num}`}
                                type="button"
                                onClick={() => setBathrooms(num)}
                                className={`flex-1 py-2 rounded-full border text-xs font-semibold transition ${
                                    bathrooms === num
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-900 text-gray-700'
                                }`}
                            >
                                {num === 0 ? 'Any' : `${num}+`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Amenities */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {amenityOptions.map((amenity) => {
                        const isChecked = selectedAmenities.includes(amenity.id);
                        return (
                            <div
                                key={amenity.id}
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                                    isChecked
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <span className="text-lg">{amenity.icon}</span>
                                <span className="text-sm font-medium text-gray-800 flex-1">{amenity.label}</span>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="h-4 w-4 rounded text-airbnb focus:ring-airbnb border-gray-300"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 bg-white py-2">
                <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-sm font-semibold underline text-gray-800 hover:text-black"
                >
                    Clear all
                </button>
                <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition shadow-md hover:shadow-lg"
                >
                    Show results
                </button>
            </div>
        </div>
    );

    return (
        <Modal
            label="Filters"
            content={content}
            isOpen={filterModal.isOpen}
            close={filterModal.close}
        />
    );
};

export default FilterModal;
