// src/components/HeroSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// We don't need to import the image here anymore, as it will be a background in CSS

const HeroSection = () => {
  return (
    // The main section now has a new class 'hero-bg' which will hold the background image
    <section id="home" className="hero-section hero-bg">
      {/* This overlay div is for the dark tint that makes text readable */}
      <div className="hero-overlay"></div>
      
      {/* The container now has a 'hero-content' class to position it */}
      <div className="container hero-content">
        <h1 className="hero-title">Your Health, Your Schedule.</h1>
        <p className="hero-subtitle">
          Effortlessly find top-rated doctors, book appointments instantly, and manage your health journey all in one place.
        </p>
        <div className="hero-buttons">
          <Link to="/select-role" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
          <Link to="/select-role" className="btn btn-secondary btn-lg">
            Log In
          </Link>
        </div>
      </div>
      {/* The <img> tag has been completely removed from here */}
    </section>
  );
};

export default HeroSection;