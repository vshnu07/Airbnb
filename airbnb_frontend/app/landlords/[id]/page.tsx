import Image from "next/image";
import ContactButton from "@/app/components/ContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

const LandlordDetailPage = async ({ params }: { params: { id: string } }) => {
    let hostUser: any = null;

    try {
        const landlordData = await apiService.get(`/api/auth/${params.id}/`);
        hostUser = landlordData.user || landlordData;
    } catch (e) {
        console.error('Error fetching landlord detail:', e);
    }

    const currentUserId = await getUserId();

    if (!hostUser) {
        return (
            <main className="max-w-[1400px] mx-auto px-6 py-20 text-center">
                <h2 className="text-xl font-bold text-gray-900">Host profile not found</h2>
            </main>
        );
    }

    return (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Host Profile Card (Left column) */}
                <aside className="lg:col-span-1">
                    <div className="p-8 rounded-3xl border border-gray-200 shadow-lg bg-white space-y-6 sticky top-28">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                                <Image
                                    src={hostUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                    alt={hostUser.name || 'Host avatar'}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900">{hostUser.name || 'Host'}</h1>
                                {hostUser.is_superhost && (
                                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-airbnb text-xs font-bold rounded-full mt-1.5 border border-red-100">
                                        <span>★</span>
                                        <span>Superhost</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Host Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <p className="text-xl font-extrabold text-gray-900">{hostUser.total_listings_count || 1}</p>
                                <p className="text-[11px] font-semibold text-gray-500 uppercase">Listings</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <p className="text-xl font-extrabold text-gray-900">4.95</p>
                                <p className="text-[11px] font-semibold text-gray-500 uppercase">Rating</p>
                            </div>
                        </div>

                        {/* Bio */}
                        {hostUser.bio && (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">About</p>
                                <p className="text-xs text-gray-700 leading-relaxed">{hostUser.bio}</p>
                            </div>
                        )}

                        {hostUser.location && (
                            <p className="text-xs text-gray-500 flex items-center space-x-1.5">
                                <span>📍</span>
                                <span>Lives in {hostUser.location}</span>
                            </p>
                        )}

                        {currentUserId !== params.id && (
                            <div className="pt-2">
                                <ContactButton
                                    userId={currentUserId}
                                    landlordId={params.id}
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Host's Listings (Right column) */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            {hostUser.name ? `${hostUser.name}'s listings` : 'Host listings'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">Explore available properties hosted by {hostUser.name || 'this host'}.</p>
                    </div>

                    <PropertyList landlord_id={params.id} />
                </div>
            </div>
        </main>
    );
};

export default LandlordDetailPage;