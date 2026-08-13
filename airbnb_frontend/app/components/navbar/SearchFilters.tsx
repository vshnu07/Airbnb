'use client';

import { format } from 'date-fns';
import useSearchModal from "@/app/hooks/useSearchModal";

const SearchFilters = () => {
    const searchModal = useSearchModal();
    const q = searchModal.query;

    const locationLabel = q.city || q.country || q.query || 'Anywhere';
    const datesLabel = q.checkIn && q.checkOut 
        ? `${format(q.checkIn, 'MMM d')} – ${format(q.checkOut, 'MMM d')}` 
        : 'Any week';
    const guestsLabel = q.guests && q.guests > 1 
        ? `${q.guests} guests` 
        : 'Add guests';

    return (
        <div 
            onClick={() => searchModal.open('location')}
            className="h-[48px] lg:h-[52px] flex flex-row items-center justify-between border border-gray-300 rounded-full shadow-sm hover:shadow-md transition cursor-pointer bg-white px-2 py-1"
        >
            <div className="flex flex-row items-center divide-x divide-gray-200">
                <div className="px-4 text-xs font-bold text-gray-900 truncate max-w-[130px]">
                    {locationLabel}
                </div>

                <div className="hidden sm:block px-4 text-xs font-semibold text-gray-600 truncate">
                    {datesLabel}
                </div>

                <div className="hidden md:block px-4 text-xs font-normal text-gray-500 truncate">
                    {guestsLabel}
                </div>
            </div>

            <div className="p-1.5 bg-airbnb hover:bg-airbnb-dark transition rounded-full text-white flex items-center justify-center">
                <svg 
                    viewBox="0 0 32 32" 
                    className="w-3.5 h-3.5 stroke-current stroke-[4] fill-none"
                    aria-hidden="true"
                >
                    <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
                </svg>
            </div>
        </div>
    );
};

export default SearchFilters;