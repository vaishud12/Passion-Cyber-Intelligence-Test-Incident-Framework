const BASE_URL = "http://localhost:5014/incident-api/";
//const BASE_URL = "https://audit1.passionit.com/startup-api/startup-api/";

export const LOGIN = `${BASE_URL}login`;
export const SIGNUP = `${BASE_URL}signup`;

/****************INCIDENTCATEGORY******************* */
export const GET_INCIDENT_CATEGORY = 
  `${BASE_URL}agroincidentcategoryget`;

export const GET_TAGS = 
  `${BASE_URL}tags`;

export const DELETE_INCIDENT_CATEGORY = (incidentcategoryid) =>
  `${BASE_URL}incidentcategorydelete/${incidentcategoryid}`;

export const POST_INCIDENT_CATEGORY = `${BASE_URL}incidentcategorypost`;

export const GET_SPECIFIC_INCIDENT_CATEGORY = (incidentcategoryid) =>
  `${BASE_URL}incidentcategoryget/${incidentcategoryid}`;

export const UPDATE_SPECIFIC_INCIDENT_CATEGORY = (incidentcategoryid) =>
  `${BASE_URL}incidentcategoryupdate/${incidentcategoryid}`;
/********************INCIDENT************************** */
export const POST_INCIDENT = `${BASE_URL}incidentpost`;

export const GET_INCIDENT = `${BASE_URL}incidentget`;

export const SET_PRIORITY_TIMES = 
  `${BASE_URL}set-priority-times`;

export const CHECK_EMAIL = (email) =>
  `${BASE_URL}check-email/${email}`;

export const GET_SPECIFIC_INCIDENT = (incidentid) =>
  `${BASE_URL}incidentget/${incidentid}`;

export const GET_DISTINCT_INCIDENT_CATEGORY = 
  `${BASE_URL}agroincidentcategorygets`;

export const GET_INCIDENT_NAME_BASEDON_INCIDENTCATEGORY = 
  `${BASE_URL}agroincidentnamegets`;

  export const GET_INCIDENT_DESCRIPTION_BASEDON_INCIDENTNAME = 
  `${BASE_URL}agroincidentdescriptiongets`;

  export const GET_PRIORITY_TIME = 
  `${BASE_URL}get-priority-times`;

  export const UPDATE_SPECIFIC_INCIDENT = (incidentid) =>
    `${BASE_URL}incidentupdate/${incidentid}`;

  export const SEND_INCIDENT_EMAIL = 
  `${BASE_URL}send-incident-email`;

  export const SEND_INVITE_EMAIL = 
  `${BASE_URL}send-invite`;
 
  export const GET_USER_INCIDENTS = (userId) =>
    `${BASE_URL}user-incidents/${userId}`;

  export const DELETE_INCIDENT = (incidentid) =>
    `${BASE_URL}incidentdelete/${incidentid}`;

/******************RESOLUTION*************************************** */
export const POST_RESOLUTION = `${BASE_URL}resolutionpost`;

export const POST_SEND_RESOLVED_EMAIL = `${BASE_URL}send-emailforresolved`;

export const DELETE_RESOLUTION = (resolutionid) =>
  `${BASE_URL}resolutiondelete/${resolutionid}`;

export const GET_ADMIN_RESOLUTION =
  `${BASE_URL}adminresolutionget`;

export const UPDATE_SPECIFIC_RESOLUTION = (resolutionid) =>
  `${BASE_URL}resolutionupdate/${resolutionid}`;

export const GET_USER_RESOLUTION = (userId) =>
  `${BASE_URL}user-resolutions/${userId}`;
