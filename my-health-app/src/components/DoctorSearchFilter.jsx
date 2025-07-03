// src/components/DoctorSearchFilter.jsx

import React, { useState } from 'react';

const DoctorSearchFilter = ({ onFilterChange }) => {
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        // We call the parent's handler function immediately on change
        onFilterChange({ search: e.target.value, specialization });
    };

    const handleSpecializationChange = (e) => {
        setSpecialization(e.target.value);
        onFilterChange({ search, specialization: e.target.value });
    };

    return (
        <div className="search-filter-bar">
            <input
                type="text"
                placeholder="Search by doctor's name..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
            />
            <select
                value={specialization}
                onChange={handleSpecializationChange}
                className="filter-select"
            >
                <option value="">All Specializations</option>
                {/* In a real app, this list would be fetched from the database */}
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
            </select>
        </div>
    );
};

export default DoctorSearchFilter;