// src/pages/DoctorLoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost/my-health-app-backend/login_doctor.php', {
        email,
        password
      });
      // Store user info in localStorage to persist login
      localStorage.setItem('healthAppDoctor', JSON.stringify(response.data.doctor));
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h1 className="auth-title">Doctor Log In</h1>
        {error && <p className="form-error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary auth-btn">Log In</button>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/doctor/signup">Register Here</Link></p>
          <Link to="/select-role">← Back to Role Selection</Link>
        </div>
      </form>
    </div>
  );
};

export default DoctorLoginPage;