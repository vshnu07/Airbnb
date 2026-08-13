'use client';

import useLoginModal from "@/app/hooks/useLoginModal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";

interface AddPropertyButtonProps {
    userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({
    userId
}) => {
    const loginModal = useLoginModal();
    const addPropertyModal = useAddPropertyModal();

    const airbnbYourHome = () => {
        if (userId) {
            addPropertyModal.open();
        } else {
            loginModal.open();
        }
    };

    return (
        <button 
            type="button"
            onClick={airbnbYourHome}
            className="px-4 py-2 cursor-pointer text-xs md:text-sm font-semibold rounded-full hover:bg-gray-100 transition text-gray-800"
        >
            Airbnb your home
        </button>
    );
};

export default AddPropertyButton;