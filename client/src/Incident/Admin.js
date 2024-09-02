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
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
   
    const [priorityTimes, setPriorityTimes] = useState({
        critical: '',
        veryhigh: '',
        high: '',
        medium: '',
        low: ''
    });

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/incident-api/incidentget');
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

    // Filter incidents based on search query
    const filterIncidents = (incidents) => {
        return incidents.filter(user => 
            user.incidents.some(incident =>
                (incident.incidentname && incident.incidentname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (incident.description && incident.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        );
    };

    const handlePriorityTimesSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/incident-api/set-priority-times', priorityTimes);
            alert('Priority times updated successfully.');
        } catch (err) {
            console.error('Error updating priority times:', err);
            alert('Failed to update priority times.');
        }
    };

    const handlePriorityTimeChange = (e) => {
        const { name, value } = e.target;
        setPriorityTimes(prevTimes => ({
            ...prevTimes,
            [name]: value
        }));
    };

    const filteredIncidents = filterIncidents(incidentsByUser);
    const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);

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
                <div 
    style={{
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        padding: '10px',
        height: '50vh', // Full viewport height for vertical centering
    }}
>
    <form onSubmit={handlePriorityTimesSubmit} style={{ width: '100%', maxWidth: '1000px' }}>
    <h3 style={{
            textAlign: 'center', // Center the heading text
            fontWeight: 'bold', // Make the heading bold
            marginBottom: '20px' // Space below the heading
        }}>
            Set Priority Times
        </h3>
        
        <div 
            style={{
                display: 'flex',
                flexWrap: 'wrap', // Allows wrapping of items if they overflow
                gap: '15px', // Space between the input fields
                justifyContent: 'center', // Center horizontally
                marginBottom: '20px' // Space below the priority inputs
            }}
        >
            {Object.keys(priorityTimes).map(priority => (
                <div key={priority} style={{ flex: '1 1 auto' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Poppins',
                        marginBottom: '8px'
                    }}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}:
                        <input
                            type="text"
                            name={priority}
                            value={priorityTimes[priority]}
                            onChange={handlePriorityTimeChange}
                            placeholder="Time in hours"
                            min="0"
                            style={{
                                width: '100%', // Full width of the container
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                marginBottom: '12px'
                            }}
                        />
                    </label>
                </div>
            ))}
        </div>

        <button
            type="submit"
            style={{
                textAlign:'cenetr',
                padding: '10px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '80%', // Full width of the container
                maxWidth: '150px', // Limit button width
                marginTop: '20px' // Space above the button
            }}
        >
            Save Priority Times
        </button>
    </form>

   
</div>



<input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search..."
    style={{
        width: '100%',  // Full width of the container
        padding: '8px',
        fontSize: '14px',
        border: '1px solid #ccc', // Light border
        borderRadius: '4px', // Rounded corners
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
        marginBottom: '12px', // Space below the input field
        fontFamily: 'Poppins'
    }}
/>

                {chatbotVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <FAddEdit onClose={closeModal} editItem={editItem} loadData={() => {}}  />
                            
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
                                        <td>{incident.incidentname || 'N/A'}</td>
                                        <td>{incident.incidentcategory || 'N/A'}</td>
                                        <td>{incident.incidentdescription|| 'N/A'}</td>
                                        <td>{incident.date || 'N/A'}</td>
                                        <td>{incident.gps || 'N/A'}</td>
                                        <td>{incident.currentaddress || 'N/A'}</td>
                                        <td>{incident.incidentowner || 'N/A'}</td>
                                        <td>{incident.raisedtouser || 'N/A'}</td>
                                        <td>{incident.status || 'N/A'}</td>
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
                        {Array.from({ length: Math.ceil(filteredIncidents.length / itemsPerPage) }, (_, i) => (
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
