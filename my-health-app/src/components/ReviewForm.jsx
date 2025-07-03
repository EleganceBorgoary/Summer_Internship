// src/components/ReviewForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ appointment, patientId, onClose, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost/my-health-app-backend/submit_review.php', {
                appointmentId: appointment.id,
                patientId: patientId,
                doctorId: appointment.doctor_id,
                rating: rating,
                comment: comment
            });
            onReviewSubmit(); // Tell the parent component to refresh its state
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">×</button>
                <h2>Leave a Review for Dr. {appointment.doctor_name}</h2>
                <p className="modal-subtitle">Appointment on: {new Date(appointment.appointment_time).toLocaleDateString()}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="star-rating">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="star"
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div className="input-group">
                        <label htmlFor="comment">Your Comments (Optional)</label>
                        <textarea
                            id="comment"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    {error && <p className="form-error-message">{error}</p>}
                    
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;