// src/components/ProfilePhoto.js
import React, { useState } from 'react';

const ProfilePhoto = ({ currentPhotoUrl, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);

    try {
      const response = await fetch('/api/upload-profile-photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT auth
        },
      });

      const data = await response.json();
      if (response.ok) {
        onUploadSuccess(data.profilePhotoUrl);
      } else {
        setError(data.message || 'Failed to upload photo');
      }
    } catch (err) {
      setError('Error uploading photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-photo-container">
      <img
        src={currentPhotoUrl || '/default-avatar.jpg'}
        alt="Profile"
        className="profile-photo"
      />
      <div className="edit-button">
        <label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          Change Photo
        </label>
      </div>
      {selectedFile && (
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilePhoto;
