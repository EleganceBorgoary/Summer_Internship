// src/components/AvailabilityManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
});

const AvailabilityManager = ({ doctorId }) => {
    const [availability, setAvailability] = useState(
        daysOfWeek.map((_, index) => ({ day_of_week: index, start_time: "09:00", end_time: "17:00", active: false }))
    );
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAvailability = async () => {
            const response = await axios.get(`http://localhost/my-health-app-backend/doctor_set_availability.php?doctor_id=${doctorId}`);
            if (response.data.length > 0) {
                const newAvailability = availability.map(day => {
                    const savedDay = response.data.find(d => d.day_of_week == day.day_of_week);
                    return savedDay ? { ...day, start_time: savedDay.start_time.slice(0, 5), end_time: savedDay.end_time.slice(0, 5), active: true } : day;
                });
                setAvailability(newAvailability);
            }
        };
        fetchAvailability();
    }, [doctorId]);

    const handleToggle = (index) => {
        const newAvailability = [...availability];
        newAvailability[index].active = !newAvailability[index].active;
        setAvailability(newAvailability);
    };

    const handleTimeChange = (index, type, value) => {
        const newAvailability = [...availability];
        newAvailability[index][type] = value;
        setAvailability(newAvailability);
    };

    const handleSave = async () => {
        const activeAvailability = availability
            .filter(day => day.active)
            .map(({ day_of_week, start_time, end_time }) => ({ day_of_week, start_time, end_time }));
        
        try {
            const response = await axios.post('http://localhost/my-health-app-backend/doctor_set_availability.php', {
                doctorId,
                availability: activeAvailability
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to save availability.');
        }
    };

    return (
        <div className="availability-manager">
            <h3>Manage Your Weekly Availability</h3>
            {message && <p className="form-success-message">{message}</p>}
            {availability.map((day, index) => (
                <div key={index} className={`availability-day ${day.active ? 'active' : ''}`}>
                    <div className="day-toggle">
                        <input type="checkbox" checked={day.active} onChange={() => handleToggle(index)} />
                        <strong>{daysOfWeek[index]}</strong>
                    </div>
                    {day.active && (
                        <div className="time-selects">
                            <select value={day.start_time} onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}>
                                {timeOptions.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
                            </select>
                            <span>to</span>
                            <select value={day.end_time} onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}>
                                {timeOptions.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleSave} className="btn btn-primary" style={{marginTop: '1rem'}}>Save Availability</button>
        </div>
    );
};

export default AvailabilityManager;