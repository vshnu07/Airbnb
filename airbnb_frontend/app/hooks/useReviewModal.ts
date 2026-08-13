import { create } from "zustand";

interface ReviewModalStore {
    isOpen: boolean;
    propertyId: string | null;
    propertyTitle: string | null;
    onSuccess?: () => void;
    open: (propertyId: string, propertyTitle: string, onSuccess?: () => void) => void;
    close: () => void;
}

const useReviewModal = create<ReviewModalStore>((set) => ({
    isOpen: false,
    propertyId: null,
    propertyTitle: null,
    onSuccess: undefined,
    open: (propertyId, propertyTitle, onSuccess) => set({ isOpen: true, propertyId, propertyTitle, onSuccess }),
    close: () => set({ isOpen: false, propertyId: null, propertyTitle: null, onSuccess: undefined })
}));

export default useReviewModal;
