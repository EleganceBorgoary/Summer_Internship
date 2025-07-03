// src/components/ServicesSection.jsx

import React from 'react';

const ServicesSection = () => {
  return (
    <section id="services" className="section section-light">
      <div className="container text-center">
        <h2 className="section-title">A Transparent Healthcare Experience</h2>
        <p className="section-subtitle">We empower you with the information you need to make the right choices.</p>
        <div className="services-list-container">
          <ul className="service-list">
            <li>
              <strong>Find the Perfect Doctor:</strong>
              <span> Search by specialty and location to find the right match for your needs.</span>
            </li>
            <li>
              <strong>View Real-time Schedules:</strong>
              <span> See doctors' up-to-date availability and book a slot that works for you instantly.</span>
            </li>
            <li>
              <strong>Read Authentic Reviews:</strong>
              <span> Make informed decisions by reading verified reviews from other patients.</span>
            </li>
            <li>
              <strong>Transparent Cost Information:</strong>
              <span> Understand potential costs upfront to avoid surprises.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;