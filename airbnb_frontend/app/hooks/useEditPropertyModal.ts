import { create } from "zustand";

export type PropertyEditData = {
    id: string;
    title: string;
    description: string;
    price_per_night: number;
    cleaning_fee: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    guests: number;
    category: string;
    property_type: string;
    country: string;
    country_code: string;
    city: string;
    address: string;
    amenities: string[];
    primary_image_url?: string;
};

interface EditPropertyModalStore {
    isOpen: boolean;
    property: PropertyEditData | null;
    onSuccess?: () => void;
    open: (property: PropertyEditData, onSuccess?: () => void) => void;
    close: () => void;
}

const useEditPropertyModal = create<EditPropertyModalStore>((set) => ({
    isOpen: false,
    property: null,
    onSuccess: undefined,
    open: (property, onSuccess) => set({ isOpen: true, property, onSuccess }),
    close: () => set({ isOpen: false, property: null, onSuccess: undefined })
}));

export default useEditPropertyModal;
