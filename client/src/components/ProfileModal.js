import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose, email }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (email) {
          const response = await axios.get(`http://localhost:5014/incident-api/userid`, {
            params: { email }
          });
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (isOpen && email) {
      fetchUserDetails();
    }
  }, [isOpen, email]);

  if (!isOpen || !userDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <div className="mb-4">
          <strong>Name:</strong> {userDetails.name}
        </div>
        <div className="mb-4">
          <strong>Role:</strong> {userDetails.role}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {userDetails.email}
        </div>
        <button 
          onClick={onClose} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
