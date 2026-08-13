import { create } from "zustand";

interface PhotoGalleryModalStore {
    isOpen: boolean;
    images: string[];
    initialIndex: number;
    title: string;
    open: (images: string[], title?: string, initialIndex?: number) => void;
    close: () => void;
}

const usePhotoGalleryModal = create<PhotoGalleryModalStore>((set) => ({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: '',
    open: (images, title = '', initialIndex = 0) => set({ isOpen: true, images, title, initialIndex }),
    close: () => set({ isOpen: false, images: [], initialIndex: 0 })
}));

export default usePhotoGalleryModal;
