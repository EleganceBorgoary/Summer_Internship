// src/components/AppointmentScheduler.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentScheduler = ({ doctorId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const patient = JSON.parse(localStorage.getItem('healthAppUser'));

    useEffect(() => {
        if (selectedDate && doctorId) {
            setLoading(true);
            setMessage('');
            axios.get(`http://localhost/my-health-app-backend/get_available_slots.php?doctor_id=${doctorId}&date=${selectedDate}`)
                .then(response => setAvailableSlots(response.data))
                .catch(error => setMessage('Could not fetch slots for this date.'))
                .finally(() => setLoading(false));
        }
    }, [selectedDate, doctorId]);

    const handleBooking = async (slot) => {
        if (!patient) {
            setMessage('You must be logged in as a patient to book an appointment.');
            return;
        }
        const [time, modifier] = slot.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours < 12) hours = parseInt(hours, 10) + 12;
        if (modifier === 'AM' && hours == 12) hours = '00';
        const appointmentTime = `${selectedDate} ${hours}:${minutes}:00`;

        try {
            const response = await axios.post('http://localhost/my-health-app-backend/book_appointment.php', {
                patientId: patient.id,
                doctorId,
                appointmentTime
            });
            setMessage(response.data.message);
            // Refresh slots after booking
            const newResponse = await axios.get(`http://localhost/my-health-app-backend/get_available_slots.php?doctor_id=${doctorId}&date=${selectedDate}`);
            setAvailableSlots(newResponse.data);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    return (
        <div className="appointment-scheduler">
            <h4>Book an Appointment</h4>
            <div className="input-group">
                <label>Select Date:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>
            </div>
            {message && <p className={message.includes('success') ? 'form-success-message' : 'form-error-message'}>{message}</p>}
            {loading ? <p>Finding available slots...</p> : (
                <div className="slots-grid">
                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                        <button key={slot} onClick={() => handleBooking(slot)} className="slot-btn">
                            {slot}
                        </button>
                    )) : <p>No available slots for this day. Please select another date.</p>}
                </div>
            )}
        </div>
    );
};

export default AppointmentScheduler;