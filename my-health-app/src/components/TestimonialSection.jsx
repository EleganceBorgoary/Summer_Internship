// src/components/TestimonialSection.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestimonialSection = () => {
  // State to store testimonials, loading status, and errors
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook runs once after the component is first rendered
  useEffect(() => {
    // Define an async function to fetch the data
    const fetchTestimonials = async () => {
      try {
        // Use axios to make a GET request to our PHP endpoint
        const response = await axios.get('http://localhost/my-health-app-backend/testimonials.php');
        // Update the state with the data from the backend
        setTestimonials(response.data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchTestimonials(); // Call the function
  }, []); // The empty array [] ensures this runs only once

  if (loading) {
    return <div className="container text-center">Loading testimonials...</div>;
  }

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-grid">
          {/* Map over the testimonials array from state and render each one */}
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <img className="testimonial-avatar" src={testimonial.avatar_url} alt={testimonial.name} />
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;