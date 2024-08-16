import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResolutionAddEdit.css';

const initialState = {
    incidentid: '',
    incidentname: '',
    incidentowner: '',
    resolutiondate: '',
    resolutionremark: '',
    resolvedby: ''
};

const ResolutionAddEdit = ({ visible, onClose }) => {
    const [state, setState] = useState(initialState);
    const { incidentid, incidentname, incidentowner, resolutiondate, resolutionremark, resolvedby } = state;
    const { incidentid: paramIncidentId } = useParams(); // Extract incident ID from URL params
    const [emailSent, setEmailSent] = useState(false);

    // Fetch incident data when component mounts or incidentid changes
    useEffect(() => {
        if (paramIncidentId) {
            axios.get(`http://localhost:5000/api/incidentget/${paramIncidentId}`)
                .then(resp => {
                    const incidentData = resp.data[0]; // Assuming result is an array
                    setState(prevState => ({
                        ...prevState,
                        incidentid: incidentData.incidentid || '',
                        incidentname: incidentData.incidentname || '',
                        incidentowner: incidentData.incidentowner || ''
                    }));
                })
                .catch(error => console.error("Error fetching incident data:", error));
        }
    }, [paramIncidentId]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resolutiondate || !incidentid) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                // POST or PUT based on whether an ID is present
                if (!paramIncidentId) {
                    await axios.post("http://localhost:5000/api/resolutionpost", { ...state });
                } else {
                    await axios.put(`http://localhost:5000/api/resolutionupdate/${paramIncidentId}`, { ...state });
                }
                setState(initialState);
                toast.success(`${paramIncidentId ? 'Resolution updated' : 'Resolution Added'} successfully`);

                // Send email
                const emailPayload = {
                    email1: incidentowner,
                    from: resolvedby,
                    incidentid,
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
                const message = `Incident id: ${incidentid}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
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
                <center><h1>{paramIncidentId ? 'Add Resolution' : 'Add Resolution'}</h1></center>
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
                        readOnly
                    />
                    <label htmlFor="incidentname">Incident Name:</label>
                    <input
                        type="text"
                        id="incidentname"
                        name="incidentname"
                        placeholder="Enter Incident Name"
                        value={incidentname}
                        readOnly
                    />
                    <label htmlFor="incidentowner">Incident Owner:</label>
                    <input
                        type="text"
                        id="incidentowner"
                        name="incidentowner"
                        placeholder="Enter Incident Owner Email"
                        value={incidentowner}
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

                    <input type="submit" value={paramIncidentId ? "Submit" : "Save"} />
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}
                    <button type="button" onClick={handleGoBack}>Go back</button>
                </form>
            </div>
        </div>
    );
};

export default ResolutionAddEdit;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './ResolutionAddEdit.css';

// const ResolutionAddEdit = ({ visible, onClose, editItem, loadData }) => {
//   const [state, setState] = useState({
//     incidentid: '',
//     incidentname: '',
//     incidentowner: '',
//     resolutiondate: '',
//     resolutionremark: '',
//     resolvedby: ''
//   });
//   const [emailSent, setEmailSent] = useState(false);

//   useEffect(() => {
//     if (editItem) {
//       setState({
//         incidentid: editItem.incidentid || '',
//         incidentname: editItem.incidentname || '',
//         incidentowner: editItem.incidentowner || '',
//         resolutiondate: '',
//         resolutionremark: '',
//         resolvedby: ''
//       });
//     }
//   }, [editItem]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { incidentid, resolutiondate, resolutionremark, resolvedby, incidentname, incidentowner } = state;

//     if (!resolutiondate || !incidentid) {
//       toast.error("Please provide a value for each input field");
//     } else {
//       try {
//         if (!editItem.resolutionid) {
//           await axios.post("http://localhost:5000/api/resolutionpost", state);
//         } else {
//           await axios.put(`http://localhost:5000/api/resolutionupdate/${editItem.resolutionid}`, state);
//         }
//         setState({
//           incidentid: '',
//           incidentname: '',
//           incidentowner: '',
//           resolutiondate: '',
//           resolutionremark: '',
//           resolvedby: ''
//         });
//         toast.success(`${editItem.resolutionid ? 'Resolution updated' : 'Resolution Added'} successfully`);
        
//         // Send email
//         const emailPayload = {
//           email1: editItem.incidentowner,
//           from: resolvedby,
//           incidentid,
//           incidentname,
//           incidentowner,
//           resolutiondate,
//           resolutionremark,
//           resolvedby
//         };
//         await axios.post("http://localhost:5000/api/send-emailforresolved/ids", emailPayload);
//         toast.success('Email sent successfully');
//         setEmailSent(true);

//         // Open WhatsApp
//         const message = `Incident id: ${incidentid}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Remark: ${resolutionremark}\nResolved by: ${resolvedby}`;
//         const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//         window.open(whatsappUrl, '_blank');

//         onClose();
//         loadData(); // Refresh data in the parent component
//       } catch (error) {
//         toast.error(error.response?.data?.error || 'An error occurred');
//       }
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setState(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   if (!visible) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <span className="close-button" onClick={onClose}>&times;</span>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="incidentid">Incident ID:</label>
//           <input
//             type="text"
//             id="incidentid"
//             name="incidentid"
//             value={state.incidentid}
//             readOnly
//           />
//           <label htmlFor="incidentname">Incident Name:</label>
//           <input
//             type="text"
//             id="incidentname"
//             name="incidentname"
//             value={state.incidentname}
//             readOnly
//           />
//           <label htmlFor="incidentowner">Incident Owner:</label>
//           <input
//             type="text"
//             id="incidentowner"
//             name="incidentowner"
//             value={state.incidentowner}
//             readOnly
//           />
//           <label htmlFor="resolutiondate">Resolution Date:</label>
//           <input
//             type="date"
//             id="resolutiondate"
//             name="resolutiondate"
//             value={state.resolutiondate}
//             onChange={handleInputChange}
//           />
//           <label htmlFor="resolutionremark">Resolution Remark:</label>
//           <input
//             type="text"
//             id="resolutionremark"
//             name="resolutionremark"
//             value={state.resolutionremark}
//             onChange={handleInputChange}
//           />
//           <label htmlFor="resolvedby">Resolved By:</label>
//           <input
//             type="text"
//             id="resolvedby"
//             name="resolvedby"
//             value={state.resolvedby}
//             onChange={handleInputChange}
//           />
//           <button type="submit">{editItem.resolutionid ? "Update" : "Save"}</button>
//           {emailSent && <div style={{ color: 'green' }}>Incident email sent successfully!</div>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResolutionAddEdit;
