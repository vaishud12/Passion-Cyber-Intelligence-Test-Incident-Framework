import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
// import BotAinput from './BotAnalysis/BotAinput'; // Assuming this is your component for the root route
// import BotAoutput from './BotAnalysis/BotAoutput'; // Assuming this is your output page component
import Chatbot from './BotAnalysis/Chatbot';
import Signup from './Signup-Login/Signup';
import Login from './Signup-Login/Login';
import UserIncidents from './Incident/UserIncidents'; // Assuming this is your UserIncidents component



const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists in localStorage
  return (
   
    <div>
    <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

{/* <Router></Router> */}

                    {/* Additional Routes */}
                    <Route path="/chatbot" element={<Chatbot />} />
                </Routes>
            </Router>
            
         </div>
  );
};

export default App;



