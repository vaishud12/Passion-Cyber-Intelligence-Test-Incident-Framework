import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResolutionAddEdit.css';
// import MapComponent from './MapComponent';

const initialState = {
    incidentid:'',
    incidentname:'',
    incidentowner:'',
    resolutiondate:'',
    resolutionremark:'',
    resolvedby:'',
    

};

const ResolutionAddEdit = ({visible, onClose}) => {
    const [state, setState] = useState(initialState);
    const {incidentid,incidentname,incidentowner, resolutiondate, resolutionremark, resolvedby} = state;
    const { resolutionid } = useParams();
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [incidentidg, setIncidentidg] = useState([]);
    const [incidentnameg, setIncidentnameg] = useState([]);
    const [incidentownerg, setIncidentownerg] = useState([]);

    // const [RespCenter, setRespCenter] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/incidentget')
            .then((resp) => {
                console.log("incident id:", resp.data);
                setIncidentidg(resp.data);

            })
            .catch(error => {
                console.error("Error fetching incident data:", error);
                // Handle error, e.g., display an error message to the user
        });
        axios.get('http://localhost:5000/api/incidentget')
            .then((resp) => {
                console.log("Incident Name:", resp.data);
                setIncidentnameg(resp.data);

            })
            .catch(error => {
                console.error("Error fetching incident name data:", error);
                // Handle error, e.g., display an error message to the user
        });
        axios.get('http://localhost:5000/api/incidentget')
            .then((resp) => {
                console.log("Incident Owner:", resp.data);
                setIncidentownerg(resp.data);

            })
            .catch(error => {
                console.error("Error fetching bot group data:", error);
                // Handle error, e.g., display an error message to the user
        });
        if (!resolutionid) {
            axios.get(`http://localhost:5000/api/resolutionget/${resolutionid}`)
                .then(resp => {
                    console.log("Response:", resp.data); // Add this line to log the response
                    setState(resp.data[0]);
                })
                .catch(error => console.error(error));
        }
    }, [resolutionid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resolutiondate || !incidentid) {
            toast.error("Please provide a value for each input field");
        } else {
            try {
                
                if (!resolutionid) {
                    await axios.post("http://localhost:5000/api/resolutionpost",{incidentid,incidentname,incidentowner,resolutiondate,resolutionremark,resolvedby});
                } else {
                    await axios.put(`http://localhost:5000/api/resolutionupdate/${resolutionid}`,{incidentid,incidentname,incidentowner,resolutiondate,resolutionremark,resolvedby});
                }
                setState(initialState);
                toast.success(`${resolutionid ? 'Resolution updated' : 'Resolution Added'} successfully`);
                  // Send email
                const emailPayload = {
                    email1: incidentowner,
                    from: resolvedby,
                    incidentid,
                    incidentname,
                    incidentowner,
                    resolutiondate,
                    resolutionremark,
                    resolvedby,
                    
                };
                await axios.post("http://localhost:5000/api/send-emailforresolved/ids", emailPayload);
                toast.success('Email sent successfully');
                setEmailSent(true);

                // Open WhatsApp
                const message = `Incident id: ${incidentid}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nResolution Date: ${resolutiondate}\nResolution Reamrk: ${resolutionremark}\nResolved by: ${resolvedby}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                
                onClose();
                // updatedData();
            } catch (error) {
                toast.error(error.response.data.error);
            }
        }
    };
    const handleGoBack = () => {
        // Call onClose function to close the modal
        onClose();
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    // const handleEmail = async () => {
    //     try {
    //         const emailData = {
    //             recipientEmail: 'mugsvaishu@gmail.com', // Replace with recipient's email
    //             subject: 'Incident Details',
    //             text: `Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nDescription: ${description}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}`
    //         };
    
    //         await axios.post('http://localhost:5000/api/send-email', emailData);
    //         toast.success('Email sent successfully');
    //     } catch (error) {
    //         toast.error('Failed to send email');
    //     }
    // };
    
    

    return (
        <div  className={`modal ${visible ? 'show' : 'hide'}`} style={{ marginTop: "20px" }}>
             <div className="modal-content">
            {/* <span className="close" onClick={onClose}>&times;</span> */}
            <center><h1>{resolutionid ? 'Edit Resolve' : 'Add Resolution'}</h1></center>
            <form
                style={{
                    margin: "auto",
                    padding: "15px",
                    maxWidth: "500px",
                    alignContent: "center"
                }}
                onSubmit={handleSubmit}
            >
                 <div>
            <label>Incident ID:</label>
            <select
                style={{ fontFamily: "Poppins" }}
                id="incidentid"
                name="incidentid"
                value={incidentid|| ""}
                onChange={handleInputChange}
        
            >
                <option value="">Select Incident Id</option>
                {incidentidg.map((incidentis, index) => (
                    <option
                        key={incidentis.incidentid}
                        value={incidentis.incidentid}
                    >
                        {incidentis.incidentid}
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
                value={incidentname|| ""}
                onChange={handleInputChange}
        
            >
                <option value="">Select Incident Name</option>
                {incidentnameg.map((incidentns, index) => (
                    <option
                        key={incidentns.incidentname}
                        value={incidentns.incidentname}
                    >
                        {incidentns.incidentname}
                    </option>
                ))}
            </select>
            
        </div> 
<div>
            <label>Incident owner:</label>
            <select
                style={{ fontFamily: "Poppins" }}
                id="incidentowner"
                name="incidentowner"
                value={incidentowner|| ""}
                onChange={handleInputChange}
        
            >
                <option value="">Select Incident Owner mailid</option>
                {incidentownerg.map((incidentos, index) => (
                    <option
                        key={incidentos.incidentid}
                        value={incidentos.incidentowner}
                    >
                        {incidentos.incidentowner}
                    </option>
                ))}
            </select>
            
        </div>
                

                
                <label htmlFor="resolutiondate">Resolution Date:</label>
                <input
                    type="date"
                    id="resolutiondate"
                    name="resolutiondate"
                    placeholder="Enter Resolution date"
                    value={resolutiondate}
                    onChange={handleInputChange}
                />
                <label htmlFor="resolutionremark">Resolution Reamrk:</label>
                <input
                    type="text"
                    id="resolutionremark"
                    name="resolutionremark"
                    placeholder="Enter resolution remark"
                    value={resolutionremark}
                    onChange={handleInputChange}
                />
                <label htmlFor="resolvedby">resolvedby:</label>
                <input
                    type="text"
                    id="resolvedby"
                    name="resolvedby"
                    placeholder="Enter resolved by"
                    value={resolvedby}
                    onChange={handleInputChange}
                />
                
                
                <input type="submit"  value={resolutionid ? "Update" : "save"} />
                {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Incident Email sent successfully to user!</div>}

            
                <button type="button" onClick={handleGoBack}>Go back</button>
                
            </form>
            </div>
        </div>
    );
};

export default ResolutionAddEdit;














































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































