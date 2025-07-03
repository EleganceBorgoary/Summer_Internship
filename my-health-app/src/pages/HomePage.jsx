// src/pages/HomePage.jsx

import React from 'react';

// Import all the components that make up the landing page
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesList from '../components/FeaturesList';
import ServicesSection from '../components/ServicesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TestimonialSection from '../components/TestimonialSection';
import CtaSection from '../components/CtaSection';
import EarlyAccessSection from '../components/EarlyAccessSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

// This is the main component for your landing page.
// It acts as a container that assembles all the other sections in order.
const HomePage = () => {

    // This function is passed down to the Navbar component.
    // Its purpose is to allow the mobile menu in the Navbar to close
    // itself when a user clicks on a link that scrolls to a section on this page.
    const handleLinkClick = () => {
      // For this implementation, the function body can be empty.
      // The Navbar component just needs the function to be passed to it.
      // In a more advanced app, you could add smooth-scrolling logic here.
    };

    return (
        <>
            {/* 
              We pass the handleLinkClick function as a prop to the Navbar.
              This connects the parent (HomePage) to the child (Navbar).
            */}
            <Navbar onLinkClick={handleLinkClick} />
            
            <main>
                <HeroSection />
                <FeaturesList />
                <ServicesSection />
                <HowItWorksSection />
                <TestimonialSection />
                <CtaSection />
                <EarlyAccessSection />
                <FaqSection />
            </main>
            
            <Footer />
        </>
    );
};

export default HomePage;