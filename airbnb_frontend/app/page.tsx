'use client';

import { useState } from 'react';
import Categories from "./components/Categories";
import PropertyList from "./components/properties/PropertyList";

export default function Home() {
    const [showMap, setShowMap] = useState(false);

    return (
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Categories & Filter Bar */}
            <Categories />

            {/* Properties Grid / Map View */}
            <div className="mt-6">
                <PropertyList showMap={showMap} />
            </div>

            {/* Floating Map / List Toggle Button */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center space-x-2 px-5 py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-full shadow-2xl hover:scale-105 transition border border-white/20 backdrop-blur-md"
                >
                    {showMap ? (
                        <>
                            <span>Show list</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Show map</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </main>
    );
}
