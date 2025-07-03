// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'; 

// Import your new page components
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import PatientSignupPage from './pages/PatientSignupPage';
import PatientLoginPage from './pages/PatientLoginPage';
import DoctorSignupPage from './pages/DoctorSignupPage';
import DashboardPage from './pages/DashboardPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      {/* Route for the landing page */}
      <Route path="/" element={<HomePage />} />
      
      {/* Route for Login/Signup Role Selection */}
      <Route path="/select-role" element={<RoleSelectionPage />} />
      
      {/* Routes for Patients */}
      <Route path="/patient/signup" element={<PatientSignupPage />} />
      <Route path="/patient/login" element={<PatientLoginPage />} />

      {/* Route for Doctors */}
      <Route path="/doctor/signup" element={<DoctorSignupPage />} />

      {/* A protected route for a logged-in user */}
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* New Routes for Doctors */}
      <Route path="/doctor/login" element={<DoctorLoginPage />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
      
      {/* New Public Routes */}
      <Route path="/doctors" element={<DoctorListPage />} />
      <Route path="/doctor/:id" element={<DoctorProfilePage />} />
      
      {/* New Admin Route */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;