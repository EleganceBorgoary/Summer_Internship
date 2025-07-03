// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfilePicUploader from '../components/ProfilePicUploader';
import ReviewForm from '../components/ReviewForm';

const DashboardPage = () => {
    // State for user data and appointments
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for UI control (the review modal)
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);

    const navigate = useNavigate();

    // Fetch the patient's appointments from the backend
    const fetchAppointments = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost/my-health-app-backend/get_my_appointments.php?userId=${userId}&userType=patient`);
            setAppointments(response.data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    }, []);

    // Check for login status on component mount
    useEffect(() => {
        const loggedInUserString = localStorage.getItem('healthAppUser');
        if (loggedInUserString) {
            const loggedInUser = JSON.parse(loggedInUserString);
            setUser(loggedInUser);
            fetchAppointments(loggedInUser.id).finally(() => setLoading(false));
        } else {
            navigate('/select-role');
        }
    }, [navigate, fetchAppointments]);
    
    // --- NEW FUNCTION TO HANDLE CANCELLATION ---
    const handleCancelAppointment = async (appointmentId) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this appointment?");
        if (isConfirmed) {
            try {
                await axios.post('http://localhost/my-health-app-backend/cancel_appointment.php', {
                    appointmentId: appointmentId,
                    userId: user.id,
                    userType: 'patient'
                });
                // Refresh the appointment list to show the new "Cancelled" status
                fetchAppointments(user.id);
            } catch (err) {
                alert(err.response?.data?.message || "Failed to cancel appointment.");
            }
        }
    };

    // Handlers for the review modal
    const handleOpenReviewModal = (appointment) => {
        setSelectedAppointmentForReview(appointment);
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedAppointmentForReview(null);
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('healthAppUser');
        navigate('/');
    };

    // Profile picture upload handler
    const handleUploadSuccess = (newImageUrl) => {
        const updatedUser = { ...user, profile_pic_url: newImageUrl };
        setUser(updatedUser);
        localStorage.setItem('healthAppUser', JSON.stringify(updatedUser));
    };

    if (loading || !user) {
        return <div className="auth-page"><div>Loading...</div></div>;
    }

    return (
        <>
            {/* The ReviewForm modal will only render when showReviewModal is true */}
            {showReviewModal && (
                <ReviewForm
                    appointment={selectedAppointmentForReview}
                    patientId={user.id}
                    onClose={handleCloseReviewModal}
                    onReviewSubmit={() => fetchAppointments(user.id)} // Refresh appointments after review
                />
            )}
            <div className="auth-page">
                <div className="auth-container" style={{maxWidth: '800px'}}>
                    <div className="dashboard-header-with-pic">
                        <ProfilePicUploader
                            userId={user.id}
                            userType="patient"
                            currentImageUrl={user.profile_pic_url}
                            onUploadSuccess={handleUploadSuccess}
                        />
                        <div className="dashboard-header-text">
                            <h1 className="auth-title" style={{textAlign: 'left', marginBottom: 0}}>Patient Dashboard</h1>
                            <p style={{marginTop: '0.5rem'}}>Logged in with phone: <strong>{user.phone}</strong></p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary logout-btn">Log Out</button>
                    </div>

                    <div className="tab-content" style={{marginTop: '2rem'}}>
                        <div className="appointments-header">
                            <h3>My Appointments</h3>
                            <Link to="/doctors" className="btn btn-primary">+ Book New Appointment</Link>
                        </div>
                        
                        <div className="appointment-list">
                            {appointments.length > 0 ? (
                                appointments.map(appt => (
                                    <div key={appt.id} className="appointment-item-detailed">
                                        <div className="appointment-info">
                                            <p><strong>Doctor:</strong> {appt.doctor_name}</p>
                                            <p><strong>Time:</strong> {new Date(appt.appointment_time).toLocaleString()}</p>
                                            <p><strong>Status:</strong> <span className={`status-${appt.status.toLowerCase()}`}>{appt.status}</span></p>
                                        </div>
                                        {/* --- UPDATED ACTION BUTTONS LOGIC --- */}
                                        <div className="appointment-actions">
                                            {/* Show "Cancel" button only for "Booked" appointments */}
                                            {appt.status === 'Booked' && (
                                                <button onClick={() => handleCancelAppointment(appt.id)} className="btn-cancel">
                                                    Cancel
                                                </button>
                                            )}
                                            {/* Show "Leave a Review" button only for "Completed" appointments */}
                                            {appt.status === 'Completed' && (
                                                <button onClick={() => handleOpenReviewModal(appt)} className="btn-review">
                                                    Leave a Review
                                                </button>
                                            )}
                                            <Link to={`/doctor/${appt.doctor_id}`} className="btn btn-secondary">
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <h4>You have no upcoming appointments.</h4>
                                    <p>Ready to book your next consultation?</p>
                                    <Link to="/doctors" className="btn btn-primary" style={{marginTop: '1rem'}}>
                                        Find and Book a Doctor
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;