import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FTable.css';
import FAddEdit from './FAddEdit';
import UFview from './UFview';
import FView from './FView';
import ResolutionAddEdit from '../Resolve/ResolutionAddEdit';
import * as API from "../Endpoint/Endpoint";

const FTable = ({ userId }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [resolutionVisible, setResolutionVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [resolutionItem, setResolutionItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  
    
    const [fViewVisible, setFViewVisible] = useState(false);
    const openFViewModal = (item) => {
        setSelectedIncident(item);
        setFViewVisible(true);
    };

    const closeFViewModal = () => {
        setFViewVisible(false);
    };
    // Update the size state on window resize
    const isSmallScreen = window.innerWidth <= 768;
    const isVerySmallScreen = window.innerWidth <= 480;
  // Fetch incidents data
  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_USER_INCIDENTS(userId), {
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
  // const loadTags = async () => {
  //   try {
  //     const response = await axios.get(API.GET_TAGS, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     setTags(response.data.map(tagObj => tagObj.tag));
  //   } catch (error) {
  //     console.error("Error fetching tags:", error);
  //   }
  // };

  useEffect(() => {
    loadData();
   
  }, []);

  // Filter data based on search query and selected tag
  const filterData = useCallback(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = data.filter((item) =>
      (selectedTag === '' || item.tags.includes(selectedTag)) &&
      (
        // Search across all columns explicitly
        (item.incidentName && item.incidentName.toLowerCase().includes(lowercasedQuery)) ||
        (item.sector && item.sector.toLowerCase().includes(lowercasedQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowercasedQuery)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))) || // tags is an array
        (item.priority && item.priority.toLowerCase().includes(lowercasedQuery)) ||
        (item.status && item.status.toLowerCase().includes(lowercasedQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowercasedQuery)) ||
        (item.date && String(item.date).toLowerCase().includes(lowercasedQuery)) || // Handle date as string
        (item.gps && String(item.gps).toLowerCase().includes(lowercasedQuery)) ||
        (item.raisedtouser && item.raisedtouser.toLowerCase().includes(lowercasedQuery))
      )
    );
    setFilteredData(filtered);
  }, [searchQuery, selectedTag, data]);
  

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
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterData();
    // You can call filterData here as well if you want immediate filtering without useEffect.
    // filterData();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Styles for the modal overlay and modal content
  const modalOverlayStyle = {
    position: 'absolute',
    top: -3,
    left: 0,
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle = {
    // position: 'relative',
  width: isVerySmallScreen ? '90%' : isSmallScreen ? '90%' : '95%',
  height: isVerySmallScreen ? '1%' : isSmallScreen ? '16%' : '50%',
  maxHeight: isVerySmallScreen ? '0.001%' : isSmallScreen ? '5%' : '10%',
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1001,
  overflowY: 'hidden', // Ensures content doesn't overflow the modal height
  };


/* Example CSS for responsiveness */


  const ufViewModalOverlayStyle = {
    position: 'absolute',
    top: -3,
    left: 0,
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const ufViewModalContentStyle = {
    position: 'relative',
    width: '80%',
    height: '50%', // Enforced specific height
    maxHeight: '10%', // Still keeping maxHeight smaller
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1001,
    overflowY: 'auto', // Ensures content doesn't overflow the modal height
  };
  
  return (
    <div style={{ marginTop: '30px', position: 'relative' }}>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange} // Updates searchQuery when user types
        placeholder="Search incidents..."
        className="search-input"
      />
      
      

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

{fViewVisible && selectedIncident && (
  <div style={ufViewModalOverlayStyle}>
    <div style={ufViewModalContentStyle}>
      <span
        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
        onClick={closeFViewModal}
      >
        &times;
      </span>
      <UFview
        isOpen={fViewVisible}
        closeModal={closeFViewModal}
        incident={selectedIncident}
      />
    </div>
  </div>
)}

        <div className="table-wrapper">
      <table className="styled-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>IncidentID</th>
            <th>Incident Category</th>
            <th>Incident Name</th>
            <th>Incident Owner</th>
            <th>Incident Description</th>
            <th>Date</th>
            <th>Current Address</th>
            <th>GPS</th>
            <th>Raised to User</th>
            
            <th>Tags</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Remark</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.incidentid}>
               <td>{index + 1}</td>
              <td>{item.incidentid}</td>
              <td>{item.incidentcategory}</td>
              <td>{item.incidentname}</td>
              <td><b>{item.incidentowner}</b></td>
              <td>{item.incidentdescription}</td>
              <td>{item.date}</td>
              <td>{item.currentaddress}</td>
              <td>{item.gps}</td>
              <td><b>{item.raisedtouser}</b></td>
              <td><b>{item.tagss}</b></td>
              <td><b>{item.priority}</b></td>
              <td><b>{item.status}</b></td>
              <td>{item.remark || 'N/A'}</td>
                <td>
                {item.photo ? (
                                <img
                                    src={API.GET_IMAGE_URL(item.photo)} // Update this based on your image path
                                    alt={item.incidentname}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            ) : (
                                <p>No Image</p>
                            )}
                           
            </td>
              
              <td>
              <button
                    className="btn btn-edit"
                    onClick={() => openFViewModal(item)}
                  >
                    View
                  </button>
               
                <button className="btn btn-edit" onClick={() => handleEditUserClick(item)}>Edit</button>
                <button className="btn btn-edit" onClick={() => handleResolveClick(item)}>Resolve</button>
                <button className="btn btn-delete" onClick={() => deleteObject(item.incidentid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

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