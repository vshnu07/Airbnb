'use client';

import { useState } from 'react';
import Modal from './Modal';
import useReviewModal from '@/app/hooks/useReviewModal';
import useToast from '@/app/hooks/useToast';
import apiService from '@/app/services/apiService';

const ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness', icon: '✨' },
    { key: 'accuracy', label: 'Accuracy', icon: '🎯' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'location', label: 'Location', icon: '📍' },
    { key: 'value', label: 'Value for Money', icon: '🏷️' },
];

const ReviewModal = () => {
    const reviewModal = useReviewModal();
    const toast = useToast();

    const [overallRating, setOverallRating] = useState<number>(5);
    const [ratings, setRatings] = useState<Record<string, number>>({
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        value: 5,
    });
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleCategoryRatingChange = (key: string, val: number) => {
        setRatings(prev => ({ ...prev, [key]: val }));
    };

    const handleSubmit = async () => {
        if (!comment.trim()) {
            setError('Please write a few words about your stay.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                rating: overallRating,
                cleanliness_rating: ratings.cleanliness,
                accuracy_rating: ratings.accuracy,
                communication_rating: ratings.communication,
                location_rating: ratings.location,
                value_rating: ratings.value,
                comment: comment.trim(),
            };

            const response = await apiService.post(`/api/properties/${reviewModal.propertyId}/reviews/`, payload);

            if (response.success || response.review) {
                toast.show('Thank you! Your review has been submitted.', 'success');
                if (reviewModal.onSuccess) {
                    reviewModal.onSuccess();
                }
                reviewModal.close();
                setComment('');
            } else {
                setError(response.error || 'Failed to submit review.');
                toast.show('Failed to submit review.', 'error');
            }
        } catch (err: any) {
            setError(err.message || 'Please log in to leave a review.');
            toast.show('Error submitting review.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const content = (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2">
            <div>
                <h3 className="text-lg font-bold text-gray-900">How was your stay?</h3>
                <p className="text-xs text-gray-500 mt-1">Reviewing {reviewModal.propertyTitle || 'this property'}</p>
            </div>

            {/* Overall Rating */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                <p className="text-sm font-semibold text-gray-800 mb-2">Overall Rating</p>
                <div className="flex justify-center items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={`overall-${star}`}
                            type="button"
                            onClick={() => setOverallRating(star)}
                            className="text-3xl transition transform hover:scale-125 focus:outline-none"
                        >
                            <span className={star <= overallRating ? 'text-amber-400' : 'text-gray-300'}>
                                ★
                            </span>
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-500 font-bold mt-1 inline-block">
                    {overallRating === 5 ? 'Exceptional' : overallRating === 4 ? 'Very Good' : overallRating === 3 ? 'Average' : overallRating === 2 ? 'Disappointing' : 'Poor'}
                </span>
            </div>

            {/* Category Breakdown Ratings */}
            <div className="space-y-3">
                <p className="text-sm font-bold text-gray-800">Category Ratings</p>
                {ratingCategories.map((cat) => (
                    <div key={cat.key} className="flex items-center justify-between py-1.5 border-b border-gray-100 text-sm">
                        <div className="flex items-center space-x-2">
                            <span>{cat.icon}</span>
                            <span className="text-gray-700 font-medium text-xs md:text-sm">{cat.label}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={`${cat.key}-${star}`}
                                    type="button"
                                    onClick={() => handleCategoryRatingChange(cat.key, star)}
                                    className="text-lg transition hover:scale-110 focus:outline-none"
                                >
                                    <span className={star <= ratings[cat.key] ? 'text-amber-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Write your public review</label>
                <textarea
                    rows={4}
                    placeholder="Share what made your stay special — the host's hospitality, the views, comfort, or local amenities..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black text-sm text-gray-900"
                ></textarea>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
                {isSubmitting ? <span>Submitting review...</span> : <span>Submit Review</span>}
            </button>
        </div>
    );

    return (
        <Modal
            label="Write a Review"
            content={content}
            isOpen={reviewModal.isOpen}
            close={reviewModal.close}
        />
    );
};

export default ReviewModal;
