import React ,{useState,useEffect}from 'react';
import {useParams,Link} from "react-router-dom";
import axios from 'axios';
import "./FView.css";


const FView = () => {
  const [user,setUser]= useState({});
  

  const {incidentid} = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/incident-api/incident/incidentget/${incidentid}`)
      .then((resp)=>setUser({...resp.data[0]}));

  },[incidentid])

  return (
    <div style={{marginTop:"150px"}}>
      <div className="card">
      <div className="card-header">
        <p>User  Type</p>
      </div>
        <div className="container">
          <strong>IncidentId:  </strong>
          <span>{incidentid}</span>
          <br/><br/>
          <strong>Incident category:  </strong>
          <span>{user.incidentcategory}</span>
          <br/><br/>
          <strong>Incident Name:  </strong>
          <span>{user.incidentname}</span>
          <br/><br/>
          <strong>Incident Owner:  </strong>
          <span>{user.incidentowner}</span>
          <br/><br/>
          
          <strong>Description:  </strong>
          <span>{user.incidentdescription}</span>
          <br/><br/>
          <strong>Date:  </strong>
          <span>{user.date}</span>
          <br/><br/>

          <strong>:Current Address  </strong>
          <span>{user.currentaddress}</span>
          <br/><br/>
          <strong>GPS:  </strong>
          <span>{user.gps}</span>
          <br/><br/>
          <strong>Raised touser:  </strong>
          <span>{user.raisedtouser}</span>
          <br/><br/>

          


          

          <Link to="/incident">
                <button className="btn btn-edit">Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default FView