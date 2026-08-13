'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import useCheckoutModal from '@/app/hooks/useCheckoutModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

const paymentMethods = [
    { id: 'card', name: 'Credit or Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI / Instant Pay', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', desc: 'HDFC, ICICI, SBI, Axis' },
];

const CheckoutModal = () => {
    const checkoutModal = useCheckoutModal();
    const router = useRouter();
    const toast = useToast();

    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [upiId, setUpiId] = useState('traveler@okhdfcbank');
    const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
    const [expiry, setExpiry] = useState('12/28');
    const [cvv, setCvv] = useState('123');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const details = checkoutModal.details;
    if (!details) return null;

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('guests', details.guests.toString());
            formData.append('start_date', format(details.startDate, 'yyyy-MM-dd'));
            formData.append('end_date', format(details.endDate, 'yyyy-MM-dd'));
            formData.append('number_of_nights', details.nights.toString());
            formData.append('total_price', details.totalPrice.toString());

            const response = await apiService.post(`/api/properties/${details.propertyId}/book/`, formData);

            if (response.success) {
                toast.show(`🎉 Booking confirmed for ${details.propertyTitle}!`, 'success');
                checkoutModal.close();
                router.push('/myreservations');
                router.refresh();
            } else {
                setError(response.error || 'Unable to confirm booking. Please try again.');
                toast.show(response.error || 'Booking failed.', 'error');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during checkout.');
            toast.show('Checkout error occurred.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            label="Confirm and pay"
            isOpen={checkoutModal.isOpen}
            close={checkoutModal.close}
            content={
                <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2">
                    {/* Property Summary Header */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={details.propertyImage}
                                alt={details.propertyTitle}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{details.city || details.country}</p>
                            <h4 className="text-sm font-bold text-gray-900 truncate">{details.propertyTitle}</h4>
                            <p className="text-xs text-gray-600 mt-1 flex items-center">
                                <span className="text-airbnb font-bold mr-1">★</span> {details.ratingAvg || '4.95'} 
                                <span className="text-gray-400 mx-1.5">•</span> 
                                {details.guests} {details.guests === 1 ? 'guest' : 'guests'}
                            </p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="border-t border-b border-gray-200 py-4 space-y-3">
                        <h4 className="text-base font-bold text-gray-900">Your trip</h4>
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-gray-800">Dates</p>
                                <p className="text-gray-600 text-xs mt-0.5">
                                    {format(details.startDate, 'MMM d, yyyy')} – {format(details.endDate, 'MMM d, yyyy')} ({details.nights} {details.nights === 1 ? 'night' : 'nights'})
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-gray-800">Guests</p>
                                <p className="text-gray-600 text-xs mt-0.5">
                                    {details.guests} {details.guests === 1 ? 'guest' : 'guests'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown in ₹ */}
                    <div className="space-y-2.5 text-sm">
                        <h4 className="text-base font-bold text-gray-900 mb-3">Price details</h4>
                        <div className="flex justify-between text-gray-700">
                            <span>₹{Number(details.pricePerNight).toLocaleString('en-IN')} × {details.nights} nights</span>
                            <span className="font-medium">₹{Number(details.pricePerNight * details.nights).toLocaleString('en-IN')}</span>
                        </div>
                        {details.cleaningFee > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>Cleaning fee</span>
                                <span className="font-medium">₹{Number(details.cleaningFee).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-700">
                            <span>Airbnb service fee (14%)</span>
                            <span className="font-medium">₹{Number(details.serviceFee).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                            <span>Total (INR)</span>
                            <span className="text-airbnb">₹{Number(details.totalPrice).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                        <h4 className="text-base font-bold text-gray-900">Pay with (Mocked)</h4>
                        <div className="space-y-2">
                            {paymentMethods.map((pm) => (
                                <div
                                    key={pm.id}
                                    onClick={() => setSelectedPayment(pm.id)}
                                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                                        selectedPayment === pm.id
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">{pm.icon}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{pm.name}</p>
                                            <p className="text-xs text-gray-500">{pm.desc}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={selectedPayment === pm.id}
                                        onChange={() => setSelectedPayment(pm.id)}
                                        className="h-4 w-4 text-airbnb focus:ring-airbnb border-gray-300"
                                    />
                                </div>
                            ))}
                        </div>

                        {selectedPayment === 'upi' && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 mt-2">
                                <label className="text-xs text-gray-500 font-semibold block">Enter UPI ID</label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black font-mono"
                                    placeholder="yourname@bank"
                                />
                            </div>
                        )}

                        {selectedPayment === 'card' && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 mt-2">
                                <div className="text-xs text-gray-500 font-semibold">Demo Card Information</div>
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="col-span-3 text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black font-mono"
                                        placeholder="Card Number"
                                    />
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black font-mono"
                                        placeholder="MM/YY"
                                    />
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black font-mono"
                                        placeholder="CVV"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cancellation Policy */}
                    <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
                        <p className="font-semibold text-gray-700 mb-1">Cancellation policy</p>
                        <p>Free cancellation up to 48 hours before check-in. Cancel any time directly from your Trips dashboard.</p>
                    </div>

                    {error && (
                        <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Confirm Button */}
                    <div className="pt-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleConfirmBooking}
                            className="w-full py-4 bg-gradient-to-r from-airbnb to-airbnb-dark text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing Reservation...</span>
                                </>
                            ) : (
                                <span>Confirm and Pay • ₹{Number(details.totalPrice).toLocaleString('en-IN')}</span>
                            )}
                        </button>
                    </div>
                </div>
            }
        />
    );
};

export default CheckoutModal;
