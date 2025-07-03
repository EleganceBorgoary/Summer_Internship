// src/pages/PatientLoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientLoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost/my-health-app-backend/login_patient.php', {
        phone,
        password
      });
      // Store user info in localStorage to persist login
      localStorage.setItem('healthAppUser', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h1 className="auth-title">Patient Log In</h1>
        {error && <p className="form-error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary auth-btn">Log In</button>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/patient/signup">Sign Up</Link></p>
          <Link to="/select-role">← Back to Role Selection</Link>
        </div>
      </form>
    </div>
  );
};

export default PatientLoginPage;