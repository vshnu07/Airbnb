import { create } from "zustand";

interface FilterModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const useFilterModal = create<FilterModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

export default useFilterModal;
