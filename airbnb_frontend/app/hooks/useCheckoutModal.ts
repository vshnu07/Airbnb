import { create } from "zustand";

export type CheckoutDetails = {
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    city: string;
    country: string;
    pricePerNight: number;
    cleaningFee: number;
    serviceFee: number;
    totalPrice: number;
    nights: number;
    guests: number;
    startDate: Date;
    endDate: Date;
    ratingAvg?: number;
    reviewsCount?: number;
}

interface CheckoutModalStore {
    isOpen: boolean;
    details: CheckoutDetails | null;
    open: (details: CheckoutDetails) => void;
    close: () => void;
}

const useCheckoutModal = create<CheckoutModalStore>((set) => ({
    isOpen: false,
    details: null,
    open: (details) => set({ isOpen: true, details }),
    close: () => set({ isOpen: false, details: null })
}));

export default useCheckoutModal;
