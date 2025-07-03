// src/components/FaqSection.jsx

import React, { useState } from 'react';

const faqData = [
  { question: "Is this service free for patients?", answer: "Yes, our core services for patients, including finding doctors and booking appointments, are completely free. Some premium features or specific telemedicine consultations may have a cost." },
  { question: "How do you verify the doctors on the platform?", answer: "We have a rigorous verification process that includes checking medical licenses, specialty certifications, and educational background to ensure all doctors on our platform are qualified and in good standing." },
  { question: "Can I cancel or reschedule an appointment?", answer: "Absolutely. You can manage your appointments directly from your patient dashboard. Please be mindful of the doctor's cancellation policy, which is listed on their profile." },
  { question: "Is my personal and medical information secure?", answer: "Yes, security is our top priority. We use industry-standard encryption and follow HIPAA guidelines to protect all your data. Your information is never shared without your consent." },
];

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{faq.question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="faq-answer">{faq.answer}</div>}
    </div>
  );
};

const FaqSection = () => {
  return (
    <section id="faq" className="section section-light">
      <div className="container">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqData.map((faq, index) => (
            <FaqItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;