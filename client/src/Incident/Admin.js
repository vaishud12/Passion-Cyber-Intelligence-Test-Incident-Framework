import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Ensure this CSS file is created for styling
import FAddEdit from './FAddEdit';

const Admin = () => {
    const [incidentsByUser, setIncidentsByUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/incidentget');
                const incidents = response.data;

                // Group incidents by user email
                const groupedIncidents = incidents.reduce((acc, incident) => {
                    if (!acc[incident.email]) {
                        acc[incident.email] = [];
                    }
                    acc[incident.email].push(incident);
                    return acc;
                }, {});

                setIncidentsByUser(Object.entries(groupedIncidents).map(([email, incidents]) => ({
                    email,
                    incidents,
                })));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching incidents:', err);
                setError('Failed to fetch incidents.');
                setLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = incidentsByUser.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEditUserClick = (item) => {
        setEditItem(item);
        openModal();
    };

    const openModal = () => {
        setChatbotVisible(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling on the body
    };

    const closeModal = () => {
        setChatbotVisible(false);
        document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
   
    return (
        <>
            <div className="admin-container">
                <button 
                    className="btn btn-add" 
                    style={{
                        backgroundColor: '#3385ffdf',  // Blue background
                        color: 'white',              // White text
                        padding: '8px 17px',        // Padding for spacing
                        fontSize: '14px',            // Font size
                        border: 'none',              // No border
                        borderRadius: '5px',         // Rounded corners
                        cursor: 'pointer',           // Pointer cursor on hover
                        transition: 'background-color 0.3s',  // Smooth background-color transition
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Light shadow for depth
                    }} 
                    onClick={openModal}
                >
                    Add Incident
                </button>

                {chatbotVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <FAddEdit onClose={closeModal} editItem={editItem} loadData={() => {}} />
                        </div>
                    </div>
                )}

                {incidentsByUser.length === 0 ? (
                    <p>No incidents found.</p>
                ) : (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>User Email</th>
                                <th>Incident Name</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>GPS</th>
                                <th>Current Address</th>
                                <th>Incident Owner</th>
                                <th>Raised To User</th>
                                <th>Status</th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user, index) => (
                                user.incidents.map((incident, i) => (
                                    <tr key={`${index}-${i}`}>
                                        {i === 0 && (
                                            <td rowSpan={user.incidents.length}><b>{user.email}</b></td>
                                        )}
                                        <td>{incident.incidentname}</td>
                                        <td>{incident.incidentcategory}</td>
                                        <td>{incident.description}</td>
                                        <td>{incident.date}</td>
                                        <td>{incident.gps}</td>
                                        <td>{incident.currentaddress}</td>
                                        <td>{incident.incidentowner}</td>
                                        <td>{incident.raisedtouser}</td>
                                        <td>{incident.status}</td>

                                        <td>
                                            <button className="btn btn-edit" onClick={() => handleEditUserClick(incident)}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => console.log(`Delete ${incident.incidentid}`)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                )}
                <center>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(incidentsByUser.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </center>
            </div>
        </>
    );
};

export default Admin;
