import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './BotAnalysis/Chatbot';
import Signup from './Signup-Login/Signup';
import Login from './Signup-Login/Login';
import ForgetPassword from './Signup-Login/ForgetPassword';
import ResetPassword from './Signup-Login/ResetPassword';
import Admin from './Incident/Admin'
import AdminMain from './BotAnalysis/AdminMain';
import Home from './Home';

import Example from './components/Example';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists in localStorage

  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="api/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Admin" element={<Admin/>} />
          <Route path="/Adminmain" element={<AdminMain/>} />

          <Route path="/test" element={<Example/>} />


          {/* Additional Routes */}
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
