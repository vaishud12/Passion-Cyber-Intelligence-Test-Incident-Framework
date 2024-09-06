import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Incident/FTable.css'; // Importing FTable styles
import * as API from "../Endpoint/Endpoint";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API.GET_USERS, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteObject = async (id) => {
        if (!id) return; // Safety check

        if (window.confirm("Are you sure you want to delete this User?")) {
            try {
                const response = await axios.delete(API.DELETE_USERID(id));
                if (response.status === 200) {
                    setSuccessMessage('User deleted successfully');
                    setData(prevData => prevData.filter(item => item.id !== id));
                }
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting object:", error);
            }
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-list-container">
        <h2 className="user-list-title">All Users</h2>
        <table className="styled-table">
            <thead>
                <tr>
                    <th>S.No</th> {/* Serial number header */}
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-delete" onClick={() => deleteObject(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No users found</td> {/* Adjust colspan to match the number of columns */}
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    
    );
};

export default UserList;
