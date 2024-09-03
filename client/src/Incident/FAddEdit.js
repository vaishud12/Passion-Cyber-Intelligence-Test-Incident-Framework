import React, { useCallback,  useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FAddEdit.css';

import * as API from "../Endpoint/Endpoint";

// import AgroSuggestions from '../components/AgroSuggestions'

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

const FAddEdit = ({ visible, onClose, editItem, loadData}) => {
    const [state, setState] = useState(initialState);
    const [emailSent, setEmailSent] = useState(false);
    const [incidentCategories, setIncidentCategories] = useState([]);
    const [incidentNames, setIncidentNames] = useState([]);
    const [priority, setPriority] = useState('');

    const [incidentDescriptions, setIncidentDescriptions] = useState([]);
    const { incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status} = state;
    const { incidentid } = useParams();
    const userId = localStorage.getItem("user_id");
    const [tags, setTags] = useState([]);
    const [query, setQuery] = useState('');
   
    const [emailValidation, setEmailValidation] = useState({ exists: true, message: '' });
    const [showConfirmInvite, setShowConfirmInvite] = useState(false);
    console.log(editItem.incidentid)
    // Constant variable for tag names
    const tagNames = tags.map(tag => tag.name);
  
    // Handle tag addition
    const onAddition = useCallback(
      (newTag) => {
        if (newTag && !tags.find((tag) => tag.name === newTag.name)) {
          setTags((prevTags) => [...prevTags, newTag]);
        }
      },
      [tags]
    );
  
    // Handle tag deletion
    const onDelete = useCallback((tagIndex) => {
      setTags((prevTags) => prevTags.filter((_, i) => i !== tagIndex));
    }, []);
  
    // Handle input changes
    const onInput = useCallback((query) => {
      setQuery(query);
    }, []);
  
    // Handle input key press to add tag
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault(); // Prevent default form submission or other behavior
        onAddition({ id: tags.length + 1, name: query.trim() });
        setQuery(''); // Clear input after adding
      }
    };
  
    // Handle input blur event to create tag if input is not empty
    const handleBlur = () => {
      if (query.trim()) {
        onAddition({ id: tags.length + 1, name: query.trim() });
        setQuery(''); // Clear input after adding
      }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(API.CHECK_EMAIL(email));
            setEmailValidation({
                exists: response.data.exists,
                message: response.data.exists ? '' : 'Email not found',
            });
    
            // If the email is not found, trigger the popup
            if (!response.data.exists) {
                setShowConfirmInvite(true);
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailValidation({
                exists: false,
                message: 'Error checking email',
            });
    
            // Optionally, you might want to show a popup if there's an error with the request
            setShowConfirmInvite(true);
        }
    };
    
    
    useEffect(() => {
        if (raisedtouser) {
            const debounceCheck = setTimeout(() => {
                checkEmailExists(raisedtouser);
            }, 500); // Debounce time to prevent excessive API calls
    
            return () => clearTimeout(debounceCheck);
        }
    }, [raisedtouser]);


    useEffect(() => {
        if (editItem) {
            setState(editItem);
        } else if (editItem.incidentid) {
            axios.get(API.GET_SPECIFIC_INCIDENT(editItem.incidentid))
                .then(resp => {
                    console.log("Response:", resp.data);
                    setState(resp.data[0]);
                })
                .catch(error => console.error(error));
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

    console.log("Form submitted");
    console.log("Form data:", { incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser });

    if (!incidentcategory || !incidentname || !incidentowner || !incidentdescription || !date || !currentaddress || !gps || !raisedtouser) {
        toast.error("Please provide a value for each input field");
        return;
    }

    try {
        // Fetch priority times from the server
        const priorityResponse = await axios.get(API.GET_PRIORITY_TIME);
        const priorityTimes = priorityResponse.data;

        // Determine the appropriate priority time
        let timeFrame = '24 hours'; // Default value
        switch (priority) {
            case 'critical':
                timeFrame = priorityTimes.critical;
                break;
            case 'veryhigh':
                timeFrame = priorityTimes.veryhigh;
                break;
            case 'high':
                timeFrame = priorityTimes.high;
                break;
            case 'medium':
                timeFrame = priorityTimes.medium;
                break;
            case 'low':
                timeFrame = priorityTimes.low;
                break;
            default:
                break;
        }

        const userResponse = await axios.get(`http://localhost:5014/incident-api/getUserByEmail/${raisedtouser}`);
        console.log("User response:", userResponse.data);

        if (userResponse.data && userResponse.data.userid) {
            const raisedToUserId = userResponse.data.userid;
            const tagss = tagNames;
            const updatedData = { ...state, userid: raisedToUserId, raisedtouserid: raisedToUserId, id: userId, tagss, priority };

            console.log("Updated Data:", updatedData);

            if (!incidentid) {
                await axios.post(API.POST_INCIDENT, updatedData);
            } else if(editItem.incidentid) {
                await axios.put(API.UPDATE_SPECIFIC_INCIDENT(editItem.incidentid), updatedData);
            }

            setState(initialState);
            toast.success(`${editItem.incidentid  ? 'Incident updated' : 'Incident added'} successfully`);

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
                raisedtouser,
                status,
                tagss,
                priority,
            };

            console.log("Email Payload:", emailPayload);

            try {
                const emailResponse = await axios.post(API.SEND_INCIDENT_EMAIL, emailPayload);
                console.log("Email response:", emailResponse);

                if (emailResponse.status === 200) {
                    toast.success('Email sent successfully');
                    setEmailSent(true);
                }
            } catch (emailError) {
                if (emailError.response && emailError.response.status === 404) {
                    toast.warn(emailError.response.data.message || 'User not found.');
                    setShowConfirmInvite(true);  // Show confirmation dialog
                } else {
                    toast.error("An error occurred while sending the email.");
                }
            }

            const message = `This Incident ${incidentname} Should be Resolved within ${timeFrame}!!!!! ... Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nIncident Description: ${incidentdescription}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}\nStatus: ${status}\ntags:${tagss}, priority:${priority}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            loadData();
        } else {
            toast.error("User not found.");
        }
    } catch (error) {
        console.error("Submit error:", error);
        toast.error("An error occurred while processing the request.");
    }
};

    
    
    const handleGoBack = () => {
        onClose();
    };

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;

        if (name === "priority") {
            setPriority(value);
        }
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        const handleEmailChange = (e) => {
            const email = e.target.value;
            setState((prevState) => ({ ...prevState, raisedtouser: email }));
        
            // Trigger the email existence check
            checkEmailExists(email);
        };
        
        // Handle input change
        
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
  console.log(tags);
  const handleInviteConfirmation = async (confirm) => {
    if (confirm) {
        const invitePayload = {
            email: raisedtouser,
           
        };
        try {
            await axios.post(API.SEND_INVITE_EMAIL, invitePayload);
            toast.success('Invitation sent successfully');
        } catch (error) {
            toast.error("Failed to send invitation.");
        }
    } else {
        toast.error("User was not found and invitation was not sent.");
    }
    setShowConfirmInvite(false);  // Close the confirmation dialog
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

<div>
    <label htmlFor="raisedtouser">Raised to User</label>
    <input
        type="text"
        id="raisedtouser"
        name="raisedtouser"
        value={raisedtouser || ""}
        placeholder="Enter User Email"
        onChange={handleInputChange}
    />
    {!emailValidation.exists && <div style={{ color: 'red' }}>{emailValidation.message}</div>}
</div>
<div>
      <p>Select or add tags below:</p>
      <div className="tag-input-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag.name}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="tag-remove-button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Add new tag"
          className="tag-input"
        />
      </div>
      <p><b>Tag Names:</b></p>
      <pre><code>{JSON.stringify(tagNames, null, 2)}</code></pre>
</div>             
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

                    <label htmlFor="priority">Priority</label>
<div onChange={handleInputChange} style={{ margin: '10px 0' }}>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff0000' }}>
        <input
            type="radio"
            name="priority"
            value="critical"
            checked={priority === "critical"}
            style={{ marginRight: '8px' }}
        />
        Critical  
    </label> 
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff4500' }}>
        <input
            type="radio"
            name="priority"
            value="veryhigh"
            checked={priority === "veryhigh"}
            style={{ marginRight: '8px' }}
        />
        Very High
    </label>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff8c00' }}>
        <input
            type="radio"
            name="priority"
            value="high"
            checked={priority === "high"}
            style={{ marginRight: '8px' }}
        />
        High
    </label>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ffd700' }}>
        <input
            type="radio"
            name="priority"
            value="medium"
            checked={priority === "medium"}
            style={{ marginRight: '8px' }}
        />
        Medium
    </label>
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#32cd32' }}>
        <input
            type="radio"
            name="priority"
            value="low"
            checked={priority === "low"}
            style={{ marginRight: '8px' }}
        />
        Low
    </label>
</div>



                    <input type="submit" value={editItem.incidentid ? "Update" : "Save"} />
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Email sent successfully!</div>}
                </form>
                <button onClick={handleGoBack}>Go Back</button>
                
            </div>
            {showConfirmInvite && (
            <div className="confirmation-dialog">
                <p>The email address is not registered. Do you want to send an invitation?</p>
                <button onClick={() => handleInviteConfirmation(true)}>Yes</button>
                <button onClick={() => handleInviteConfirmation(false)}>No</button>
            </div>
        )}
        </div>
    );
};

export default FAddEdit;
