// src/components/CtaSection.jsx

import React from 'react';

const CtaSection = () => {
  return (
    <section id="cta" className="section cta-section">
      <div className="container text-center">
        <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
        <p className="cta-text">Join thousands of patients and doctors who are simplifying healthcare.</p>
        <a href="#signup" className="btn btn-light btn-lg">Sign Up for Free</a>
      </div>
    </section>
  );
};

export default CtaSection;