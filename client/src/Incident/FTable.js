import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FTable.css';
import FAddEdit from './FAddEdit';
import ResolutionAddEdit from '../Resolve/ResolutionAddEdit';

const FTable = ({ userId }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [resolutionVisible, setResolutionVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [resolutionItem, setResolutionItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Fetch incidents data
  const loadData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/incident-api/user-incidents/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch tags data
  const loadTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/incident-api/tags', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTags(response.data.map(tagObj => tagObj.tag));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    loadData();
    loadTags();
  }, []);

  // Filter data based on search query and selected tag
  const filterData = useCallback(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = data.filter((item) =>
      (selectedTag === '' || item.tags.includes(selectedTag)) &&
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredData(filtered);
  }, [searchQuery, selectedTag, data]);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedTag, filterData]);

  const deleteObject = async (incidentid) => {
    if (window.confirm("Are you sure you want to delete this object?")) {
      try {
        await axios.delete(`http://localhost:5000/incident-api/incidentdelete/${incidentid}`, {
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

  const handleAddIncidentClick = () => {
    setEditItem(null);  // Clear any previous edit item
    setChatbotVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEditUserClick = (item) => {
    setEditItem(item);
    setChatbotVisible(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const handleResolveClick = (item) => {
    setResolutionItem(item);
    setResolutionVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setChatbotVisible(false);
    setResolutionVisible(false);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Styles for the modal overlay and modal content
  const modalOverlayStyle = {
    position: 'absolute',
    top: -5,
    left: 0,
    width: '80%',
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    position: 'relative',
    width: '80%',
    maxHeight: '50vh',
    maxWidth: '400px',
    backgroundColor: '#fff',
    overflowY: 'auto',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1001,
  };

  return (
    <div style={{ marginTop: '30px', position: 'relative' }}>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search incidents..."
        className="search-input"
      />

      <select 
        value={selectedTag} 
        onChange={(e) => setSelectedTag(e.target.value)} 
        className="tag-select"
      >
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      <button
        className="btn btn-contact"
        onClick={handleAddIncidentClick}
      >
        Add Incident
      </button>

      {chatbotVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={closeModal}>&times;</span>
            <FAddEdit onClose={closeModal} editItem={editItem} loadData={loadData} />
          </div>
        </div>
      )}

      {resolutionVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={closeModal}>&times;</span>
            <ResolutionAddEdit onClose={closeModal} editItem={resolutionItem} loadData={loadData} />
          </div>
        </div>
      )}

      <table className="styled-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>IncidentID</th>
            <th>Incident Category</th>
            <th>Incident Name</th>
            <th>Incident Owner</th>
            <th>Incident Description</th>
            <th>Date</th>
            <th>Current Address</th>
            <th>GPS</th>
            <th>Raised to User</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.incidentid}>
              <td>{item.incidentid}</td>
              <td>{item.incidentcategory}</td>
              <td>{item.incidentname}</td>
              <td><b>{item.incidentowner}</b></td>
              <td>{item.incidentdescription}</td>
              <td>{item.date}</td>
              <td>{item.currentaddress}</td>
              <td>{item.gps}</td>
              <td><b>{item.raisedtouser}</b></td>
              <td><b>{item.status}</b></td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEditUserClick(item)}>Edit</button>
                <button className="btn btn-edit" onClick={() => handleResolveClick(item)}>Resolve</button>
                <button className="btn btn-delete" onClick={() => deleteObject(item.incidentid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <center>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredData.length / itemsPerPage) },
            (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            )
          )}
        </div>
      </center>
    </div>
  );
};

export default FTable;
