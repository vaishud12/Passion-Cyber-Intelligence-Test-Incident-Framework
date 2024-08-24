import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FAddEdit.css';

const initialState = {
    incidentcategory: '',
    incidentname: '',
    incidentowner: '',
    incidentdescription: '',
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
    const { incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status} = state;
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
        axios.get('http://localhost:5000/api/agroincidentcategorygets')
            .then((resp) => {
                console.log("Incident category data:", resp.data);
                setIncidentCategories(resp.data);
            })
            .catch(error => {
                console.error("Error fetching incident categories:", error);
            });
    }, []);

    useEffect(() => {
        if (incidentcategory) {
            axios.get(`http://localhost:5000/api/agroincidentnamegets?incidentcategory=${incidentcategory}`)
                .then((resp) => {
                    console.log("Incident names Data:", resp.data);
                    setIncidentNames(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching incident names:", error);
                });
        }
    }, [incidentcategory]);

    useEffect(() => {
        if (incidentname) {
            axios.get(`http://localhost:5000/api/agroincidentdescriptiongets?incidentname=${incidentname}`)
                .then((resp) => {
                    console.log("Incident descriptions Data:", resp.data);
                    setIncidentDescriptions(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching incident descriptions:", error);
                });
        }
    }, [incidentname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!incidentcategory || !incidentname || !incidentowner || !incidentdescription || !date || !currentaddress || !gps || !raisedtouser) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                // Fetch the user ID based on the raisedtouser email
                const response = await axios.get(`http://localhost:5000/api/getUserByEmail/${raisedtouser}`);
                const raisedToUserId = response.data.userid; // Assign response to the correct variable name
    
                // Combine the fetched raisedtouserid with the other form data and assign it to userid
                const updatedData = { ...state, userid: raisedToUserId, raisedtouserid: raisedToUserId, id: userId, };
    
                if (!incidentid) {
                    await axios.post("http://localhost:5000/api/incidentpost", updatedData);
                } else {
                    await axios.put(`http://localhost:5000/api/incidentupdate/${incidentid}`, updatedData);
                }
                setState(initialState);
                toast.success(`${incidentid ? 'Incident updated' : 'Incident added'} successfully`);
    
                // Sending email and opening WhatsApp link
                const emailPayload = {
                    email1: raisedtouser,
                    from: incidentowner,
                    incidentcategory,
                    incidentname,
                    incidentowner,
                    incidentdescription,
                    date,
                    currentaddress,
                    gps,
                };
                await axios.post("http://localhost:5000/api/send-emailfour/ids", emailPayload);
                toast.success('Email sent successfully');
                setEmailSent(true);
    
                const message = `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nIncident Description: ${incidentdescription}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}\nStatus: ${status}`;
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

        // Fetch incident names and descriptions when category or name changes
        if (name === 'incidentcategory') {
            setState(prevState => ({
                ...prevState,
                incidentname: '', // Reset incident name when category changes
                incidentdescription: '' // Reset description when category changes
            }));
        } else if (name === 'incidentname') {
            setState(prevState => ({
                ...prevState,
                incidentdescription: '' // Reset description when name changes
            }));
        }
    };

    return (
        <div className={`modal ${visible ? 'show' : 'hide'}`} style={{ marginTop: "20px" }}>
            <div className="modal-content">
                <center><h1>{editItem ? 'Edit Incident' : 'Add Incident'}</h1></center>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Incident Category:</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentcategory"
                            name="incidentcategory"
                            value={incidentcategory || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Incident Category</option>
                            {incidentCategories.map((category, index) => (
                                <option
                                    key={category.incidentcategoryid}
                                    value={category.incidentcategory}
                                >
                                    {category.incidentcategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Incident Name:</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentname"
                            name="incidentname"
                            value={incidentname || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Incident Name</option>
                            {incidentNames.map((name, index) => (
                                <option
                                    key={name.incidentnameid}
                                    value={name.incidentname}
                                >
                                    {name.incidentname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Incident Description:</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentdescription"
                            name="incidentdescription"
                            value={incidentdescription || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Incident Description</option>
                            {incidentDescriptions.map((description, index) => (
                                <option
                                    key={description.incidentdescriptionid}
                                    value={description.incidentdescription}
                                >
                                    {description.incidentdescription}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label htmlFor="incidentowner">Incident Owner</label>
                    <input
                        type="text"
                        id="incidentowner"
                        name="incidentowner"
                        value={incidentowner || ""}
                        placeholder="Enter Incident Owner"
                        onChange={handleInputChange}
                    />

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
                        type="text"
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
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Email sent successfully!</div>}
                </form>
                <button onClick={handleGoBack}>Go Back</button>
                
            </div>
        </div>
    );
};

export default FAddEdit;
