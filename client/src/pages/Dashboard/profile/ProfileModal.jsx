import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaUserEdit, FaKey } from 'react-icons/fa';
import { X } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const user = {
    name: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
    status: 'verified', 
    joinDate: 'January 1, 2023',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="relative max-w-sm w-full bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center mb-4">
          <div className='pt-6'>
            <img className="w-16 h-16 rounded-full mb-3" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="User profile" />
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            {user.status === 'verified' ? (
              <FaCheckCircle className="text-green-500 w-5 h-5" title="Verified User" />
            ) : (
              <FaExclamationCircle className="text-red-500 w-5 h-5" title="Blocked User" />
            )}
          </div>
          <p className="text-sm text-gray-500 mb-8">{user.email}</p>
          <p className="text-sm text-gray-400 mt-2">Joined on: {user.joinDate}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          <button className="flex items-center justify-center flex-1 bg-indigo-500 text-white py-2 rounded-lg shadow hover:bg-indigo-600">
            <FaUserEdit className="mr-2" />
            Edit Profile
          </button>
          <button className="flex items-center justify-center flex-1 bg-gray-500 text-white py-2 rounded-lg shadow hover:bg-gray-600">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
