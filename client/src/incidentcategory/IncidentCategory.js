import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Incident/Admin.css'; // Ensure this CSS file is created for styling
import IncidentCategoryedit from './IncidentCategoryedit';
import * as API from "../Endpoint/Endpoint";

const IncidentCategory = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const itemsPerPage = 5;
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [isAdding, setIsAdding] = useState(true); // Track if we are adding or editing

    const loadData = async () => {
        try {
            const response = await axios.get(API.GET_INCIDENT_CATEGORY);
            console.log("Fetched data:", response.data); // Debugging line
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching data");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const deleteObject = async (incidentcategoryid) => {
        if (!incidentcategoryid) return; // Safety check

        if (window.confirm("Are you sure you want to delete this object?")) {
            try {
                const response = await axios.delete(API.DELETE_INCIDENT_CATEGORY(incidentcategoryid));
                if (response.status === 200) {
                    setSuccessMessage('Incident category deleted successfully');
                    setData(prevData => prevData.filter(item => item.incidentcategoryid !== incidentcategoryid));
                }
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting object:", error);
            }
        }
    };

    const groupByCategory = (data) => {
        return data.reduce((acc, item) => {
            if (!acc[item.incidentcategory]) {
                acc[item.incidentcategory] = [];
            }
            acc[item.incidentcategory].push(item);
            return acc;
        }, {});
    };

    const filterData = (data) => {
        return data.filter(item => {
            const matchesSearch = searchQuery ? 
                (item.incidentname && item.incidentname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.incidentdescription && item.incidentdescription.toLowerCase().includes(searchQuery.toLowerCase())) 
                : true;
            return matchesSearch;
        });
    };

    const filteredData = filterData(data);
    const groupedData = groupByCategory(filteredData);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Object.entries(groupedData).slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEditUserClick = (item) => {
        setEditItem(item);
        setIsAdding(false); // Set to false to indicate editing
        openModal();
    };

    const handleAddClick = () => {
        setEditItem(null);
        setIsAdding(true); // Set to true to indicate adding
        openModal();
    };

    const openModal = () => {
        setChatbotVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setChatbotVisible(false);
        document.body.style.overflow = 'auto';
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="admin-container">
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
                <button 
                    className="btn btn-add" 
                    style={{
                        backgroundColor: '#3385ffdf',
                        color: 'white',
                        padding: '8px 17px',
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                    onClick={handleAddClick}
                >
                    Add Incident Category
                </button>

                {chatbotVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <IncidentCategoryedit 
                                onClose={closeModal} 
                                editItem={editItem} 
                                isAdding={isAdding} 
                                loadData={loadData} 
                            />
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                {data.length === 0 ? (
                    <p>No incidents found.</p>
                ) : (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Sr No</th> {/* Added serial number column */}
                                <th>Incident Category</th>
                                <th>Incident Name</th>
                                <th>Incident Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.flatMap(([category, incidents], index) => 
                                incidents.map((incident, subIndex) => (
                                    <tr key={`${category}-${subIndex}`}>
                                        <td>{(currentPage - 1) * itemsPerPage + index * itemsPerPage + subIndex + 1}</td> {/* Serial number */}
                                        {subIndex === 0 && (
                                            <td rowSpan={incidents.length}>{category}</td>
                                        )}
                                        <td>{incident.incidentname}</td>
                                        <td>{incident.incidentdescription}</td>
                                        <td>
                                            <button className="btn btn-edit" onClick={() => handleEditUserClick(incident)}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => deleteObject(incident.incidentcategoryid)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <center>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(Object.keys(groupedData).length / itemsPerPage) }, (_, i) => (
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

export default IncidentCategory;
