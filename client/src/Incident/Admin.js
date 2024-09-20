import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Ensure this CSS file is created for styling
import FAddEdit from './FAddEdit';

import * as API from "../Endpoint/Endpoint";
import FView from './FView';
const Admin = () => {
   
    const [incidentsByUser, setIncidentsByUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [selectedTag, setSelectedTag] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    
    const [fViewVisible, setFViewVisible] = useState(false);
    const openFViewModal = (incident) => {
        setSelectedIncident(incident);
        setFViewVisible(true);
    };

    const closeFViewModal = () => {
        setFViewVisible(false);
    };
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
   
    const [priorityTimes, setPriorityTimes] = useState({
        critical: '',
        veryhigh: '',
        high: '',
        medium: '',
        low: ''
    });
    
   
  // Function to handle viewing an incident in the modal
  
    
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get(API.GET_INCIDENT);
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

    const loadData = async () => {
        try {
            const response = await axios.get(API.GET_INCIDENT);
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
    const loadTags = async () => {
        try {
            const response = await axios.get(API.GET_TAGS);
            console.log("Fetched tags:", response.data); // Debugging line
            setTags(response.data.map(tagObj => tagObj.tagss)); // Ensure `tagss` is correct
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    
    // Fetch data on component mount
    useEffect(() => {
        loadData();
        loadTags();
    }, []);
    
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter incidents based on search query
   
    const filterIncidents = (incidentsByUser) => {
        return incidentsByUser.filter(user => {
            return user.incidents.some(incident => {
                // Ensure incident is defined before accessing its properties
                return (
                    (incident.incidentname && incident.incidentname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.description && incident.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (Array.isArray(incident.tagss) && incident.tagss.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
                );
            }) && 
            (selectedTag === '' || (Array.isArray(user.incidents) && user.incidents.some(incident =>
                Array.isArray(incident.tagss) && incident.tagss.includes(selectedTag)
            )));
        });
    };
    
    const handlePriorityTimesSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API.SET_PRIORITY_TIMES, priorityTimes);
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

    const deleteObject = async (incidentid) => {
        if (window.confirm("Are you sure you want to delete this object?")) {
          try {
            await axios.delete(API.DELETE_INCIDENT(incidentid), {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log('Success: Object deleted successfully');
            loadData(); 
          } catch (error) {
            console.error("Error deleting object:", error);
          }
        }
      };
      
      
    //   const imageUrl = `http://localhost:5014/uploads/${incident.photo}`; // Adjust the URL based on your server configuration

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
                <div className="priority-container">
                    <form onSubmit={handlePriorityTimesSubmit} className="priority-form">
                        <h3 className="priority-heading">Set Priority Times</h3>
                        <div className="priority-inputs">
                            {Object.keys(priorityTimes).map(priority => (
                                <div key={priority} className="priority-input-wrapper">
                                    <label className="priority-label">
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}:
                                        <input
                                            type="text"
                                            name={priority}
                                            value={priorityTimes[priority]}
                                            onChange={handlePriorityTimeChange}
                                            placeholder="Time in hours"
                                            min="0"
                                            className="priority-input"
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="priority-button">Save Priority Times</button>
                    </form>
                </div>

<div style={{
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    marginBottom: '12px' // Space below the input field
}}>
    <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        style={{
            width: '300px',  // Fixed width for smaller size
            maxWidth: '100%', // Responsive width
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc', // Light border
            borderRadius: '4px', // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
            fontFamily: 'Poppins'
        }}
    />
</div>

<select 
                    value={selectedTag} 
                    onChange={(e) => setSelectedTag(e.target.value)} 
                    className="tag-select"
                >
                    <option value="">All Tags</option>
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <option key={index} value={tag}>{tag}</option>
                        ))
                    ) : (
                        <option value="">Loading Tags...</option>
                    )}
                </select>

              



                {chatbotVisible && (
                    < div className="modal-overlay">
                        
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <FAddEdit onClose={closeModal} editItem={editItem} loadData={loadData} />
                            
                        
                    </div>
                )}

                {incidentsByUser.length === 0 ? (
                    <p>No incidents found.</p>
                ) : (
                    
                    <div div className="table-wrapperrr">
                    <table className="styled-table">
                        <thead>
                            <tr>
                            <th>S.No</th>
                                <th>User Email</th>
                                <th>Incident id</th>
                                <th>Sector</th>
                                <th>Category</th>
                                <th>Incident Name</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>GPS</th>
                                <th>Current Address</th>
                                <th>Incident Owner</th>
                                <th>Raised To User</th>
                                <th>Tags</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Remark</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((user, userIndex) => (
        user.incidents.map((incident, incidentIndex) => (
            <tr key={`${userIndex}-${incidentIndex}`}>
                <td>{(currentPage - 1) * itemsPerPage + incidentIndex + 1}</td> {/* Serial number */}
                {incidentIndex === 0 && (
                    <td rowSpan={user.incidents.length}><b>{user.email}</b></td>
                )}
                <td>{incident.incidentid || 'N/A'}</td>
                <td>{incident.sector || 'N/A'}</td>
                <td>{incident.incidentcategory || 'N/A'}</td>
                <td>{incident.incidentname || 'N/A'}</td>
                <td>{incident.description || 'N/A'}</td>
                <td>{incident.date || 'N/A'}</td>
                <td>{incident.gps || 'N/A'}</td>
                <td>{incident.currentaddress || 'N/A'}</td>
                <td>{incident.incidentowner || 'N/A'}</td>
                <td>{incident.raisedtouser || 'N/A'}</td>
                <td>{incident.tagss || 'N/A'}</td>
                <td>{incident.priority || 'N/A'}</td>
                <td>{incident.status || 'N/A'}</td>
                <td>{incident.remark || 'N/A'}</td>
                <td>
                {incident.photo ? (
                                <img
                                    src={API.GET_IMAGE_URL(incident.photo)} // Update this based on your image path
                                    alt={incident.incidentname}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            ) : (
                                <p>No Image</p>
                            )}
                           
            </td>
                      
                <td>
                
                <button 
                                                onClick={() => openFViewModal(incident)}
                                                className="btn btn-view"
                                            >
                                                View
                                            </button>
                {fViewVisible && selectedIncident && (
    <div className="backdrop">
        <div className="modal-body">
            <FView 
                isOpen={fViewVisible} 
                closeModal={closeFViewModal} 
                incident={selectedIncident} 
            />
        </div>
    </div>
)}
     
                    <button className="btn btn-edit" onClick={() => handleEditUserClick(incident)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => deleteObject(incident.incidentid)}>Delete</button>
                </td>
            </tr>
        ))
    ))}
                        </tbody>
                    </table>
                    </div>
                )}
                <center>
  <div className="pagination">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &#x2039; {/* Left arrow */}
    </button>

    {Array.from(
      { length: Math.ceil(filteredData.length / itemsPerPage) },
      (_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={currentPage === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      )
    )}

    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={
        currentPage === Math.ceil(filteredData.length / itemsPerPage)
      }
    >
      &#x203A; {/* Right arrow */}
    </button>
  </div>
</center>


            </div>
            
           
        </>
    );
};

export default Admin;
