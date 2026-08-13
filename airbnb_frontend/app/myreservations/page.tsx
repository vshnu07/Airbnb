import apiService from "../services/apiService";
import { getUserId } from "../lib/actions";
import MyTripsClient from "../components/trips/MyTripsClient";
import Link from "next/link";

const MyReservationsPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-[1400px] mx-auto px-6 py-20 text-center">
                <div className="p-12 bg-gray-50 rounded-3xl border border-gray-200 max-w-md mx-auto space-y-4">
                    <span className="text-4xl">🔒</span>
                    <h2 className="text-xl font-bold text-gray-900">Please Log In</h2>
                    <p className="text-xs text-gray-500">Log in to view your bookings, trip receipts, and manage your stays.</p>
                </div>
            </main>
        );
    }

    let reservations = [];
    try {
        reservations = await apiService.get('/api/auth/myreservations/');
        if (!Array.isArray(reservations)) {
            reservations = [];
        }
    } catch (e) {
        console.error('Error fetching reservations:', e);
    }

    return (
        <MyTripsClient
            initialReservations={reservations}
        />
    );
};

export default MyReservationsPage;