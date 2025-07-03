// src/components/DoctorReviews.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const StarDisplay = ({ rating }) => (
    <div className="star-display">
        {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} />
        ))}
    </div>
);

const DoctorReviews = ({ doctorId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (doctorId) {
            axios.get(`http://localhost/my-health-app-backend/get_reviews.php?doctor_id=${doctorId}`)
                .then(response => setReviews(response.data))
                .catch(error => console.error("Failed to fetch reviews:", error))
                .finally(() => setLoading(false));
        }
    }, [doctorId]);

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div className="doctor-reviews-section">
            <h4>Patient Feedback</h4>
            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <img
                                    src={review.patient_pic ? `http://localhost/my-health-app-backend/${review.patient_pic}` : `https://placehold.co/40x40/e2e8f0/6366f1?text=${review.patient_phone.slice(-2)}`}
                                    alt="Patient"
                                    className="review-patient-pic"
                                />
                                <div>
                                    <p className="review-patient-name">Patient ({review.patient_phone.slice(0, 4)}****)</p>
                                    <StarDisplay rating={review.rating} />
                                </div>
                            </div>
                            <p className="review-comment">"{review.comment}"</p>
                            <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No reviews yet for this doctor.</p>
            )}
        </div>
    );
};

export default DoctorReviews;