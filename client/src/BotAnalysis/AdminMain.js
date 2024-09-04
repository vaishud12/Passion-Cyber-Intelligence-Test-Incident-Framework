import React, { useState } from 'react';
import FTable from '../Incident/FTable';
import ResolutionTable from '../Resolve/ResolutionTable';
import UserList from '../Signup-Login/UserList';
import IncidentCategory from '../incidentcategory/IncidentCategory';
import Admin from '../Incident/Admin';
import Navbar from '../Navbar';
import Sidebar from "../components/Sidebar";
import "./MainContent.css"
import AdminDashboard from '../components/AdminDashboard'; // Import the AdminDashboard component

const AdminMain = () => {
    const [fTableVisible, setFTableVisible] = useState(false);
    const [rTableVisible, setRTableVisible] = useState(false);
    const [userTableVisible, setUserTableVisible] = useState(false);
    const [incidentCategoryVisible, setIncidentCategoryVisible] = useState(false);
    const [dashboardVisible, setDashboardVisible] = useState(true); // Add this state to control visibility
    const [isAdmin, setIsAdmin] = useState(true);

    const handleTable = (component) => {
        if (component === 'fTable') {
            setFTableVisible(true);
            setRTableVisible(false);
            setUserTableVisible(false);
            setIncidentCategoryVisible(false);
            setDashboardVisible(false); // Hide dashboard when other components are visible
        } else if (component === 'rtable') {
            setRTableVisible(true);
            setFTableVisible(false);
            setUserTableVisible(false);
            setIncidentCategoryVisible(false);
            setDashboardVisible(false); // Hide dashboard when other components are visible
        } else if (component === 'userTable') {
            setUserTableVisible(true);
            setFTableVisible(false);
            setRTableVisible(false);
            setIncidentCategoryVisible(false);
            setDashboardVisible(false); // Hide dashboard when other components are visible
        } else if (component === 'incidentCategory') {
            setIncidentCategoryVisible(true);
            setFTableVisible(false);
            setRTableVisible(false);
            setUserTableVisible(false);
            setDashboardVisible(false); // Hide dashboard when other components are visible
        } else if (component === 'dashboard') {
            setDashboardVisible(true); // Show dashboard
            setFTableVisible(false);
            setRTableVisible(false);
            setUserTableVisible(false);
            setIncidentCategoryVisible(false);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar onMenuItemClick={handleTable} />
                <div className="main-content flex-1 p-6 overflow-auto bg-gray-100">
                    <div className="header text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                    </div>
                    {/* Conditional rendering based on state */}
                    {dashboardVisible && <AdminDashboard />}
                    {incidentCategoryVisible && <IncidentCategory />}
                    {fTableVisible && isAdmin ? <Admin /> : fTableVisible && <FTable />}
                    {rTableVisible && <ResolutionTable />}
                    {userTableVisible && <UserList />}
                </div>
            </div>
        </div>
    );
};

export default AdminMain;
