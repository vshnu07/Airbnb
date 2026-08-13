import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "../lib/actions";
import Link from "next/link";

const MyFavoritesPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-[1400px] mx-auto px-6 py-20 text-center">
                <div className="p-12 bg-gray-50 rounded-3xl border border-gray-200 max-w-md mx-auto space-y-4">
                    <span className="text-4xl">❤️</span>
                    <h2 className="text-xl font-bold text-gray-900">Your Wishlists</h2>
                    <p className="text-xs text-gray-500">Log in to view and organize your saved properties and dream stays.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Wishlists</h1>
                <p className="text-sm text-gray-500 mt-1">Stays you have saved for your upcoming journeys.</p>
            </div>

            <div>
                <PropertyList 
                    favorites={true}
                />
            </div>
        </main>
    );
};

export default MyFavoritesPage;