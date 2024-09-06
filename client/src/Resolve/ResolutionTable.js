import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResolutionTable.css';
import ResolutionAddEdit from './ResolutionAddEdit';
import * as API from "../Endpoint/Endpoint";

const ResolutionTable = () => {
  const [resolutionsByUser, setResolutionsByUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_ADMIN_RESOLUTION);
      const resolutions = response.data;

      // Group resolutions by user email
      const groupedResolutions = resolutions.reduce((acc, resolution) => {
        if (!acc[resolution.user]) {
          acc[resolution.user] = [];
        }
        acc[resolution.user].push(resolution);
        return acc;
      }, {});

      setResolutionsByUser(Object.entries(groupedResolutions).map(([user, resolutions]) => ({
        user,
        resolutions,
      })));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resolutions:', err);
      setError('Failed to fetch resolutions.');
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resolutionsByUser.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (item) => {
    setEditItem(item);
    setModalVisible(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setModalVisible(false);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    loadData(); // Refresh data when modal is closed
  };

  const deleteObject = async (resolutionid) => {
    if (window.confirm("Are you sure you want to delete this resolution?")) {
      try {
        await axios.delete(API.DELETE_RESOLUTION(resolutionid), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Success: Resolution deleted successfully');
        loadData(); // Refresh data after deletion
      } catch (error) {
        console.error("Error deleting resolution:", error);
        setError('Failed to delete resolution.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ marginTop: '30px', position: 'relative' }}>
      <button className="btn btn-contact" onClick={() => setModalVisible(true)}>Add Resolution</button>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <ResolutionAddEdit onClose={closeModal} editItem={editItem} loadData={loadData} />
          </div>
        </div>
      )}

      {resolutionsByUser.length === 0 ? (
        <p>No resolutions found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Sr No</th> {/* Added serial number column */}
              <th>User</th>
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
            {resolutionsByUser.flatMap((userGroup, userIndex) =>
              userGroup.resolutions.map((resolution, index) => (
                <tr key={`${userIndex}-${index}`}>
                  <td>{(currentPage - 1) * itemsPerPage + userIndex * itemsPerPage + index + 1}</td> {/* Serial number */}
                  {index === 0 && (
                    <td rowSpan={userGroup.resolutions.length}><b>{userGroup.user}</b></td>
                  )}
                  <td>{resolution.resolutionid}</td>
                  <td>{resolution.incidentid}</td>
                  <td>{resolution.incidentname}</td>
                  <td>{resolution.incidentowner}</td>
                  <td>{resolution.resolutiondate}</td>
                  <td>{resolution.resolutionremark}</td>
                  <td>{resolution.resolvedby}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEditClick(resolution)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => deleteObject(resolution.resolutionid)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <center>
        <div className="pagination">
          {Array.from({ length: Math.ceil(resolutionsByUser.length / itemsPerPage) }, (_, i) => (
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
  );
};

export default ResolutionTable;
