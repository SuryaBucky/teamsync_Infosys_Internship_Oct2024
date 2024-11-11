// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import ProfilePhoto from '../components/ProfilePhoto';

const ProfilePage = () => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch('/api/user-profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setProfilePhotoUrl(data.profilePhotoUrl || '');
    };

    fetchUserProfile();
  }, []);

  const handleUploadSuccess = (newPhotoUrl) => {
    setProfilePhotoUrl(newPhotoUrl);
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <ProfilePhoto
        currentPhotoUrl={profilePhotoUrl}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default ProfilePage;
