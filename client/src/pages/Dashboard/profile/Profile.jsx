/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authenticationState } from '../../../store/atoms/authVerifierSelector';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true);  // State to manage loading
  const [error, setError] = useState(null);      // State to handle errors
  const auth = useRecoilValue(authenticationState);
  const token = localStorage.getItem('token');
  
  // Redirect to home if no token
  if (!token) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    // Fetch user profile from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/profile', {
          headers: {
            authorization: token,  // Send token in Authorization header
          },
        });
        
        if (response.status === 200) {
          setUserData(response.data);  // Save user data from response
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError('Bad Request');
        } else if (err.response && err.response.status === 500) {
          setError('Server Error');
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);  // Stop loading when request completes
      }
    };

    fetchUserProfile();  // Call the function to fetch user data
  }, [token]);
  

  // Check if user is authenticated and not an admin
  setTimeout(() => {
    if (!auth.isValid) {
      return <Navigate to="/" />;
    }
    if (auth.isAdmin) {
      return <Navigate to="/" />;
    }
  }, 100);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={userData} /> {/* Pass user data as prop */}
      
      {/* Main Content */}
      <div className="lg:ml-56">
        <Hero sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={userData} /> {/* Pass user data as prop */}
      </div>
    </div>
  );
};

export default Profile;
