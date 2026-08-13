'use client';

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import MenuLink from "./MenuLink";
import LogoutButton from "../LogoutButton";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";

interface UserNavProps {
    userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const signupModal = useSignupModal();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative inline-block">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 md:py-1.5 md:px-3 border border-gray-300 rounded-full flex items-center space-x-2.5 hover:shadow-md transition bg-white"
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <div className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold">
                    {userId ? '👤' : (
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-300">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="w-[240px] absolute top-[52px] right-0 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 flex flex-col z-50 text-sm animate-fade-in">
                    {userId ? (
                        <>
                            <MenuLink
                                label="Trips"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myreservations');
                                }}
                            />

                            <MenuLink
                                label="Wishlists"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myfavorites');
                                }}
                            />

                            <MenuLink
                                label="Host Dashboard & Listings"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myproperties');
                                }}
                            />

                            <MenuLink
                                label="Messages"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/inbox');
                                }}
                            />

                            <hr className="my-1.5 border-gray-100" />

                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Welcome to Airbnb
                            </div>

                            <MenuLink 
                                label="Log in"
                                onClick={() => {
                                    setIsOpen(false);
                                    loginModal.open();
                                }}
                            />

                            <MenuLink 
                                label="Sign up"
                                onClick={() => {
                                    setIsOpen(false);
                                    signupModal.open();
                                }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserNav;