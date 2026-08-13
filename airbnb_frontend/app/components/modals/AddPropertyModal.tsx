'use client';

import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import Modal from './Modal';
import CustomButton from '../forms/CustomButton';
import Categories from '../addproperty/Categories';
import useAddPropertyModal from '@/app/hooks/useAddPropertyModal';
import useToast from '@/app/hooks/useToast';
import SelectCountry, { SelectCountryValue } from '../forms/SelectCountry';
import apiService from '@/app/services/apiService';
import { useRouter } from 'next/navigation';

const propertyTypes = ['House', 'Apartment', 'Villa', 'Cabin', 'Chalet', 'Loft', 'Heritage Haveli'];

const availableAmenities = [
    'Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Dedicated workspace', 
    'Free parking', 'TV', 'Hot tub', 'Washer', 'EV charger', 'Beach access', 'Mountain view'
];

const AddPropertyModal = () => {
    const addPropertyModal = useAddPropertyModal();
    const router = useRouter();
    const toast = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [dataCategory, setDataCategory] = useState('Beachfront');
    const [dataPropertyType, setDataPropertyType] = useState('Villa');
    const [dataTitle, setDataTitle] = useState('');
    const [dataDescription, setDataDescription] = useState('');
    const [dataPrice, setDataPrice] = useState('100');
    const [dataCleaningFee, setDataCleaningFee] = useState('500');
    const [dataBedrooms, setDataBedrooms] = useState('1');
    const [dataBeds, setDataBeds] = useState('1');
    const [dataBathrooms, setDataBathrooms] = useState('1');
    const [dataGuests, setDataGuests] = useState('2');
    const [dataCity, setDataCity] = useState('');
    const [dataAddress, setDataAddress] = useState('');
    const [dataCountry, setDataCountry] = useState<SelectCountryValue>({
        value: 'IN',
        label: 'India'
    });
    const [dataAmenities, setDataAmenities] = useState<string[]>(['Wifi', 'Kitchen']);
    const [dataImage, setDataImage] = useState<File | null>(null);
    const [dataImageUrl, setDataImageUrl] = useState('');

    const toggleAmenity = (item: string) => {
        if (dataAmenities.includes(item)) {
            setDataAmenities(dataAmenities.filter(a => a !== item));
        } else {
            setDataAmenities([...dataAmenities, item]);
        }
    };

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setDataImage(event.target.files[0]);
        }
    };

    const submitForm = async () => {
        if (!dataTitle.trim() || !dataDescription.trim() || !dataPrice || !dataCountry) {
            setErrors(['Please fill in all required fields (title, description, price, country).']);
            return;
        }

        if (!dataImage && !dataImageUrl.trim()) {
            setErrors(['Please provide a cover photo via file upload or photo URL.']);
            return;
        }

        setIsSubmitting(true);
        setErrors([]);

        try {
            const formData = new FormData();
            formData.append('category', dataCategory);
            formData.append('property_type', dataPropertyType);
            formData.append('title', dataTitle.trim());
            formData.append('description', dataDescription.trim());
            formData.append('price_per_night', dataPrice);
            formData.append('cleaning_fee', dataCleaningFee || '500');
            formData.append('bedrooms', dataBedrooms);
            formData.append('beds', dataBeds);
            formData.append('bathrooms', dataBathrooms);
            formData.append('guests', dataGuests);
            formData.append('city', dataCity.trim());
            formData.append('address', dataAddress.trim());
            formData.append('country', dataCountry.label);
            formData.append('country_code', dataCountry.value);
            formData.append('amenities', JSON.stringify(dataAmenities));

            if (dataImage) {
                formData.append('image', dataImage);
            }
            if (dataImageUrl.trim()) {
                formData.append('primary_image_url', dataImageUrl.trim());
            }

            const response = await apiService.post('/api/properties/create/', formData);

            if (response.success || response.property) {
                toast.show('🎉 Your listing is now live on Airbnb!', 'success');
                addPropertyModal.close();
                setCurrentStep(1);
                router.push('/myproperties');
                router.refresh();
            } else {
                const tmpErrors = response.error ? [response.error] : ['Failed to create property.'];
                setErrors(tmpErrors);
                toast.show('Failed to create listing.', 'error');
            }
        } catch (err: any) {
            setErrors([err.message || 'Error occurred while creating listing.']);
            toast.show('Error creating listing.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const content = (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2">
            {/* Step 1: Category & Type */}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Which of these best describes your place?</h2>
                        <p className="text-xs text-gray-500">Choose a category and property type</p>
                    </div>

                    <Categories
                        dataCategory={dataCategory}
                        setCategory={(cat) => setDataCategory(cat)}
                    />

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Property Type</label>
                        <div className="flex flex-wrap gap-2">
                            {propertyTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setDataPropertyType(type)}
                                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                                        dataPropertyType === type ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:border-black'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <CustomButton
                        label="Next: Location →"
                        onClick={() => setCurrentStep(2)}
                    />
                </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Where is your place located?</h2>
                        <p className="text-xs text-gray-500">Guests will only get your exact address once they have booked a stay.</p>
                    </div>

                    <div className="space-y-4">
                        <SelectCountry 
                            value={dataCountry}
                            onChange={(value) => setDataCountry(value as SelectCountryValue)}
                        />

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City / Region</label>
                            <input
                                type="text"
                                value={dataCity}
                                placeholder="e.g. Goa, Manali, Jaipur..."
                                onChange={(e) => setDataCity(e.target.value)}
                                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Street Address or Area</label>
                            <input
                                type="text"
                                value={dataAddress}
                                placeholder="e.g. Near Anjuna Beach Road"
                                onChange={(e) => setDataAddress(e.target.value)}
                                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <CustomButton
                            label="← Back"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setCurrentStep(1)}
                        />
                        <CustomButton
                            label="Next: Basics →"
                            onClick={() => setCurrentStep(3)}
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Basics & Pricing */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Share some basics about your place</h2>
                        <p className="text-xs text-gray-500">Guests, rooms, and nightly pricing</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price per night (₹)</label>
                            <input
                                type="number"
                                value={dataPrice}
                                onChange={(e) => setDataPrice(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cleaning fee (₹)</label>
                            <input
                                type="number"
                                value={dataCleaningFee}
                                onChange={(e) => setDataCleaningFee(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Guests</label>
                            <input
                                type="number"
                                min="1"
                                value={dataGuests}
                                onChange={(e) => setDataGuests(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bedrooms</label>
                            <input
                                type="number"
                                min="1"
                                value={dataBedrooms}
                                onChange={(e) => setDataBedrooms(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Beds</label>
                            <input
                                type="number"
                                min="1"
                                value={dataBeds}
                                onChange={(e) => setDataBeds(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bathrooms</label>
                            <input
                                type="number"
                                min="1"
                                value={dataBathrooms}
                                onChange={(e) => setDataBathrooms(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <CustomButton
                            label="← Back"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setCurrentStep(2)}
                        />
                        <CustomButton
                            label="Next: Description →"
                            onClick={() => setCurrentStep(4)}
                        />
                    </div>
                </div>
            )}

            {/* Step 4: Title, Description & Amenities */}
            {currentStep === 4 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Make your listing stand out</h2>
                        <p className="text-xs text-gray-500">Add a catchy title, description, and available amenities</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Listing Title</label>
                            <input
                                type="text"
                                value={dataTitle}
                                placeholder="e.g. Royal Heritage Villa with Infinity Pool"
                                onChange={(e) => setDataTitle(e.target.value)}
                                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={dataDescription}
                                placeholder="Highlight the special atmosphere, scenic views, and local experiences..."
                                onChange={(e) => setDataDescription(e.target.value)}
                                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amenities</label>
                            <div className="flex flex-wrap gap-2">
                                {availableAmenities.map(item => {
                                    const isSelected = dataAmenities.includes(item);
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => toggleAmenity(item)}
                                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                                                isSelected ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:border-black'
                                            }`}
                                        >
                                            {item} {isSelected ? '✓' : '+'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <CustomButton
                            label="← Back"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setCurrentStep(3)}
                        />
                        <CustomButton
                            label="Next: Photos →"
                            onClick={() => setCurrentStep(5)}
                        />
                    </div>
                </div>
            )}

            {/* Step 5: Photos & Submit */}
            {currentStep === 5 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Add photos of your place</h2>
                        <p className="text-xs text-gray-500">Upload a cover image file or paste a high-resolution photo URL.</p>
                    </div>

                    <div className="space-y-4">
                        {/* File Upload */}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl text-center space-y-2 hover:border-black transition">
                            <span className="text-3xl">📷</span>
                            <p className="text-xs font-bold text-gray-700">Upload photo from your device</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={setImage}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                            />
                        </div>

                        {dataImage && (
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow">
                                <Image
                                    fill
                                    alt="Uploaded image"
                                    src={URL.createObjectURL(dataImage)}
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase">or use photo URL</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Image URL Input */}
                        <div>
                            <input
                                type="text"
                                value={dataImageUrl}
                                placeholder="https://images.unsplash.com/photo-..."
                                onChange={(e) => setDataImageUrl(e.target.value)}
                                className="w-full p-3.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-black font-mono"
                            />
                        </div>
                    </div>

                    {errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                            {error}
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-2">
                        <CustomButton
                            label="← Back"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setCurrentStep(4)}
                        />
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={submitForm}
                            className="px-8 py-3.5 bg-gradient-to-r from-airbnb to-airbnb-dark text-white font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Modal
            isOpen={addPropertyModal.isOpen}
            close={addPropertyModal.close}
            label="Airbnb your home"
            content={content}
        />
    );
};

export default AddPropertyModal;