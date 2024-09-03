import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Incident/Admin.css'; // Ensure this CSS file is created for styling
import IncidentCategoryedit from './IncidentCategoryedit';
import * as API from "../Endpoint/Endpoint";

const IncidentCategory = () => {
    const [data, setData] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
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

    const loadTags = async () => {
        try {
            const response = await axios.get(API.GET_TAGS);
            console.log("Fetched tags:", response.data); // Debugging line
            setTags(response.data.map(tagObj => tagObj.tagss)); // Ensure `tagss` is correct
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    useEffect(() => {
        loadData();
        loadTags();
    }, []);

    const deleteObject = async (incidentcategoryid) => {
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
            const matchesTag = selectedTag ? Array.isArray(item.tags) && item.tags.includes(selectedTag) : true;
            const matchesSearch = searchQuery ? item.incidentname.toLowerCase().includes(searchQuery.toLowerCase()) || item.incidentdescription.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            return matchesTag && matchesSearch;
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
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="search-input"
                />
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
                                <th>Incident Category</th>
                                <th>Incident Name</th>
                                <th>Incident Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(([category, incidents], index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={incidents.length}>{category}</td>
                                        <td>{incidents[0].incidentname}</td>
                                        <td>{incidents[0].incidentdescription}</td>
                                        <td>
                                            <button className="btn btn-edit" onClick={() => handleEditUserClick(incidents[0])}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => deleteObject(incidents[0].incidentcategoryid)}>Delete</button>
                                        </td>
                                    </tr>
                                    {incidents.slice(1).map((incident, subIndex) => (
                                        <tr key={subIndex}>
                                            <td>{incident.incidentname}</td>
                                            <td>{incident.incidentdescription}</td>
                                            <td>
                                                <button className="btn btn-edit" onClick={() => handleEditUserClick(incident)}>Edit</button>
                                                <button className="btn btn-delete" onClick={() => deleteObject(incident.incidentcategoryid)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
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
