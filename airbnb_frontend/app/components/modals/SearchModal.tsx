'use client';

import Modal from "./Modal";
import { useState, useEffect } from "react";
import { Range } from "react-date-range";
import DatePicker from "../forms/Calendar"; 
import useSearchModal, { SearchQuery } from "@/app/hooks/useSearchModal";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";

const popularDestinations = [
    { name: 'Goa', country: 'India', flag: '🏖️' },
    { name: 'Manali', country: 'India', flag: '🏔️' },
    { name: 'Udaipur', country: 'India', flag: '🏰' },
    { name: 'Jaipur', country: 'India', flag: '👑' },
    { name: 'Bengaluru', country: 'India', flag: '🏙️' },
    { name: 'Kerala', country: 'India', flag: '⛵' },
];

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
};

const SearchModal = () => {
    const searchModal = useSearchModal();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [numGuests, setNumGuests] = useState<string>('1');
    const [numBedrooms, setNumBedrooms] = useState<string>('0');
    const [numBathrooms, setNumBathrooms] = useState<string>('0');
    const [country, setCountry] = useState<SelectCountryValue | undefined>();
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    useEffect(() => {
        if (searchModal.isOpen) {
            setSearchTerm(searchModal.query.query || '');
            setNumGuests((searchModal.query.guests || 1).toString());
            setNumBedrooms((searchModal.query.bedrooms || 0).toString());
            setNumBathrooms((searchModal.query.bathrooms || 0).toString());
            if (searchModal.query.checkIn && searchModal.query.checkOut) {
                setDateRange({
                    startDate: searchModal.query.checkIn,
                    endDate: searchModal.query.checkOut,
                    key: 'selection'
                });
            }
        }
    }, [searchModal.isOpen, searchModal.query]);

    const closeAndSearch = () => {
        const newSearchQuery: SearchQuery = {
            ...searchModal.query,
            query: searchTerm.trim(),
            country: country?.label || searchModal.query.country,
            checkIn: dateRange.startDate,
            checkOut: dateRange.endDate,
            guests: parseInt(numGuests) || 1,
            bedrooms: parseInt(numBedrooms) || 0,
            bathrooms: parseInt(numBathrooms) || 0,
        };

        searchModal.setQuery(newSearchQuery);
        searchModal.close();
    };

    const handleSelectPopular = (dest: { name: string; country: string }) => {
        setSearchTerm(dest.name);
        searchModal.open('checkin');
    };

    const _setDateRange = (selection: Range) => {
        setDateRange(selection);
    };

    const contentLocation = (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Where to?</h3>
                <p className="text-xs text-gray-500">Search by city, title, or destination</p>
            </div>

            {/* Keyword / Destination Input */}
            <div>
                <input
                    type="text"
                    placeholder="Search destinations (e.g. Goa, Manali, Villa...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-2xl text-sm font-semibold focus:outline-none focus:border-black text-gray-900 shadow-sm"
                />
            </div>

            {/* Popular Destinations Pills */}
            <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Popular getaways</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {popularDestinations.map((dest) => (
                        <button
                            key={dest.name}
                            type="button"
                            onClick={() => handleSelectPopular(dest)}
                            className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-left transition"
                        >
                            <span className="text-2xl">{dest.flag}</span>
                            <div>
                                <p className="text-xs font-bold text-gray-900">{dest.name}</p>
                                <p className="text-[10px] text-gray-500">{dest.country}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Country Dropdown */}
            <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Or select by country</p>
                <SelectCountry
                    value={country}
                    onChange={(value) => setCountry(value as SelectCountryValue)}
                />
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="button"
                    onClick={() => searchModal.open('checkin')}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                    Next: Choose dates →
                </button>
            </div>
        </div>
    );

    const contentCheckin = (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">When will you be there?</h3>
                <p className="text-xs text-gray-500">Select your travel dates for availability</p>
            </div>

            <div className="flex justify-center border border-gray-200 rounded-2xl p-2 bg-white">
                <DatePicker
                    value={dateRange}
                    onChange={(value) => _setDateRange(value.selection)}
                />
            </div>

            <div className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={() => searchModal.open('location')}
                    className="text-xs font-bold underline text-gray-600 hover:text-black"
                >
                    ← Back to Location
                </button>
                <button
                    type="button"
                    onClick={() => searchModal.open('details')}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                    Next: Who is coming? →
                </button>
            </div>
        </div>
    );

    const contentDetails = (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Who is coming?</h3>
                <p className="text-xs text-gray-500">Specify guest capacity & room preferences</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-2xl">
                    <div>
                        <p className="font-bold text-sm text-gray-900">Guests</p>
                        <p className="text-xs text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            disabled={parseInt(numGuests) <= 1}
                            onClick={() => setNumGuests(Math.max(1, parseInt(numGuests) - 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black disabled:opacity-30"
                        >
                            -
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{numGuests}</span>
                        <button
                            type="button"
                            onClick={() => setNumGuests((parseInt(numGuests) + 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-2xl">
                    <div>
                        <p className="font-bold text-sm text-gray-900">Bedrooms</p>
                        <p className="text-xs text-gray-500">Minimum number of rooms</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            disabled={parseInt(numBedrooms) <= 0}
                            onClick={() => setNumBedrooms(Math.max(0, parseInt(numBedrooms) - 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black disabled:opacity-30"
                        >
                            -
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{numBedrooms === '0' ? 'Any' : numBedrooms}</span>
                        <button
                            type="button"
                            onClick={() => setNumBedrooms((parseInt(numBedrooms) + 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-2xl">
                    <div>
                        <p className="font-bold text-sm text-gray-900">Bathrooms</p>
                        <p className="text-xs text-gray-500">Minimum number of baths</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            disabled={parseInt(numBathrooms) <= 0}
                            onClick={() => setNumBathrooms(Math.max(0, parseInt(numBathrooms) - 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black disabled:opacity-30"
                        >
                            -
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{numBathrooms === '0' ? 'Any' : numBathrooms}</span>
                        <button
                            type="button"
                            onClick={() => setNumBathrooms((parseInt(numBathrooms) + 1).toString())}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={() => searchModal.open('checkin')}
                    className="text-xs font-bold underline text-gray-600 hover:text-black"
                >
                    ← Back to Dates
                </button>
                <button
                    type="button"
                    onClick={closeAndSearch}
                    className="px-8 py-3.5 bg-gradient-to-r from-airbnb to-airbnb-dark text-white font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search Stays</span>
                </button>
            </div>
        </div>
    );

    let content = contentLocation;
    if (searchModal.step === 'checkin' || searchModal.step === 'checkout') {
        content = contentCheckin;
    } else if (searchModal.step === 'details') {
        content = contentDetails;
    }

    return (
        <Modal
            label="Search Stays"
            content={content}
            close={searchModal.close}
            isOpen={searchModal.isOpen}
        />
    );
};

export default SearchModal;