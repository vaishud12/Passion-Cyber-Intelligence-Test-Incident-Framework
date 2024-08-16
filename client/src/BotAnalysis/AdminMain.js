import React, { useState } from 'react';
import FTable from '../Incident/FTable'; // Import FTable component
import ResolutionTable from '../Resolve/ResolutionTable';
import UserTable from '../Signup-Login/UserList';
import IncidentCategory from '../incidentcategory/IncidentCategory';
import Admin from '../Incident/Admin'; // Import Admin component
import UserList from '../Signup-Login/UserList';

const AdminMain = () => {
    const [fTableVisible, setFTableVisible] = useState(false);
    const [rTableVisible, setRTableVisible] = useState(false);
    const [userTableVisible, setUserTableVisible] = useState(false);
    const [incidentCategoryVisible, setIncidentCategoryVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true); // Set this based on your authentication logic

    const handleTable = (component) => {
        if (component === 'fTable') {
            setFTableVisible(true);
            setRTableVisible(false);
            setUserTableVisible(false);
            setIncidentCategoryVisible(false);
        } else if (component === 'rtable') {
            setRTableVisible(true);
            setFTableVisible(false);
            setUserTableVisible(false);
            setIncidentCategoryVisible(false);
        } else if (component === 'userTable') {
            setUserTableVisible(true);
            setFTableVisible(false);
            setRTableVisible(false);
            setIncidentCategoryVisible(false);
        }else if (component === 'incidentCategory') {
            setIncidentCategoryVisible(true);
            setFTableVisible(false);
            setRTableVisible(false);
            setUserTableVisible(false);
        }
    };

    return (
        <div>
             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1.5em', // Smaller size for the title
                    color: '#333',
                    margin: 0
                }}>
                    Admin Dashboard
                </h1>
            </div>
            <div className="flex justify-between space-x-4 mt-4">

            <button
                    className="w-full px-4 py-2 text-white transition duration-300 bg-green-500 rounded-md hover:bg-green-600"
                    onClick={() => handleTable('incidentCategory')}
                >
                    AgroIncident
                </button>
                <button
                    className="w-full px-4 py-2 text-white transition duration-300 bg-green-500 rounded-md hover:bg-green-600"
                    onClick={() => handleTable('fTable')}
                >
                    Incident
                </button>
                <button
                    className="w-full px-4 py-2 text-white transition duration-300 bg-green-500 rounded-md hover:bg-green-600"
                    onClick={() => handleTable('rtable')}
                >
                    Resolution
                </button>
                <button
                    className="w-full px-4 py-2 text-white transition duration-300 bg-green-500 rounded-md hover:bg-green-600"
                    onClick={() => handleTable('userTable')}
                >
                    Users
                </button>
            </div>
            {incidentCategoryVisible && <IncidentCategory />}
            {fTableVisible && isAdmin ? <Admin /> : fTableVisible && <FTable />}
            {rTableVisible && <ResolutionTable />}
            {userTableVisible && <UserList/>} 
        </div>
    );
};

export default AdminMain;
