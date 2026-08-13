import { create } from "zustand";

export type SearchQuery = {
    query?: string;
    country?: string | undefined;
    city?: string | undefined;
    checkIn?: Date | undefined;
    checkOut?: Date | undefined;
    guests: number;
    bathrooms: number;
    bedrooms: number;
    beds?: number;
    category: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    ordering?: string;
}

interface SearchModalStore {
    isOpen: boolean;
    step: string;
    open: (step?: string) => void;
    close: () => void;
    query: SearchQuery;
    setQuery: (query: SearchQuery) => void;
    resetQuery: () => void;
}

const defaultQuery: SearchQuery = {
    query: '',
    country: '',
    city: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    bedrooms: 0,
    bathrooms: 0,
    beds: 0,
    category: '',
    propertyType: '',
    minPrice: undefined,
    maxPrice: undefined,
    amenities: [],
    ordering: ''
};

const useSearchModal = create<SearchModalStore>((set) => ({
    isOpen: false,
    step: 'location',
    open: (step = 'location') => set({ isOpen: true, step }),
    close: () => set({ isOpen: false }),
    setQuery: (query: SearchQuery) => set({ query }),
    resetQuery: () => set({ query: { ...defaultQuery } }),
    query: { ...defaultQuery }
}));

export default useSearchModal;