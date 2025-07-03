// src/components/FeaturesList.jsx

import React from 'react';
// 1. Remove FaFileInvoiceDollar from the import
import { FaStethoscope, FaCalendarCheck, FaStar } from 'react-icons/fa';

// 2. Remove the last object from the features array
const features = [
  { icon: <FaStethoscope className="feature-icon icon-blue"/>, title: 'Find Doctors', description: 'Easily search and filter through our extensive network of certified medical professionals.' },
  { icon: <FaCalendarCheck className="feature-icon icon-green"/>, title: 'Book Appointments', description: 'Book and manage your appointments online, 24/7, with instant confirmation.' },
  { icon: <FaStar className="feature-icon icon-yellow"/>, title: 'Give Reviews', description: 'Share your experience by rating and reviewing doctors to help our community.' },
];

const FeaturesList = () => {
  return (
    <section id="features" className="section">
      <div className="container text-center">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;