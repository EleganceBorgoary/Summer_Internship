// src/components/EarlyAccessSection.jsx

import React, { useState } from 'react';
import axios from 'axios';

const EarlyAccessSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Make a POST request to our PHP endpoint, sending the email
      const response = await axios.post('http://localhost/my-health-app-backend/early-access.php', {
        email: email,
      });
      // Set success message from the backend response
      setMessage(response.data.message);
      setEmail(''); // Clear the input field
    } catch (err) {
      // Set error message from the backend response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="early-access" className="section section-dark">
      <div className="container text-center">
        <h2 className="section-title">Get Early Access</h2>
        <p className="section-subtitle">
          Be the first to know about new features, services, and special offers.
        </p>
        <form onSubmit={handleSubmit} className="early-access-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>
        {/* Display feedback messages */}
        {message && <p className="form-success-message">{message}</p>}
        {error && <p className="form-error-message">{error}</p>}
      </div>
    </section>
  );
};

export default EarlyAccessSection;