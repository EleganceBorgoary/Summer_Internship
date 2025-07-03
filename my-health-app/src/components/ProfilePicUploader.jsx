// src/components/ProfilePicUploader.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';

const ProfilePicUploader = ({ userId, userType, currentImageUrl, onUploadSuccess }) => {
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // This constructs the full URL to display the image from the backend
    const imageUrl = currentImageUrl 
        ? `http://localhost/my-health-app-backend/${currentImageUrl}` 
        : `https://placehold.co/150x150/e2e8f0/6366f1?text=${userType.charAt(0).toUpperCase()}`; // Placeholder

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setIsUploading(true);

        const formData = new FormData();
        formData.append('profilePic', file);
        formData.append('userId', userId);
        formData.append('userType', userType);

        try {
            const response = await axios.post('http://localhost/my-health-app-backend/upload_profile_pic.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Call the parent component's success handler to update its state
            onUploadSuccess(response.data.newImageUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="profile-pic-uploader">
            <div className="profile-pic-container">
                <img src={imageUrl} alt="Profile" className="profile-pic-img" />
                <button 
                    className="upload-overlay" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                >
                    <FaCamera />
                    <span>{isUploading ? 'Uploading...' : 'Change'}</span>
                </button>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/png, image/jpeg"
            />
            {error && <p className="form-error-message" style={{textAlign: 'center'}}>{error}</p>}
        </div>
    );
};

export default ProfilePicUploader;