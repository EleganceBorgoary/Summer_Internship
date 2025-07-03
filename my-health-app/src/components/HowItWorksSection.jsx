// src/components/HowItWorksSection.jsx

import React from 'react';
import { FaSearch, FaRegCalendarAlt, FaPencilAlt } from 'react-icons/fa';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section">
      <div className="container text-center">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">A simple, transparent process for everyone.</p>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon-wrapper"><FaSearch className="step-icon" /></div>
            <h3 className="step-title">1. Find a Doctor</h3>
            <p className="step-description">Patients can easily search for doctors by specialty, location, or name. Doctors get visibility to thousands of potential patients.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><FaRegCalendarAlt className="step-icon" /></div>
            <h3 className="step-title">2. Book an Appointment</h3>
            <p className="step-description">View real-time availability and book an appointment with just a few clicks. The doctor's calendar is updated instantly.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><FaPencilAlt className="step-icon" /></div>
            <h3 className="step-title">3. Leave a Review</h3>
            <p className="step-description">After the appointment, patients can share their experience, helping others make informed decisions and giving doctors valuable feedback.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;