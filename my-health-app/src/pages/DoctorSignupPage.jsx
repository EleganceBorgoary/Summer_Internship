// src/pages/DoctorSignupPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DoctorSignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        registrationNumber: '',
        qualifications: '',
        specialization: '',
        address: '',
        password: '' 
    });
    const [licenseFile, setLicenseFile] = useState(null);
    const [degreeFile, setDegreeFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'licenseFile') {
            setLicenseFile(e.target.files[0]);
        } else {
            setDegreeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!licenseFile || !degreeFile) {
            setError('Please upload both medical license and degree certificate.');
            return;
        }

        setIsLoading(true);

        const submissionData = new FormData();
        // Append all text fields
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        // Append files
        submissionData.append('licenseFile', licenseFile);
        submissionData.append('degreeFile', degreeFile);
        submissionData.append('password', formData.password);
        try {
            const response = await axios.post('http://localhost/my-health-app-backend/register_doctor.php', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-container" onSubmit={handleSubmit} style={{maxWidth: '700px'}}>
                <h1 className="auth-title">Doctor Registration</h1>
                <p className="auth-subtitle">Your application will be manually verified by our team.</p>
                {error && <p className="form-error-message">{error}</p>}
                {success && <p className="form-success-message">{success}</p>}
                
                <div className="form-grid">
                    
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Medical Registration Number</label>
                        <input type="text" name="registrationNumber" onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Qualifications (e.g., MBBS, MD)</label>
                        <input type="text" name="qualifications" onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Specialization (e.g., Cardiologist)</label>
                        <input type="text" name="specialization" onChange={handleInputChange} required />
                    </div>
                </div>
                  <div className="input-group">
    <label>Password</label>
    <input type="password" name="password" onChange={handleInputChange} required />
</div>
                <div className="input-group">
                    <label>Clinic/Hospital Address</label>
                    <textarea name="address" rows="3" onChange={handleInputChange} required></textarea>
                </div>

                <div className="form-grid">
                    <div className="input-group">
                        <label>Upload Medical License</label>
                        <input type="file" name="licenseFile" onChange={handleFileChange} required />
                    </div>
                    <div className="input-group">
                        <label>Upload Degree Certificate</label>
                        <input type="file" name="degreeFile" onChange={handleFileChange} required />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit for Verification'}
                </button>
                <div className="auth-footer">
                    <Link to="/select-role">← Back to Role Selection</Link>
                </div>
            </form>
        </div>
    );
};

export default DoctorSignupPage;