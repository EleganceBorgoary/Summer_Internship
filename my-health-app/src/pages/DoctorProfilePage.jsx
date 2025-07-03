// src/pages/DoctorProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AppointmentScheduler from '../components/AppointmentScheduler';
import DoctorReviews from '../components/DoctorReviews'; // Import the new component

// Helper array to convert day index to a name
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Helper function to format time from "HH:MM:SS" to "h:mm A"
const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};


const DoctorProfilePage = () => {
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [doctorAvailability, setDoctorAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id } = useParams();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost/my-health-app-backend/get_doctor_details.php?id=${id}`);
                setDoctorDetails(response.data.details);
                const sortedAvailability = response.data.availability.sort((a, b) => a.day_of_week - b.day_of_week);
                setDoctorAvailability(sortedAvailability);
            } catch (err) {
                console.error("Failed to fetch doctor details:", err);
                setError('Could not find doctor details. They may not be verified or the profile does not exist.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDoctorDetails();
    }, [id]);

    if (loading) {
        return (<><Navbar /><div className="profile-container text-center">Loading Profile...</div><Footer /></>);
    }
    
    return (
        <>
            <Navbar />
            <main className="profile-container">
                {error ? (
                    <div className="text-center">
                        <p className="form-error-message">{error}</p>
                        <Link to="/doctors" className="btn btn-primary" style={{marginTop: '1rem'}}>Back to Doctor List</Link>
                    </div>
                ) : doctorDetails && (
                    <>
                        <div className="profile-header">
                            <img 
                                src={doctorDetails.profile_pic_url ? `http://localhost/my-health-app-backend/${doctorDetails.profile_pic_url}` : `https://placehold.co/120x120/e2e8f0/6366f1?text=${doctorDetails.full_name.charAt(0)}`} 
                                alt={doctorDetails.full_name}
                                className="profile-page-pic"
                            />
                            <div>
                                <h1 className="profile-name">{doctorDetails.full_name}</h1>
                                {doctorDetails.status === 'Verified' && (
                                    <span className="verified-badge">✓ Verified</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-details-view" style={{backgroundColor: 'var(--bg-white)', padding: 0}}>
                            <p><strong>Specialization:</strong> {doctorDetails.specialization}</p>
                            <p><strong>Qualifications:</strong> {doctorDetails.qualifications}</p>
                            <p><strong>Address:</strong> {doctorDetails.address}</p>
                        </div>
                        
                        <div className="weekly-availability-summary">
                            <h4>Doctor's Weekly Schedule</h4>
                            {doctorAvailability.length > 0 ? (
                                <ul className="availability-list">
                                    {doctorAvailability.map(day => (
                                        <li key={day.day_of_week}>
                                            <span className="day-name">{daysOfWeek[day.day_of_week]}</span>
                                            <span className="day-time">{formatTime(day.start_time)} - {formatTime(day.end_time)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>This doctor has not set their weekly schedule yet. Please check back later.</p>
                            )}
                        </div>

                        <div className="profile-details" style={{marginTop: '2rem'}}>
                            <AppointmentScheduler doctorId={id} />
                        </div>

                        {/* This new section will display the reviews */}
                        <div className="profile-details" style={{marginTop: '2rem'}}>
                            <DoctorReviews doctorId={id} />
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
};

export default DoctorProfilePage;