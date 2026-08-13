'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useAddPropertyModal from '@/app/hooks/useAddPropertyModal';
import useEditPropertyModal, { PropertyEditData } from '@/app/hooks/useEditPropertyModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

interface HostDashboardProps {
    dashboardData: {
        host: any;
        stats: {
            total_listings: number;
            total_bookings: number;
            confirmed_bookings: number;
            total_earnings: number;
        };
        properties: any[];
        reservations: any[];
    };
}

const HostDashboardClient: React.FC<HostDashboardProps> = ({ dashboardData }) => {
    const addPropertyModal = useAddPropertyModal();
    const editPropertyModal = useEditPropertyModal();
    const toast = useToast();

    const [properties, setProperties] = useState<any[]>(dashboardData?.properties || []);
    const [reservations, setReservations] = useState<any[]>(dashboardData?.reservations || []);
    const [stats, setStats] = useState(dashboardData?.stats || {
        total_listings: properties.length,
        total_bookings: reservations.length,
        confirmed_bookings: reservations.filter((r: any) => r.status === 'confirmed').length,
        total_earnings: 0
    });
    const [activeTab, setActiveTab] = useState<'listings' | 'reservations'>('listings');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const refreshDashboard = async () => {
        try {
            const data = await apiService.get('/api/auth/host/dashboard/');
            if (data.properties) {
                setProperties(data.properties);
                setReservations(data.reservations || []);
                setStats(data.stats || stats);
            }
        } catch (e) {
            console.error('Failed to refresh host dashboard:', e);
        }
    };

    const handleEditClick = (prop: any) => {
        const editData: PropertyEditData = {
            id: prop.id,
            title: prop.title,
            description: prop.description || '',
            price_per_night: prop.price_per_night,
            cleaning_fee: prop.cleaning_fee || 500,
            bedrooms: prop.bedrooms || 1,
            beds: prop.beds || 1,
            bathrooms: prop.bathrooms || 1,
            guests: prop.guests || 2,
            category: prop.category || 'Beachfront',
            property_type: prop.property_type || 'Villa',
            country: prop.country || 'India',
            country_code: prop.country_code || 'IN',
            city: prop.city || '',
            address: prop.address || '',
            amenities: prop.amenities || [],
            primary_image_url: prop.primary_image_url || prop.image_url || '',
        };
        editPropertyModal.open(editData, refreshDashboard);
    };

    const handleDeleteProperty = async (propId: string, propTitle: string) => {
        if (!confirm(`Are you sure you want to permanently delete listing "${propTitle}"? This cannot be undone.`)) {
            return;
        }

        setDeletingId(propId);
        try {
            const response = await apiService.delete(`/api/properties/${propId}/delete/`);
            if (response.success) {
                toast.show('Listing successfully deleted.', 'success');
                setProperties(prev => prev.filter(p => p.id !== propId));
                setStats(prev => ({ ...prev, total_listings: prev.total_listings - 1 }));
            } else {
                toast.show(response.error || 'Failed to delete listing.', 'error');
            }
        } catch (err: any) {
            toast.show('Error deleting listing.', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Host Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your properties, reservations, and host earnings.</p>
                </div>

                <button
                    type="button"
                    onClick={addPropertyModal.open}
                    className="px-6 py-3.5 bg-gradient-to-r from-airbnb to-airbnb-dark text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
                >
                    <span className="text-base">+</span>
                    <span>Create New Listing</span>
                </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <span>Total Listings</span>
                        <span className="text-xl">🏡</span>
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">{stats.total_listings}</p>
                    <p className="text-[11px] text-gray-400">Active rental properties</p>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <span>Total Bookings</span>
                        <span className="text-xl">📅</span>
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">{stats.confirmed_bookings}</p>
                    <p className="text-[11px] text-gray-400">{stats.total_bookings} total booking inquiries</p>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <span>Total Earnings</span>
                        <span className="text-xl">💰</span>
                    </div>
                    <p className="text-3xl font-extrabold text-emerald-600">₹{Number(stats.total_earnings).toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-gray-400">Confirmed booking revenue</p>
                </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('listings')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                        activeTab === 'listings'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                    Your Listings ({properties.length})
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('reservations')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                        activeTab === 'reservations'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                    Guest Reservations ({reservations.length})
                </button>
            </div>

            {/* Listings Tab */}
            {activeTab === 'listings' && (
                <div>
                    {properties.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-3xl border border-gray-200 p-8">
                            <span className="text-5xl">🏰</span>
                            <h3 className="text-lg font-bold text-gray-900">You have no active listings yet</h3>
                            <p className="text-xs text-gray-500 max-w-sm">
                                Create your first listing and start welcoming travelers from around the world.
                            </p>
                            <button
                                type="button"
                                onClick={addPropertyModal.open}
                                className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                Add Your Property
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((prop) => (
                                <div
                                    key={prop.id}
                                    className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div className="relative w-full aspect-[16/10] bg-gray-100">
                                        <Image
                                            src={prop.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'}
                                            alt={prop.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                            {prop.category || 'Stay'}
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                {prop.city ? `${prop.city}, ${prop.country || 'India'}` : prop.country}
                                            </p>
                                            <h3 className="text-base font-bold text-gray-900 line-clamp-1 mt-0.5">
                                                {prop.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                👥 Max {prop.guests || 2} guests • {prop.bedrooms || 1} bed • {prop.bathrooms || 1} bath
                                            </p>
                                            <p className="text-sm font-extrabold text-gray-900 mt-2">
                                                ₹{Number(prop.price_per_night).toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">night</span>
                                            </p>
                                        </div>

                                        {/* Actions: Edit, Delete, View */}
                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <Link
                                                href={`/properties/${prop.id}`}
                                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition"
                                            >
                                                View
                                            </Link>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick(prop)}
                                                    className="px-3.5 py-2 border border-gray-300 hover:border-black text-gray-800 text-xs font-bold rounded-xl transition"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={deletingId === prop.id}
                                                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                                    className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition disabled:opacity-50"
                                                >
                                                    {deletingId === prop.id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
                <div>
                    {reservations.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-3xl border border-gray-200 p-8">
                            <span className="text-5xl">📋</span>
                            <h3 className="text-lg font-bold text-gray-900">No guest bookings yet</h3>
                            <p className="text-xs text-gray-500 max-w-sm">
                                As guests book your properties, their reservation details and payouts will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">Property</th>
                                            <th className="p-4">Guest</th>
                                            <th className="p-4">Dates</th>
                                            <th className="p-4">Nights</th>
                                            <th className="p-4">Payout</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-bold text-gray-900 flex items-center space-x-3">
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                        <Image
                                                            src={res.property?.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=200&q=80'}
                                                            alt={res.property?.title || 'Property'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="truncate max-w-[200px]">{res.property?.title}</span>
                                                </td>
                                                <td className="p-4 font-semibold text-gray-800">
                                                    {res.created_by?.name || 'Guest Traveler'}
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {res.start_date} → {res.end_date}
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {res.number_of_nights}
                                                </td>
                                                <td className="p-4 font-bold text-emerald-600 text-sm">
                                                    ₹{Number(res.total_price).toLocaleString('en-IN')}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        res.status === 'confirmed' 
                                                            ? 'bg-emerald-100 text-emerald-800' 
                                                            : res.status === 'completed' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default HostDashboardClient;
