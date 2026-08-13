import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastStore {
    isOpen: boolean;
    message: string;
    type: ToastType;
    show: (message: string, type?: ToastType) => void;
    hide: () => void;
}

const useToast = create<ToastStore>((set) => ({
    isOpen: false,
    message: '',
    type: 'success',
    show: (message: string, type: ToastType = 'success') => {
        set({ isOpen: true, message, type });
        setTimeout(() => {
            set({ isOpen: false });
        }, 4000);
    },
    hide: () => set({ isOpen: false })
}));

export default useToast;
