// src/pages/PatientSignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientSignupPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost/my-health-app-backend/register_patient.php', {
        phone,
        password
      });
      setSuccess(response.data.message + " Redirecting to login...");
      setTimeout(() => {
        navigate('/patient/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h1 className="auth-title">Patient Sign Up</h1>
        {error && <p className="form-error-message">{error}</p>}
        {success && <p className="form-success-message">{success}</p>}
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Re-enter Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary auth-btn">Sign Up</button>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/patient/login">Log In</Link></p>
          <Link to="/select-role">← Back to Role Selection</Link>
        </div>
      </form>
    </div>
  );
};

export default PatientSignupPage;