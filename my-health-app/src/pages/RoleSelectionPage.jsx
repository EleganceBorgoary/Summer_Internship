// src/pages/RoleSelectionPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';

const RoleSelectionPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Join Us or Sign In</h1>
        <p className="auth-subtitle">Are you a healthcare professional or a patient?</p>

        <div className="role-selection-grid">
          {/* Doctor Card */}
          <div className="role-card">
            <FaUserMd className="role-icon" />
            <h2>I'm a Doctor</h2>
            <div className="role-actions">
              <Link to="/doctor/signup" className="btn btn-primary">Sign Up</Link>
              <Link to="/doctor/login" className="btn btn-secondary">Log In</Link>
            </div>
          </div>

          {/* Patient Card */}
          <div className="role-card">
            <FaUserInjured className="role-icon" />
            <h2>I'm a Patient</h2>
            <div className="role-actions">
              <Link to="/patient/signup" className="btn btn-primary">Sign Up</Link>
              <Link to="/patient/login" className="btn btn-secondary">Log In</Link>
            </div>
          </div>
        </div>

        <div className="back-to-home">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
