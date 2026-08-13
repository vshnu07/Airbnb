'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useReviewModal from '@/app/hooks/useReviewModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

interface MyTripsClientProps {
    initialReservations: any[];
}

const MyTripsClient: React.FC<MyTripsClientProps> = ({ initialReservations }) => {
    const reviewModal = useReviewModal();
    const toast = useToast();

    const [reservations, setReservations] = useState<any[]>(initialReservations);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const upcomingTrips = reservations.filter(r => r.status === 'confirmed' && r.end_date >= todayStr);
    const pastTrips = reservations.filter(r => r.status === 'completed' || (r.status === 'confirmed' && r.end_date < todayStr));
    const cancelledTrips = reservations.filter(r => r.status === 'cancelled');

    const displayedTrips = activeTab === 'upcoming' 
        ? upcomingTrips 
        : activeTab === 'past' 
        ? pastTrips 
        : cancelledTrips;

    const handleCancelReservation = async (reservationId: string, propertyTitle: string) => {
        if (!confirm(`Are you sure you want to cancel your reservation for "${propertyTitle}"? The dates will be unblocked.`)) {
            return;
        }

        setCancellingId(reservationId);
        try {
            const response = await apiService.post(`/api/auth/reservations/${reservationId}/cancel/`, {});
            if (response.success) {
                toast.show('Reservation cancelled. The dates are now unblocked.', 'success');
                setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r));
            } else {
                toast.show(response.error || 'Failed to cancel reservation.', 'error');
            }
        } catch (err: any) {
            toast.show('Error cancelling reservation.', 'error');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trips</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your upcoming journeys, past bookings, and cancellations.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                        activeTab === 'upcoming'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                    Upcoming Trips ({upcomingTrips.length})
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('past')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                        activeTab === 'past'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                    Past Stays ({pastTrips.length})
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('cancelled')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                        activeTab === 'cancelled'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                    Cancelled ({cancelledTrips.length})
                </button>
            </div>

            {/* Trips List */}
            {displayedTrips.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-3xl border border-gray-200 p-8">
                    <span className="text-5xl">🎒</span>
                    <h3 className="text-lg font-bold text-gray-900">
                        {activeTab === 'upcoming' 
                            ? 'No upcoming trips booked... yet!' 
                            : activeTab === 'past' 
                            ? 'No past stays on record' 
                            : 'No cancelled reservations'}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm">
                        {activeTab === 'upcoming' 
                            ? 'Time to dust off your bags and start planning your next great adventure.' 
                            : 'Explore unique places to stay across India and the world.'}
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedTrips.map((reservation) => {
                        const prop = reservation.property;
                        return (
                            <div
                                key={reservation.id}
                                className="p-5 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5"
                            >
                                {/* Property Thumbnail */}
                                <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image
                                        src={prop?.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'}
                                        alt={prop?.title || 'Property image'}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            reservation.status === 'confirmed' 
                                                ? 'bg-emerald-600 text-white shadow-sm' 
                                                : reservation.status === 'completed' 
                                                ? 'bg-blue-600 text-white shadow-sm' 
                                                : 'bg-gray-800 text-white'
                                        }`}>
                                            {reservation.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Reservation Info */}
                                <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            {prop?.city || 'India'}
                                        </p>
                                        <h3 className="text-base font-bold text-gray-900 truncate mt-0.5">
                                            {prop?.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            📅 {reservation.start_date} → {reservation.end_date} ({reservation.number_of_nights} {reservation.number_of_nights === 1 ? 'night' : 'nights'})
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            👥 {reservation.guests || 1} {(reservation.guests || 1) === 1 ? 'guest' : 'guests'}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">Total Paid</span>
                                        <span className="text-base font-extrabold text-gray-900">₹{Number(reservation.total_price).toLocaleString('en-IN')}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <Link
                                            href={`/properties/${prop?.id}`}
                                            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold rounded-xl transition"
                                        >
                                            View Listing
                                        </Link>

                                        {reservation.status === 'confirmed' && (
                                            <button
                                                type="button"
                                                disabled={cancellingId === reservation.id}
                                                onClick={() => handleCancelReservation(reservation.id, prop?.title)}
                                                className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl transition disabled:opacity-50"
                                            >
                                                {cancellingId === reservation.id ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        )}

                                        {(activeTab === 'past' || reservation.status === 'completed') && (
                                            <button
                                                type="button"
                                                onClick={() => reviewModal.open(prop?.id, prop?.title)}
                                                className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl shadow transition"
                                            >
                                                Leave a Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};

export default MyTripsClient;
