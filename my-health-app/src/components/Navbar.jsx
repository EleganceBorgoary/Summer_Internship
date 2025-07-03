// src/components/Navbar.jsx

import React, { useState } from 'react';
// Use NavLink for navigation links to get the 'active' class
import { Link, NavLink } from 'react-router-dom';
// Import icons for the hamburger menu
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ onLinkClick }) => {
    // State to manage whether the mobile menu is open or closed
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        // If the onLinkClick prop is provided, call it
        if(onLinkClick) onLinkClick();
    };

    return (
        <header className="navbar">
            <div className="container nav-container">
                {/* The logo now also closes the mobile menu when clicked */}
                <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
                    HealthApp
                </Link>

                {/* The hamburger menu icon, which changes based on the menu state */}
                <button className="nav-toggle" onClick={handleMenuToggle}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* The main menu, its class changes to slide in/out on mobile */}
                <nav className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
                    {/* Use <ul> and <li> for semantic navigation links */}
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/doctors" className="nav-link-cta" onClick={closeMobileMenu}>
                                Find a Doctor
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink will automatically get an 'active' class from React Router */}
                            <a href="/#features" onClick={closeMobileMenu}>Features</a>
                        </li>
                        <li>
                            <a href="/#services" onClick={closeMobileMenu}>Services</a>
                        </li>
                        <li>
                            <a href="/#how-it-works" onClick={closeMobileMenu}>How It Works</a>
                        </li>
                        <li>
                            <a href="/#faq" onClick={closeMobileMenu}>FAQ</a>
                        </li>
                    </ul>
                    
                    {/* The login/signup buttons */}
                    <div className="nav-actions">
                        <Link to="/select-role" className="btn btn-secondary" onClick={closeMobileMenu}>
                            Log In
                        </Link>
                        <Link to="/select-role" className="btn btn-primary" onClick={closeMobileMenu}>
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;