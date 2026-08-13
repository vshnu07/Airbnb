'use client';

import useToast from '../hooks/useToast';

const Toast = () => {
    const toast = useToast();

    if (!toast.isOpen) return null;

    const bgColor = toast.type === 'success' 
        ? 'bg-emerald-600' 
        : toast.type === 'error' 
        ? 'bg-airbnb' 
        : 'bg-gray-800';

    return (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-up">
            <div className={`${bgColor} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-medium border border-white/20 backdrop-blur-md`}>
                {toast.type === 'success' && (
                    <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {toast.type === 'error' && (
                    <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {toast.type === 'info' && (
                    <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <span className="max-w-xs md:max-w-sm">{toast.message}</span>
                <button 
                    onClick={toast.hide}
                    className="ml-2 hover:opacity-75 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;
