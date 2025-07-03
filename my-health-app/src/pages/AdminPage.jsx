// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminPage = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost/my-health-app-backend/admin_get_doctors.php', { adminPassword: password });
            setDoctors(response.data);
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError('Incorrect password.');
        }
    };

    const handleAction = async (id, action) => {
        const endpoint = action === 'approve' ? 'admin_approve_doctor.php' : 'admin_reject_doctor.php';
        try {
            await axios.post(`http://localhost/my-health-app-backend/${endpoint}`, { id, adminPassword: password });
            // Refresh the list after action
            const response = await axios.post('http://localhost/my-health-app-backend/admin_get_doctors.php', { adminPassword: password });
            setDoctors(response.data);
        } catch (err) {
            alert('An error occurred. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="auth-page">
                <form onSubmit={handleAuth} className="admin-login-prompt auth-container">
                    <h1 className="auth-title">Admin Access</h1>
                    {error && <p className="form-error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="password">Enter Admin Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn">Login</button>
                </form>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="page-header">
                <h1 className="section-title">Admin Panel</h1>
                <p className="section-subtitle">Doctor Verification Management</p>
            </div>
            <div className="container" style={{padding: '2rem 1.5rem'}}>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.full_name}</td>
                                    <td>{doc.email}</td>
                                    <td><span className={`status-${doc.status.toLowerCase()}`}>{doc.status}</span></td>
                                    <td>
                                        {doc.status === 'Pending' && (
                                            <div className="admin-actions">
                                                <button onClick={() => handleAction(doc.id, 'approve')} className="approve-btn">Approve</button>
                                                <button onClick={() => handleAction(doc.id, 'reject')} className="reject-btn">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminPage;