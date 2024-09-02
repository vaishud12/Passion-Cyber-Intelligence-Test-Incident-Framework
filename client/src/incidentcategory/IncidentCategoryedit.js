// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './FAddEdit.css';

// const initialState = {
//     incidentcategory: '',
//     incidentname: '',
//     incidentowner: '',
//     description: '',
//     date: '',
//     currentaddress: '',
//     gps: '',
//     raisedtouser: '',
//     // status: 'Pending',
// };

// const FAddEdit = ({ visible, onClose }) => {
//     const [state, setState] = useState(initialState);
//     const [emailSent, setEmailSent] = useState(false);  // State for tracking email sent status
//     const { incidentcategory, incidentname, incidentowner, description, date, currentaddress, gps, raisedtouser } = state;
//     const { incidentid } = useParams();

//     useEffect(() => {
//         if (incidentid) {
//             axios.get(`http://localhost:5000/api/incidentget/${incidentid}`)
//                 .then(resp => {
//                     console.log("Response:", resp.data);
//                     setState(resp.data[0]);
//                 })
//                 .catch(error => console.error(error));
//         }
//     }, [incidentid]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!incidentcategory) {
//             toast.error("Please provide a value for each input field");
//         } else {
//             try {
//                 const updatedData = { ...state, status: 'Solved' };
//                 if (!incidentid) {
//                     await axios.post("http://localhost:5000/api/incidentpost", { incidentcategory, incidentname, incidentowner, description, date, currentaddress, gps, raisedtouser});
//                 } else {
//                     await axios.put(`http://localhost:5000/api/incidentupdate/${incidentid}`, { incidentcategory, incidentname, incidentowner, description, date, currentaddress, gps, raisedtouser});
//                 }
//                 setState(initialState);
//                 toast.success(`${incidentid ? 'Incident updated' : 'Incident Added'} successfully`);

//                 const emailPayload = {
//                     email1: raisedtouser,
//                     from: incidentowner,
//                     incidentcategory,
//                     incidentname,
//                     incidentowner,
//                     description,
//                     date,
//                     currentaddress,
//                     gps,
//                 };
//                 await axios.post("http://localhost:5000/api/send-emailfour/ids", emailPayload);
//                 toast.success('Email sent successfully');
//                 setEmailSent(true);  // Set email sent status to true

//                 const message = `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nDescription: ${description}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}`;
//                 const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//                 window.open(whatsappUrl, '_blank');
//             } catch (error) {
//                 toast.error(error.response.data.error);
//             }
//         }
//     };

//     const handleGoBack = () => {
//         onClose();
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     return (
//         <div className={`modal ${visible ? 'show' : 'hide'}`} style={{ marginTop: "20px" }}>
//             <div className="modal-content">
//                 <center><h1>{incidentid ? 'Edit Incident' : 'Add Incident'}</h1></center>
//                 <form onSubmit={handleSubmit}>
//                     <label htmlFor="incidentcategory">Incident Category</label>
//                     <input
//                         type="text"
//                         id="incidentcategory"
//                         name="incidentcategory"
//                         value={incidentcategory || ""}
//                         placeholder="Enter Incident Category"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="incidentname">Incident Name</label>
//                     <input
//                         type="text"
//                         id="incidentname"
//                         name="incidentname"
//                         value={incidentname || ""}
//                         placeholder="Enter Incident Name"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="incidentowner">Incident Owner</label>
//                     <input
//                         type="text"
//                         id="incidentowner"
//                         name="incidentowner"
//                         value={incidentowner || ""}
//                         placeholder="Enter Incident Owner"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="description">Description</label>
//                     <input
//                         type="text"
//                         id="description"
//                         name="description"
//                         value={description || ""}
//                         placeholder="Enter Description"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="date">Date</label>
//                     <input
//                         type="date"
//                         id="date"
//                         name="date"
//                         value={date || ""}
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="currentaddress">Current Address</label>
//                     <input
//                         type="text"
//                         id="currentaddress"
//                         name="currentaddress"
//                         value={currentaddress || ""}
//                         placeholder="Enter Current Address"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="gps">GPS</label>
//                     <input
//                         type="text"
//                         id="gps"
//                         name="gps"
//                         value={gps || ""}
//                         placeholder="Enter Place"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="raisedtouser">Raised to User</label>
//                     <input
//                         type="text"
//                         id="raisedtouser"
//                         name="raisedtouser"
//                         value={raisedtouser || ""}
//                         placeholder="Enter User Emailid"
//                         onChange={handleInputChange}
//                     />
                    
//                     {/* <label htmlFor="status">Status</label>
//                     <input
//                         type="text"
//                         id="status"
//                         name="status"
//                         value={status || ""}
//                         placeholder="Enter Status"
//                         onChange={handleInputChange}
//                     /> */}
//                     <input type="submit" value={incidentid ? "Update" : "Save"} />
//                     {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}  {/* Email sent message */}
//                 </form>
//                 <button onClick={handleGoBack}>Go Back</button>
//             </div>
//         </div>
//     );
// };

// export default FAddEdit;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Incident/FAddEdit.css';

const initialState = {
    incidentcategory: '',
    incidentname: '',
    incidentdescription:'',
};

const IncidentCategoryedit = ({ visible, onClose, editItem, loadData }) => {
    const [state, setState] = useState(initialState);
    // const [emailSent, setEmailSent] = useState(false);
    const { incidentcategory, incidentname, incidentdescription} = state;
    const { incidentcategoryid } = useParams();
    const userId=localStorage.getItem("user_id")
    useEffect(() => {
        if (editItem) {
            setState(editItem);
        } else if (incidentcategoryid) {
            axios.get(`http://localhost:5000/incident-api/incidentcategoryget/${incidentcategoryid}`)
                .then(resp => {
                    console.log("Response:", resp.data);
                    setState(resp.data[0]);
                })
                .catch(error => console.error(error));
        }
    }, [editItem, incidentcategoryid]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!incidentcategory) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                const updatedData = { ...state, userid: userId }; // Remove status from updatedData
                if (!incidentcategoryid) {
                    await axios.post("http://localhost:5000/incident-api/incidentcategorypost", updatedData);
                } else {
                    await axios.put(`http://localhost:5000/incident-api/incidentcategoryupdate/${incidentcategoryid}`, updatedData);
                }
                setState(initialState);
                toast.success(`${incidentcategoryid ? 'Incident updated' : 'Incident Added'} successfully`);

                // const emailPayload = {
                //     email1: raisedtouser,
                //     from: incidentowner,
                //     incidentcategory,
                //     incidentname,
                //     incidentdescription
                // };
                // await axios.post("http://localhost:5000/api/send-emailfour/ids", emailPayload);
                // toast.success('Email sent successfully');
                // setEmailSent(true);

                const message = `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nDescription: ${incidentdescription}`;
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
                <center><h1>{incidentcategoryid ? 'Edit Incident Category' : 'Add Incident Category'}</h1></center>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="incidentcategory">Incident Category</label>
                    <input
                        type="text"
                        id="incidentcategory"
                        name="incidentcategory"
                        value={incidentcategory || ""}
                        placeholder="Enter Incident Category"
                        onChange={handleInputChange}
                    />
                    <label htmlFor="incidentname">Incident Name</label>
                    <input
                        type="text"
                        id="incidentname"
                        name="incidentname"
                        value={incidentname || ""}
                        placeholder="Enter Incident Name"
                        onChange={handleInputChange}
                    />
                   
                    <label htmlFor="incidentdescription">Incident Description</label>
                    <input
                        type="text"
                        id="incidentdescription"
                        name="incidentdescription"
                        value={incidentdescription || ""}
                        placeholder="Enter Incident Description"
                        onChange={handleInputChange}
                    />
                    
                 
                 
                
                

                    <input type="submit" value={incidentcategoryid ? "Update" : "Save"} />
                    {/* {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>} */}
                </form>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </div>
    );
};

export default IncidentCategoryedit;
