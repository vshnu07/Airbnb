'use client';

import { useState, useEffect } from 'react';
import { Range } from 'react-date-range';
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import DatePicker from '../forms/Calendar';
import apiService from '@/app/services/apiService';
import useLoginModal from '@/app/hooks/useLoginModal';
import useCheckoutModal from '@/app/hooks/useCheckoutModal';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    key: 'selection'
};

export type PropertyDetailType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    cleaning_fee?: number;
    service_fee_percentage?: number;
    guests: number;
    city?: string;
    country?: string;
    rating_avg?: number;
    reviews_count?: number;
};

interface ReservationSidebarProps {
    userId: string | null;
    property: PropertyDetailType;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
    property,
    userId
}) => {
    const loginModal = useLoginModal();
    const checkoutModal = useCheckoutModal();

    const [cleaningFee, setCleaningFee] = useState<number>(property.cleaning_fee || 500);
    const [serviceFee, setServiceFee] = useState<number>(0);
    const [nights, setNights] = useState<number>(3);
    const [basePrice, setBasePrice] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [guests, setGuests] = useState<string>('1');

    const guestsRange = Array.from({ length: property.guests || 2 }, (_, index) => index + 1);

    const handleReserveClick = () => {
        if (!userId) {
            loginModal.open();
            return;
        }

        if (!dateRange.startDate || !dateRange.endDate) {
            return;
        }

        checkoutModal.open({
            propertyId: property.id,
            propertyTitle: property.title,
            propertyImage: property.image_url,
            city: property.city || '',
            country: property.country || 'India',
            pricePerNight: property.price_per_night,
            cleaningFee: cleaningFee,
            serviceFee: serviceFee,
            totalPrice: totalPrice,
            nights: nights,
            guests: parseInt(guests),
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ratingAvg: property.rating_avg,
            reviewsCount: property.reviews_count
        });
    };

    const _setDateRange = (selection: any) => {
        const newStartDate = new Date(selection.startDate);
        let newEndDate = new Date(selection.endDate);

        if (newEndDate <= newStartDate) {
            newEndDate = new Date(newStartDate.getTime() + 24 * 60 * 60 * 1000);
        }

        setDateRange({
            startDate: newStartDate,
            endDate: newEndDate,
            key: 'selection'
        });
    };

    const getReservations = async () => {
        try {
            const reservations = await apiService.get(`/api/properties/${property.id}/reservations/`);
            let dates: Date[] = [];

            if (Array.isArray(reservations)) {
                reservations.forEach((reservation: any) => {
                    const range = eachDayOfInterval({
                        start: new Date(reservation.start_date),
                        end: new Date(reservation.end_date)
                    });
                    dates = [...dates, ...range];
                });
            }
            setBookedDates(dates);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        }
    };

    useEffect(() => {
        getReservations();
    }, [property.id]);

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            let dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);
            if (dayCount < 1) dayCount = 1;

            const base = dayCount * property.price_per_night;
            const sFee = Math.round(base * 0.14);
            const cFee = property.cleaning_fee || 500;
            const total = base + cFee + sFee;

            setNights(dayCount);
            setBasePrice(base);
            setCleaningFee(cFee);
            setServiceFee(sFee);
            setTotalPrice(total);
        }
    }, [dateRange, property.price_per_night, property.cleaning_fee]);

    return (
        <aside className="sticky top-28 p-6 rounded-3xl border border-gray-200 shadow-xl bg-white space-y-5">
            {/* Header: Price in ₹ & Rating */}
            <div className="flex justify-between items-baseline">
                <div>
                    <span className="text-2xl font-extrabold text-gray-900">₹{Number(property.price_per_night).toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-500 font-normal"> night</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-gray-800">
                    <span className="text-airbnb">★</span>
                    <span>{property.rating_avg ? Number(property.rating_avg).toFixed(2) : '4.95'}</span>
                    <span className="text-gray-400 font-normal">
                        ({property.reviews_count || 12} reviews)
                    </span>
                </div>
            </div>

            {/* Calendar & Guests Input Box */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:border-black transition">
                {/* Date Picker Section */}
                <div className="p-2 bg-gray-50 border-b border-gray-200">
                    <DatePicker
                        value={dateRange}
                        bookedDates={bookedDates}
                        onChange={(value) => _setDateRange(value.selection)}
                    />
                </div>

                {/* Guests Selector */}
                <div className="p-3 bg-white">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Guests</label>
                    <select 
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full text-sm font-semibold bg-transparent focus:outline-none cursor-pointer mt-0.5"
                    >
                        {guestsRange.map(number => (
                            <option key={number} value={number}>
                                {number} {number === 1 ? 'guest' : 'guests'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reserve Button */}
            <button 
                type="button"
                onClick={handleReserveClick}
                className="w-full py-4 text-center text-white font-bold text-base bg-gradient-to-r from-airbnb to-airbnb-dark hover:opacity-95 rounded-xl shadow-lg transition transform active:scale-98"
            >
                Reserve
            </button>

            <p className="text-center text-xs text-gray-500 font-medium">You won&apos;t be charged yet</p>

            {/* Price Itemized Breakdown in ₹ */}
            <div className="space-y-3 pt-2 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span className="underline">₹{Number(property.price_per_night).toLocaleString('en-IN')} × {nights} nights</span>
                    <span>₹{Number(basePrice).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>₹{Number(cleaningFee).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                    <span className="underline">Airbnb service fee (14%)</span>
                    <span>₹{Number(serviceFee).toLocaleString('en-IN')}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between font-extrabold text-base text-gray-900 pt-1">
                    <span>Total before taxes</span>
                    <span className="text-airbnb">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </aside>
    );
};

export default ReservationSidebar;