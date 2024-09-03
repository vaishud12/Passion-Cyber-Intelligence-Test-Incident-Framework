import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import './ResolutionAddEdit.css';
import * as API from "../Endpoint/Endpoint";
const initialState = {
    incidentid: '',
    incidentcategory: '',
    incidentdescription:'',
    incidentname: '',
    incidentowner: '',
    resolutiondate: '',
    resolutionremark: '',
    resolvedby: ''
};

const ResolutionAddEdit = ({ visible, editItem, onClose }) => {
    const [state, setState] = useState(initialState);
    const { incidentid, incidentcategory, incidentname, incidentdescription, incidentowner, resolutiondate, resolutionremark, resolvedby } = state;
    const [emailSent, setEmailSent] = useState(false);
    const [incidentDescriptions, setIncidentDescriptions] = useState([]);
    const [incidentCategories, setIncidentCategories] = useState([]);
    const [incidentNames, setIncidentNames] = useState([]);
    const userId = localStorage.getItem("user_id");
    const { resolutionid } = useParams();
    useEffect(() => {
        if (editItem) {
            setState(editItem);
        } else if (incidentid) {
            axios.get(API.GET_SPECIFIC_INCIDENT(incidentid))
                .then(resp => {
                    console.log("Response from GET:", resp.data);
                    setState(resp.data[0]);
                })
                .catch(error => {
                    console.error("Error fetching incident:", error);
                    toast.error("Failed to fetch incident details");
                });
        }
    }, [editItem, incidentid]);

    useEffect(() => {
        axios.get(API.GET_DISTINCT_INCIDENT_CATEGORY)
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
            axios.get(`${API.GET_INCIDENT_NAME_BASEDON_INCIDENTCATEGORY}?incidentcategory=${incidentcategory}`)
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
            axios.get(`${API.GET_INCIDENT_DESCRIPTION_BASEDON_INCIDENTNAME}?incidentname=${incidentname}`)
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
    
        // Check if all required fields are provided
        if (!resolutiondate || !incidentid || !incidentcategory || !incidentname || !incidentdescription || !incidentowner || !resolutionremark || !resolvedby) {
            toast.error("Please provide a value for each input field");
            return;
        }
    
        // Prepare data to be sent to the backend
        const updatedData = { 
            incidentid, 
            incidentcategory, 
            incidentname,
            incidentdescription, 
            incidentowner, 
            resolutiondate, 
            resolutionremark, 
            resolvedby, 
            id: userId 
        };
    
        console.log("Data being sent to backend:", updatedData);
    
        try {
            // Conditional API call based on the presence of resolutionid
            if (resolutionid) {
                // If resolutionid is present, update the existing resolution
                await axios.put(API.UPDATE_SPECIFIC_RESOLUTION(resolutionid), updatedData);
                toast.success('Resolution updated successfully');
            } else if (incidentid) {
                // If incidentid is present but resolutionid is not, create a new resolution
                await axios.post(API.POST_RESOLUTION, updatedData);
                toast.success('Resolution added successfully');
            } else {
                // Handle case where neither resolutionid nor incidentid is present
                toast.error('Cannot determine if this is a new resolution or update');
                return;
            }
    
            // Clear the form state
            setState(initialState);
    
            // Send email notification
            const emailPayload = {
                email1: incidentowner, // Ensure this is a valid email
                from: resolvedby,
                incidentid,
                incidentcategory,
                incidentname,
                incidentdescription,
                incidentowner,
                resolutiondate,
                resolutionremark,
                resolvedby
            };
            await axios.post(API.POST_SEND_RESOLVED_EMAIL, emailPayload);
            toast.success('Email sent successfully');
            setEmailSent(true);
    
            // Open WhatsApp with the message
            const message = `Incident id: ${incidentid}\nIncident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
    
            // Close the form/modal
            onClose();
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error(error.response?.data?.error || 'An error occurred');
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
                <center><h1>{incidentid ? 'Edit Resolution' : 'Add Resolution'}</h1></center>
                <form
                    style={{
                        margin: "auto",
                        padding: "15px",
                        maxWidth: "500px",
                        alignContent: "center"
                    }}
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="incidentid">Incident ID:</label>
                    <input
                        type="text"
                        id="incidentid"
                        name="incidentid"
                        placeholder="Enter Incident ID"
                        value={incidentid}
                        onChange={handleInputChange}
                        readOnly
                    />
                   
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

                    <label htmlFor="incidentowner">Incident Owner:</label>
                    <input
                        type="text"
                        id="incidentowner"
                        name="incidentowner"
                        placeholder="Enter Incident Owner Email"
                        value={incidentowner}
                        onChange={handleInputChange}
                        readOnly
                    />
                    <label htmlFor="resolutiondate">Resolution Date:</label>
                    <input
                        type="date"
                        id="resolutiondate"
                        name="resolutiondate"
                        placeholder="Enter Resolution Date"
                        value={resolutiondate}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="resolutionremark">Resolution Remark:</label>
                    <input
                        type="text"
                        id="resolutionremark"
                        name="resolutionremark"
                        placeholder="Enter Resolution Remark"
                        value={resolutionremark}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="resolvedby">Resolved By:</label>
                    <input
                        type="text"
                        id="resolvedby"
                        name="resolvedby"
                        placeholder="Enter Resolved By"
                        value={resolvedby}
                        onChange={handleInputChange}
                    />

                    <input type="submit" value={incidentid ? "Submit" : "Save"} />
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident email sent successfully to user!</div>}
                    <button type="button" onClick={handleGoBack}>Go back</button>
                </form>
            </div>
        </div>
    );
};

export default ResolutionAddEdit;



// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import './ResolutionAddEdit.css';

// // const ResolutionAddEdit = ({ visible, onClose, editItem, loadData }) => {
// //   const [state, setState] = useState({
// //     incidentid: '',
// //     incidentname: '',
// //     incidentowner: '',
// //     resolutiondate: '',
// //     resolutionremark: '',
// //     resolvedby: ''
// //   });
// //   const [emailSent, setEmailSent] = useState(false);

// //   useEffect(() => {
// //     if (editItem) {
// //       setState({
// //         incidentid: editItem.incidentid || '',
// //         incidentname: editItem.incidentname || '',
// //         incidentowner: editItem.incidentowner || '',
// //         resolutiondate: '',
// //         resolutionremark: '',
// //         resolvedby: ''
// //       });
// //     }
// //   }, [editItem]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const { incidentid, resolutiondate, resolutionremark, resolvedby, incidentname, incidentowner } = state;

// //     if (!resolutiondate || !incidentid) {
// //       toast.error("Please provide a value for each input field");
// //     } else {
// //       try {
// //         if (!editItem.resolutionid) {
// //           await axios.post("http://localhost:5000/api/resolutionpost", state);
// //         } else {
// //           await axios.put(`http://localhost:5000/api/resolutionupdate/${editItem.resolutionid}`, state);
// //         }
// //         setState({
// //           incidentid: '',
// //           incidentname: '',
// //           incidentowner: '',
// //           resolutiondate: '',
// //           resolutionremark: '',
// //           resolvedby: ''
// //         });
// //         toast.success(`${editItem.resolutionid ? 'Resolution updated' : 'Resolution Added'} successfully`);
        
// //         // Send email
// //         const emailPayload = {
// //           email1: editItem.incidentowner,
// //           from: resolvedby,
// //           incidentid,
// //           incidentname,
// //           incidentowner,
// //           resolutiondate,
// //           resolutionremark,
// //           resolvedby
// //         };
// //         await axios.post("http://localhost:5000/api/send-emailforresolved/ids", emailPayload);
// //         toast.success('Email sent successfully');
// //         setEmailSent(true);

// //         // Open WhatsApp
// //         const message = `Incident id: ${incidentid}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
// //         const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
// //         window.open(whatsappUrl, '_blank');

// //         onClose();
// //         loadData(); // Refresh data in the parent component
// //       } catch (error) {
// //         toast.error(error.response?.data?.error || 'An error occurred');
// //       }
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setState(prevState => ({
// //       ...prevState,
// //       [name]: value
// //     }));
// //   };

// //   if (!visible) return null;

// //   return (
// //     <div className="modal-overlay">
// //       <div className="modal-content">
// //         <span className="close-button" onClick={onClose}>&times;</span>
// //         <form onSubmit={handleSubmit}>
// //           <label htmlFor="incidentid">Incident ID:</label>
// //           <input
// //             type="text"
// //             id="incidentid"
// //             name="incidentid"
// //             value={state.incidentid}
// //             readOnly
// //           />
// //           <label htmlFor="incidentname">Incident Name:</label>
// //           <input
// //             type="text"
// //             id="incidentname"
// //             name="incidentname"
// //             value={state.incidentname}
// //             readOnly
// //           />
// //           <label htmlFor="incidentowner">Incident Owner:</label>
// //           <input
// //             type="text"
// //             id="incidentowner"
// //             name="incidentowner"
// //             value={state.incidentowner}
// //             readOnly
// //           />
// //           <label htmlFor="resolutiondate">Resolution Date:</label>
// //           <input
// //             type="date"
// //             id="resolutiondate"
// //             name="resolutiondate"
// //             value={state.resolutiondate}
// //             onChange={handleInputChange}
// //           />
// //           <label htmlFor="resolutionremark">Resolution Remark:</label>
// //           <input
// //             type="text"
// //             id="resolutionremark"
// //             name="resolutionremark"
// //             value={state.resolutionremark}
// //             onChange={handleInputChange}
// //           />
// //           <label htmlFor="resolvedby">Resolved By:</label>
// //           <input
// //             type="text"
// //             id="resolvedby"
// //             name="resolvedby"
// //             value={state.resolvedby}
// //             onChange={handleInputChange}
// //           />
// //           <button type="submit">{editItem.resolutionid ? "Update" : "Save"}</button>
// //           {emailSent && <div style={{ color: 'green' }}>Incident email sent successfully!</div>}
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResolutionAddEdit;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './ResolutionAddEdit.css';

// const initialState = {
//     incidentid: '',
//     incidentcategory: '',
//     incidentname: '',
//     incidentowner: '',
//     resolutiondate: '',
//     resolutionremark: '',
//     resolvedby: ''
// };

// const ResolutionAddEdit = ({ visible, onClose, editItem, loadData }) => {
//     const [state, setState] = useState(initialState);
//     const { incidentid, incidentcategory, incidentname, incidentowner, resolutiondate, resolutionremark, resolvedby } = state;
//     const { incidentid: paramIncidentId } = useParams(); // Extract incident ID from URL params
//     const [emailSent, setEmailSent] = useState(false);

//     useEffect(() => {
//         if (editItem) {
//             setState(editItem);
//         } else if (paramIncidentId) {
//             axios.get(`http://localhost:5000/api/incidentget/${paramIncidentId}`)
//                 .then(resp => {
//                     console.log("Response:", resp.data);
//                     setState(resp.data[0]);
//                 })
//                 .catch(error => console.error(error));
//         }
//     }, [editItem, paramIncidentId]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!incidentcategory || !incidentname || !incidentowner) {
//             toast.error("Please provide a value for each input field");
//         } else {
//             try {
//                 if (!paramIncidentId) {
//                     await axios.post("http://localhost:5000/api/resolutionpost", state);
//                 } else {
//                     await axios.put(`http://localhost:5000/api/resolutionupdate/${paramIncidentId}`, state);
//                 }
//                 setState(initialState);
//                 toast.success(`${paramIncidentId ? 'Incident updated' : 'Incident added'} successfully`);

//                 // Send email
//                 const emailPayload = {
//                     email1: incidentowner,
//                     from: resolvedby,
//                     incidentid,
//                     incidentname,
//                     incidentowner,
//                     resolutiondate,
//                     resolutionremark,
//                     resolvedby
//                 };
//                 await axios.post("http://localhost:5000/api/send-emailforresolved/ids", emailPayload);
//                 toast.success('Email sent successfully');
//                 setEmailSent(true);

//                 // Open WhatsApp
//                 const message = `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
//                 const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//                 window.open(whatsappUrl, '_blank');

//                 onClose();
//                 loadData(); // Reload the data after adding or updating an incident
//             } catch (error) {
//                 toast.error(error.response?.data?.error || 'An error occurred');
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

//     if (!visible) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <span className="close-button" onClick={onClose}>&times;</span>
//                 <center><h1>{paramIncidentId ? 'Edit Resolution' : 'Add Resolution'}</h1></center>
//                 <form onSubmit={handleSubmit} style={{ margin: "auto", padding: "15px", maxWidth: "500px", alignContent: "center" }}>
//                     <label htmlFor="incidentid">Incident ID:</label>
//                     <input
//                         type="text"
//                         id="incidentid"
//                         name="incidentid"
//                         placeholder="Enter Incident ID"
//                         value={incidentid}
//                         readOnly
//                     />
//                     <div>
//                         <label>Incident Category:</label>
//                         <select
//                             style={{ fontFamily: "Poppins" }}
//                             id="incidentcategory"
//                             name="incidentcategory"
//                             value={incidentcategory || ""}
//                             onChange={handleInputChange}
//                         >
//                             <option value="">Select Incident Category</option>
//                             {/* Map your incident categories here */}
//                         </select>
//                     </div>
//                     <div>
//                         <label>Incident Name:</label>
//                         <select
//                             style={{ fontFamily: "Poppins" }}
//                             id="incidentname"
//                             name="incidentname"
//                             value={incidentname || ""}
//                             onChange={handleInputChange}
//                         >
//                             <option value="">Select Incident Name</option>
//                             {/* Map your incident names here */}
//                         </select>
//                     </div>
//                     <label htmlFor="incidentowner">Incident Owner:</label>
//                     <input
//                         type="text"
//                         id="incidentowner"
//                         name="incidentowner"
//                         value={incidentowner || ""}
//                         placeholder="Enter Incident Owner"
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="resolutiondate">Resolution Date:</label>
//                     <input
//                         type="date"
//                         id="resolutiondate"
//                         name="resolutiondate"
//                         placeholder="Enter Resolution Date"
//                         value={resolutiondate}
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="resolutionremark">Resolution Remark:</label>
//                     <input
//                         type="text"
//                         id="resolutionremark"
//                         name="resolutionremark"
//                         placeholder="Enter Resolution Remark"
//                         value={resolutionremark}
//                         onChange={handleInputChange}
//                     />
//                     <label htmlFor="resolvedby">Resolved By:</label>
//                     <input
//                         type="text"
//                         id="resolvedby"
//                         name="resolvedby"
//                         placeholder="Enter Resolved By"
//                         value={resolvedby}
//                         onChange={handleInputChange}
//                     />
//                     <input type="submit" value={paramIncidentId ? "Submit" : "Save"} />
//                     {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}
//                     <button type="button" onClick={handleGoBack}>Go back</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ResolutionAddEdit;
