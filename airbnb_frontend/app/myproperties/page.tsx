import apiService from "../services/apiService";
import { getUserId } from "../lib/actions";
import HostDashboardClient from "../components/host/HostDashboardClient";
import Link from "next/link";

const MyPropertiesPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-[1400px] mx-auto px-6 py-20 text-center">
                <div className="p-12 bg-gray-50 rounded-3xl border border-gray-200 max-w-md mx-auto space-y-4">
                    <span className="text-4xl">👑</span>
                    <h2 className="text-xl font-bold text-gray-900">Host Dashboard</h2>
                    <p className="text-xs text-gray-500">Please log in to manage your listings, view guest bookings, and track your host earnings.</p>
                </div>
            </main>
        );
    }

    let dashboardData = {
        host: null,
        stats: {
            total_listings: 0,
            total_bookings: 0,
            confirmed_bookings: 0,
            total_earnings: 0
        },
        properties: [],
        reservations: []
    };

    try {
        const res = await apiService.get('/api/auth/host/dashboard/');
        if (res && res.properties) {
            dashboardData = res;
        }
    } catch (e) {
        console.error('Error fetching host dashboard:', e);
    }

    return (
        <HostDashboardClient
            dashboardData={dashboardData}
        />
    );
};

export default MyPropertiesPage;