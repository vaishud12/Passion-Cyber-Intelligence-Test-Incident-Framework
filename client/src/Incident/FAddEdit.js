import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FAddEdit.css';
import IncidentCategory from '../incidentcategory/IncidentCategory';

const initialState = {
    incidentcategory: '',
    incidentname: '',
    incidentowner: '',
    description: '',
    date: '',
    currentaddress: '',
    gps: '',
    raisedtouser: '',
    status: ''
};

const FAddEdit = ({ visible, onClose, editItem, loadData }) => {
    const [state, setState] = useState(initialState);
    const [emailSent, setEmailSent] = useState(false);
    const [incidentCategories, setIncidentCategories] = useState([]);
    const [incidentNames, setIncidentNames] = useState([]);
    const [incidentDescriptions, setIncidentDescriptions] = useState([]);
    const { incidentcategory, incidentname, incidentowner, description, date, currentaddress, gps, raisedtouser, status } = state;
    const { incidentid } = useParams();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (editItem) {
            setState(editItem);
        } else if (incidentid) {
            axios.get(`http://localhost:5000/api/incidentget/${incidentid}`)
                .then(resp => {
                    console.log("Response:", resp.data);
                    setState(resp.data[0]);
                })
                .catch(error => console.error(error));
        }
    }, [editItem, incidentid]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/incidentcategoryget')
            .then(resp => {
                setIncidentCategories(resp.data);
            })
            .catch(error => {
                console.error("Error fetching incident categories:", error);
            });

        axios.get('http://localhost:5000/api/incidentnameget')
            .then(resp => {
                setIncidentNames(resp.data);
            })
            .catch(error => {
                console.error("Error fetching incident names:", error);
            });

        axios.get('http://localhost:5000/api/incidentdescriptionget')
            .then(resp => {
                setIncidentDescriptions(resp.data);
            })
            .catch(error => {
                console.error("Error fetching incident descriptions:", error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!incidentcategory || !incidentname || !incidentowner || !description || !date || !currentaddress || !gps || !raisedtouser) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                const updatedData = { ...state, userid: userId };
                if (!incidentid) {
                    await axios.post("http://localhost:5000/api/incidentpost", updatedData);
                } else {
                    await axios.put(`http://localhost:5000/api/incidentupdate/${incidentid}`, updatedData);
                }
                setState(initialState);
                toast.success(`${incidentid ? 'Incident updated' : 'Incident added'} successfully`);

                const emailPayload = {
                    email1: raisedtouser,
                    from: incidentowner,
                    incidentcategory,
                    incidentname,
                    incidentowner,
                    description,
                    date,
                    currentaddress,
                    gps,
                };
                await axios.post("http://localhost:5000/api/send-emailfour/ids", emailPayload);
                toast.success('Email sent successfully');
                setEmailSent(true);

                const message = `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nDescription: ${description}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}\nStatus: ${status}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                loadData(); // Reload the data after adding or updating an incident
            } catch (error) {
                toast.error(error.response.data.error);
            }
        }
    };

    const handleGoBack = () => {
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className={`modal ${visible ? 'show' : 'hide'}`} style={{ marginTop: "20px" }}>
            <div className="modal-content">
                <center><h1>{incidentid ? 'Edit Incident' : 'Add Incident'}</h1></center>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="incidentcategory">Incident Category</label>
                    <select
                        id="incidentcategory"
                        name="incidentcategory"
                        value={incidentcategory || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Incident Category</option>
                        {IncidentCategory.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>

                    <label htmlFor="incidentname">Incident Name</label>
                    <select
                        id="incidentname"
                        name="incidentname"
                        value={incidentname || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Incident Name</option>
                        {incidentNames.map(name => (
                            <option key={name.id} value={name.name}>{name.name}</option>
                        ))}
                    </select>

                    <label htmlFor="incidentowner">Incident Owner</label>
                    <input
                        type="text"
                        id="incidentowner"
                        name="incidentowner"
                        value={incidentowner || ""}
                        placeholder="Enter Incident Owner"
                        onChange={handleInputChange}
                    />

                    <label htmlFor="description">Description</label>
                    <select
                        id="description"
                        name="description"
                        value={description || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Description</option>
                        {incidentDescriptions.map(desc => (
                            <option key={desc.id} value={desc.name}>{desc.name}</option>
                        ))}
                    </select>

                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date || ""}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="currentaddress">Current Address</label>
                    <input
                        type="text"
                        id="currentaddress"
                        name="currentaddress"
                        value={currentaddress || ""}
                        placeholder="Enter Current Address"
                        onChange={handleInputChange}
                    />

                    <label htmlFor="gps">GPS</label>
                    <input
                        type="text"
                        id="gps"
                        name="gps"
                        value={gps || ""}
                        placeholder="Enter GPS Coordinates"
                        onChange={handleInputChange}
                    />

                    <label htmlFor="raisedtouser">Raised to User</label>
                    <input
                        type="email"
                        id="raisedtouser"
                        name="raisedtouser"
                        value={raisedtouser || ""}
                        placeholder="Enter User Email"
                        onChange={handleInputChange}
                    />

                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={status || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="inprogress">In Progress</option>
                        <option value="onhold">On Hold</option>
                    </select>

                    <input type="submit" value={incidentid ? "Update" : "Save"} />
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}
                </form>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </div>
    );
};

export default FAddEdit;
