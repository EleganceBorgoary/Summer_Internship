// src/pages/DoctorDashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AvailabilityManager from '../components/AvailabilityManager';
import ProfilePicUploader from '../components/ProfilePicUploader';

const DoctorDashboardPage = () => {
    // State for user data and UI control
    const [doctor, setDoctor] = useState(null);
    const [editData, setEditData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    
    // UI state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'availability', or 'appointments'
    
    const navigate = useNavigate();

    // Fetch initial data for the dashboard
    const fetchDoctorDetails = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost/my-health-app-backend/get_my_doctor_details.php?id=${id}`);
            setEditData(response.data); // Set data for the form
        } catch (err) {
            setError('Could not fetch your profile details.');
        }
    }, []);

    const fetchAppointments = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost/my-health-app-backend/get_my_appointments.php?userId=${id}&userType=doctor`);
            setAppointments(response.data);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        }
    }, []);

    // Effect to run on component mount to check login and fetch data
    useEffect(() => {
        const loggedInDoctor = JSON.parse(localStorage.getItem('healthAppDoctor'));
        if (loggedInDoctor) {
            setDoctor(loggedInDoctor);
            // Fetch all necessary data in parallel
            Promise.all([
                fetchDoctorDetails(loggedInDoctor.id),
                fetchAppointments(loggedInDoctor.id)
            ]).finally(() => {
                setLoading(false);
            });
        } else {
            navigate('/doctor/login');
        }
    }, [navigate, fetchDoctorDetails, fetchAppointments]);

    const handleLogout = () => {
        localStorage.removeItem('healthAppDoctor');
        navigate('/');
    };

    const handleInputChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost/my-health-app-backend/update_my_doctor_details.php', {
                id: doctor.id,
                ...editData,
            });
            setSuccess(response.data.message);
            setIsEditing(false); // Exit edit mode on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };
    
    const handleUploadSuccess = (newImageUrl) => {
        const updatedDoctor = { ...doctor, profile_pic_url: newImageUrl };
        setDoctor(updatedDoctor);
        setEditData({ ...editData, profile_pic_url: newImageUrl });
        localStorage.setItem('healthAppDoctor', JSON.stringify(updatedDoctor));
    };

    const handleCompleteAppointment = async (appointmentId) => {
        try {
            await axios.post('http://localhost/my-health-app-backend/doctor_complete_appointment.php', { appointmentId });
            // Refresh appointments to show the new status
            fetchAppointments(doctor.id);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update appointment.');
        }
    };

    // --- NEW FUNCTION FOR DOCTOR TO CANCEL ---
    const handleCancelAppointment = async (appointmentId) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this patient's appointment?");
        if (isConfirmed) {
            try {
                await axios.post('http://localhost/my-health-app-backend/cancel_appointment.php', {
                    appointmentId: appointmentId,
                    userId: doctor.id,
                    userType: 'doctor'
                });
                // Refresh the list
                fetchAppointments(doctor.id);
            } catch (err) {
                alert(err.response?.data?.message || "Failed to cancel appointment.");
            }
        }
    };

    // Loading state until all data is fetched
    if (loading || !doctor || !editData) {
        return <div className="auth-page"><div>Loading Dashboard...</div></div>;
    }

    const statusClass = `status-${doctor.status.toLowerCase()}`;

    // Helper to render the content for the active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'availability':
                return <AvailabilityManager doctorId={doctor.id} />;
            case 'appointments':
                return (
                    <div>
                        <h3>My Scheduled Appointments</h3>
                        <div className="appointment-list">
                            {appointments.length > 0 ? appointments.map(appt => (
                                <div key={appt.id} className="appointment-item-detailed">
                                    <div className="appointment-info">
                                        <p><strong>Patient Phone:</strong> {appt.patient_phone}</p>
                                        <p><strong>Time:</strong> {new Date(appt.appointment_time).toLocaleString()}</p>
                                        <p><strong>Status:</strong> <span className={`status-${appt.status.toLowerCase()}`}>{appt.status}</span></p>
                                    </div>
                                    <div className="appointment-actions">
                                        {/* --- UPDATED BUTTON LOGIC --- */}
                                        {/* Show different buttons based on status */}
                                        {appt.status === 'Booked' && (
                                            <>
                                                <button onClick={() => handleCompleteAppointment(appt.id)} className="btn-complete">
                                                    Mark as Completed
                                                </button>
                                                <button onClick={() => handleCancelAppointment(appt.id)} className="btn-cancel">
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )) : <p>You have no appointments scheduled.</p>}
                        </div>
                    </div>
                );
            case 'profile':
            default:
                return isEditing ? (
                    <form onSubmit={handleSaveProfile}>
                        {/* ... your existing form JSX ... */}
                        <div className="input-group"><label>Email (cannot be changed)</label><input type="email" value={editData.email} disabled /></div>
                        <div className="input-group"><label>Phone Number</label><input type="tel" name="phone" value={editData.phone} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Qualifications</label><input type="text" name="qualifications" value={editData.qualifications} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Specialization</label><input type="text" name="specialization" value={editData.specialization} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Address</label><textarea name="address" rows="3" value={editData.address} onChange={handleInputChange}></textarea></div>
                        <div className="dashboard-actions"><button type="submit" className="btn btn-primary">Save Changes</button><button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button></div>
                    </form>
                ) : (
                    <div className="profile-details-view">
                        {/* ... your existing profile view JSX ... */}
                        <p><strong>Email:</strong> {editData.email}</p><p><strong>Phone:</strong> {editData.phone}</p><p><strong>Qualifications:</strong> {editData.qualifications}</p><p><strong>Specialization:</strong> {editData.specialization}</p><p><strong>Address:</strong> {editData.address}</p><div className="dashboard-actions"><button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button></div>
                    </div>
                );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{maxWidth: '800px'}}>
                <div className="dashboard-header-with-pic">
                    <ProfilePicUploader userId={doctor.id} userType="doctor" currentImageUrl={doctor.profile_pic_url} onUploadSuccess={handleUploadSuccess}/>
                    <div className="dashboard-header-text"><h1 className="auth-title" style={{textAlign: 'left', marginBottom: 0}}>Doctor Dashboard</h1><h2>Welcome, {doctor.full_name}</h2></div>
                    <button onClick={handleLogout} className="btn btn-secondary logout-btn">Log Out</button>
                </div>
                {error && <p className="form-error-message">{error}</p>}{success && <p className="form-success-message">{success}</p>}
                <div className="profile-status">Your current account status is: <span className={statusClass}>{doctor.status}</span></div>
                <div className="dashboard-tabs"><button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>My Profile</button><button onClick={() => setActiveTab('availability')} className={activeTab === 'availability' ? 'active' : ''}>My Availability</button><button onClick={() => setActiveTab('appointments')} className={activeTab === 'appointments' ? 'active' : ''}>Appointments</button></div>
                <div className="tab-content">{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;