// src/pages/DoctorListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorSearchFilter from '../components/DoctorSearchFilter';

const DoctorListPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', specialization: '' });

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`http://localhost/my-health-app-backend/get_doctors.php?${params}`);
            setDoctors(response.data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <>
            <Navbar />
            <header className="page-header">
                <div className="container">
                    <h1 className="section-title">Find a Doctor</h1>
                    <p className="section-subtitle">Browse our network of verified healthcare professionals.</p>
                    <DoctorSearchFilter onFilterChange={handleFilterChange} />
                </div>
            </header>
            <main>
                <div className="container">
                    {loading ? (
                        <p style={{textAlign: 'center', padding: '2rem'}}>Loading doctors...</p>
                    ) : (
                        <div className="doctor-list-container">
                            {doctors.length > 0 ? doctors.map(doctor => (
                                // --- THIS IS THE CRITICAL LINE THAT WAS LIKELY WRONG ---
                                // Ensure 'doctor.id' is used for BOTH key and the 'to' link.
                                <Link to={`/doctor/${doctor.id}`} key={doctor.id} className="doctor-card">
                                    <div className="doctor-card-header">
                                        <img 
                                            src={doctor.profile_pic_url ? `http://localhost/my-health-app-backend/${doctor.profile_pic_url}` : `https://placehold.co/80x80/e2e8f0/6366f1?text=${doctor.full_name.charAt(0)}`} 
                                            alt={doctor.full_name} 
                                            className="doctor-card-pic"
                                        />
                                        <div className="doctor-card-info">
                                            <h3>{doctor.full_name}</h3>
                                            <p className="specialization">{doctor.specialization}</p>
                                        </div>
                                    </div>
                                    <p className="address">{doctor.address}</p>
                                </Link>
                            )) : <p style={{textAlign: 'center', padding: '2rem'}}>No doctors found matching your criteria.</p>}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default DoctorListPage;