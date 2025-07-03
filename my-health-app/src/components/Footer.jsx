// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        {/* Copyright notice on the left */}
        <p className="footer-copyright">
          © {new Date().getFullYear()} HealthApp. All rights reserved.
        </p>

        {/* Essential links on the right */}
        <div className="footer-simple-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;