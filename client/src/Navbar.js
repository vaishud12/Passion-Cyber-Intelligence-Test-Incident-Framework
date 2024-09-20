import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import ProfileModal from './components/ProfileModal';
import { FaUserCircle } from 'react-icons/fa';
import logo from './Signup-Login/logo.jpeg'; 
import * as API from "./Endpoint/Endpoint";
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);

    const fetchUserDetails = async () => {
      if (email) {
        try {
          const response = await axios.get(API.GET_USERID, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params: { email }
          });
          console.log('Fetched user details:', response.data); // Log response
          const data = response.data;
          setUserDetails(data);
          setIsAdmin(data.isadmin); // Ensure isAdmin is correctly set
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError('Failed to fetch user details.');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
       <nav className="bg-blue-500 p-4 flex justify-between items-center fixed top-0 left-0 right-0" style={{ height: '50px' }}>
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-26 mr-2" />
        </div>
        <ul className="flex space-x-4">
          
          <li className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2 text-white focus:outline-none">
              <FaUserCircle className="h-8 w-8" />
              {userEmail && (
                <div className="flex flex-col ml-2 text-left">
                  <span className="text-white">{userEmail}</span>
                  <span className="text-sm text-gray-300">
                    {isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                
                <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <ProfileModal
        isOpen={modalOpen}
        onClose={closeModal}
        email={userEmail}
      />
    </>
  );
};

export default Navbar;
