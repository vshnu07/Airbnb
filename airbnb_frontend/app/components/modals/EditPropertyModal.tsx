'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import useEditPropertyModal from '@/app/hooks/useEditPropertyModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

const categories = [
    'Trending', 'Beachfront', 'Cabins', 'Mansions', 'Countryside', 
    'Lakefront', 'Castles', 'Iconic cities', 'Treehouses', 'Amazing pools', 'Islands', 'Tiny homes', 'Luxe'
];

const propertyTypes = ['House', 'Apartment', 'Villa', 'Cabin', 'Chalet', 'Loft', 'Heritage Haveli', 'Cottage'];

const availableAmenities = [
    'Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Dedicated workspace', 
    'Free parking', 'TV', 'Hot tub', 'Washer', 'EV charger', 'Beach access', 'Mountain view', 'Garden view'
];

const EditPropertyModal = () => {
    const editModal = useEditPropertyModal();
    const toast = useToast();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [cleaningFee, setCleaningFee] = useState('');
    const [bedrooms, setBedrooms] = useState('1');
    const [beds, setBeds] = useState('1');
    const [bathrooms, setBathrooms] = useState('1');
    const [guests, setGuests] = useState('2');
    const [category, setCategory] = useState('Beachfront');
    const [propertyType, setPropertyType] = useState('Villa');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);
    const [primaryImageUrl, setPrimaryImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editModal.isOpen && editModal.property) {
            const p = editModal.property;
            setTitle(p.title || '');
            setDescription(p.description || '');
            setPrice(p.price_per_night?.toString() || '');
            setCleaningFee(p.cleaning_fee?.toString() || '500');
            setBedrooms(p.bedrooms?.toString() || '1');
            setBeds(p.beds?.toString() || '1');
            setBathrooms(p.bathrooms?.toString() || '1');
            setGuests(p.guests?.toString() || '2');
            setCategory(p.category || 'Beachfront');
            setPropertyType(p.property_type || 'Villa');
            setCity(p.city || '');
            setAddress(p.address || '');
            setCountry(p.country || '');
            setAmenities(p.amenities || []);
            setPrimaryImageUrl(p.primary_image_url || '');
        }
    }, [editModal.isOpen, editModal.property]);

    const toggleAmenity = (item: string) => {
        if (amenities.includes(item)) {
            setAmenities(amenities.filter(a => a !== item));
        } else {
            setAmenities([...amenities, item]);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !price) {
            setError('Please fill in title, description, and price per night.');
            return;
        }

        if (!editModal.property) return;

        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                price_per_night: parseInt(price),
                cleaning_fee: parseInt(cleaningFee || '500'),
                bedrooms: parseInt(bedrooms),
                beds: parseInt(beds),
                bathrooms: parseInt(bathrooms),
                guests: parseInt(guests),
                category: category,
                property_type: propertyType,
                city: city.trim(),
                address: address.trim(),
                country: country.trim(),
                amenities: amenities,
                primary_image_url: primaryImageUrl.trim(),
            };

            const response = await apiService.put(`/api/properties/${editModal.property.id}/edit/`, payload);

            if (response.success || response.property) {
                toast.show('✨ Listing updated successfully!', 'success');
                if (editModal.onSuccess) {
                    editModal.onSuccess();
                }
                editModal.close();
            } else {
                setError(response.error || 'Failed to update listing.');
                toast.show('Failed to update listing.', 'error');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while updating the listing.');
            toast.show('Error updating listing.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const content = (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2">
            {/* Title & Description */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Listing Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black font-semibold text-gray-900"
                        placeholder="e.g. Luxury Beachfront Villa with Infinity Pool"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black text-gray-900"
                        placeholder="Describe the atmosphere, views, and unique experiences..."
                    ></textarea>
                </div>
            </div>

            {/* Category & Property Type */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Property Type</label>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
                    >
                        {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price / Night (₹)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black font-semibold"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cleaning Fee (₹)</label>
                    <input
                        type="number"
                        value={cleaningFee}
                        onChange={(e) => setCleaningFee(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Guests</label>
                    <input
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bedrooms</label>
                    <input
                        type="number"
                        min="1"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Beds</label>
                    <input
                        type="number"
                        min="1"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bathrooms</label>
                    <input
                        type="number"
                        min="1"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City / Region</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                        placeholder="e.g. Goa"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Address / Landmark</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                        placeholder="e.g. Anjuna Beach Road"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Country</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                        placeholder="e.g. India"
                    />
                </div>
            </div>

            {/* Primary Image URL */}
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cover Photo URL</label>
                <input
                    type="text"
                    value={primaryImageUrl}
                    onChange={(e) => setPrimaryImageUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
                    placeholder="https://images.unsplash.com/..."
                />
            </div>

            {/* Amenities */}
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                    {availableAmenities.map(item => {
                        const isSelected = amenities.includes(item);
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleAmenity(item)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                                    isSelected
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-900 text-gray-700'
                                }`}
                            >
                                {item} {isSelected ? '✓' : '+'}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            {/* Save Button */}
            <div className="pt-2">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSave}
                    className="w-full py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? <span>Saving Changes...</span> : <span>Save Listing Changes</span>}
                </button>
            </div>
        </div>
    );

    return (
        <Modal
            label="Edit Listing"
            content={content}
            isOpen={editModal.isOpen}
            close={editModal.close}
        />
    );
};

export default EditPropertyModal;
