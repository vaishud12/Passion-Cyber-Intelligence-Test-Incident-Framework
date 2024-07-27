import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResolutionTable.css';
import ResolutionAddEdit from './ResolutionAddEdit';


const ResolutionTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resolutionget");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteObject = async (resolutionid) => {
    if (window.confirm("Are you sure you want to delete this object?")) {
      try {
        await axios.delete(`http://localhost:5000/api/resolutiondelete/${resolutionid}`);
        console.log('Success: Object deleted successfully');
        loadData(); 
      } catch (error) {
        console.error("Error deleting object:", error);
      }
    }
  };

  const handleEditUserClick = (item) => {
    setEditItem(item);
    setChatbotVisible(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setChatbotVisible(false);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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
      <button className="btn btn-contact" onClick={() => setChatbotVisible(true)}>Add Resolution</button>

      {chatbotVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={closeModal}>&times;</span>
            <ResolutionAddEdit onClose={closeModal} editItem={editItem} loadData={loadData} />
          </div>
        </div>
      )}

      <table className="styled-table" style={{ width: '100%' }}>
        <thead>
          <tr>

            <th>ResolutionID</th>
            <th>Incident ID</th>
            <th>Incident Name</th>
            <th>Incident Owner</th>
            <th>Resolution Date</th>
            <th>Resolution Remark</th>
            <th>Resolved by</th>
            
            
            
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{item.resolutionid}</th>
              <th>{item.incidentid}</th>
              <th>{item.incidentname}</th>
              <th>{item.incidentowner}</th>
              <td>{item.resolutiondate}</td>
              <td>{item.resolutionremark}</td>
              <td>{item.resolvedby}</td>
             
              <td>
                {/* <button className="btn btn-edit" onClick={() => handleEditUserClick(item)}>Resolution</button> */}
                <button className="btn btn-delete" onClick={(e) => {
                  e.preventDefault();
                  deleteObject(item.resolutionid);
                }}>Delete</button>
                {/* <Link to={`view/${item.incidentid}`}>
                  <button className="btn btn-view">View</button>
                </Link> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <center>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(data.length / itemsPerPage) },
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

export default ResolutionTable;
