import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResolutionTable.css'; // Make sure to style the table appropriately
import ResolutionAddEdit from './ResolutionAddEdit'; // Adjust the path if necessary

const ResolutionTableu = ({ userId }) => {
  const [resolutions, setResolutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [resolutionVisible, setResolutionVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadResolutions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/incident-api/user-resolutions/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include authorization token
        },
      });
      setResolutions(response.data);
    } catch (error) {
      console.error("Error fetching resolution data:", error);
    }
  };

  useEffect(() => {
    loadResolutions();
  }, []);

  const deleteResolution = async (resolutionid) => {
    if (window.confirm("Are you sure you want to delete this resolution?")) {
      try {
        await axios.delete(`http://localhost:5000/incident-api/resolutiondelete/${resolutionid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include authorization token
          },
        });
        console.log('Success: Resolution deleted successfully');
        loadResolutions(); 
      } catch (error) {
        console.error("Error deleting resolution:", error);
      }
    }
  };

  const handleEditResolutionClick = (item) => {
    setEditItem(item);
    setResolutionVisible(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setResolutionVisible(false);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resolutions.slice(indexOfFirstItem, indexOfLastItem);

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
      {resolutionVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={closeModal}>&times;</span>
            <ResolutionAddEdit onClose={closeModal} editItem={editItem} loadResolutions={loadResolutions} />
          </div>
        </div>
      )}

      <table className="styled-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Resolution ID</th>
            <th>Incident ID</th>
            <th>Incident Name</th>
            <th>Incident Owner</th>
            <th>Resolution Date</th>
            <th>Resolution Remark</th>
            <th>Resolved By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.resolutionid}>
              <td>{item.resolutionid}</td>
              <td>{item.incidentid}</td>
              <td>{item.incidentname}</td>
              <td>{item.incidentowner}</td>
              <td>{item.resolutiondate}</td>
              <td>{item.resolutionremark}</td>
              <td>{item.resolvedby}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEditResolutionClick(item)}>Edit</button>
                <button className="btn btn-delete" onClick={() => deleteResolution(item.resolutionid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <center>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(resolutions.length / itemsPerPage) },
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

export default ResolutionTableu;
