import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResolutionAddEdit.css';

const initialState = {
    incidentid: '',
    incidentcategory:'',
    incidentname: '',
    incidentowner: '',
    resolutiondate: '',
    resolutionremark: '',
    resolvedby: ''
};

const ResolutionAddEdit = ({ visible, editItem, onClose }) => {
    const [state, setState] = useState(initialState);
    const {incidentcategory, incidentname, incidentowner, resolutiondate, resolutionremark, resolvedby } = state;
   const incidentid=editItem.incidentid // Extract incident ID from URL params
    const [emailSent, setEmailSent] = useState(false);
    
    const userId = localStorage.getItem("user_id");
    
console.log(editItem);
    // Fetch incident data when component mounts or incidentid changes
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


    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resolutiondate || !incidentid) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                const updatedData = { ...state, id: userId, };
                // POST or PUT based on whether an ID is present
                if (!incidentid) {
                    await axios.post("http://localhost:5000/api/resolutionpost", { updatedData });
                } else {
                    await axios.put(`http://localhost:5000/api/resolutionupdate/${incidentid}`, { updatedData });
                }
                setState(initialState);
                toast.success(`${incidentid ? 'Resolution updated' : 'Resolution Added'} successfully`);

                // Send email
                const emailPayload = {
                    email1: incidentowner,
                    from: resolvedby,
                    incidentid,
                    incidentcategory,
                    incidentname,
                    incidentowner,
                    resolutiondate,
                    resolutionremark,
                    resolvedby
                };
                await axios.post("http://localhost:5000/api/send-emailforresolved/ids", emailPayload);
                toast.success('Email sent successfully');
                setEmailSent(true);

                // Open WhatsApp
                const message = `Incident id: ${incidentid}\nIncident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                onClose();
            } catch (error) {
                toast.error(error.response?.data?.error || 'An error occurred');
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
                <center><h1>{incidentid ? 'Add Resolution' : 'Add Resolution'}</h1></center>
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
                    <label htmlFor="incidentcategory">Incident category:</label>
                    <input
                        type="text"
                        id="incidentcategory"
                        name="incidentcategory"
                        placeholder="Enter Incident Category"
                        value={incidentcategory}
                        onChange={handleInputChange}
                        readOnly
                    />
                    <label htmlFor="incidentname">Incident Name:</label>
                    <input
                        type="text"
                        id="incidentname"
                        name="incidentname"
                        placeholder="Enter Incident Name"
                        value={incidentname}
                        onChange={handleInputChange}
                        readOnly
                    />
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
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}
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
