// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // This is already wrapped
import Signup from './Signup-Login/Signup'; // This is already wrapped
import Login from './Signup-Login/Login'; // Wrap this similarly
import ForgetPassword from './Signup-Login/ForgetPassword'; // Wrap this similarly
import ResetPassword from './Signup-Login/ResetPassword'; // Wrap this similarly
import AdminMain from './BotAnalysis/AdminMain'; // Wrap this similarly
import Chatbot from './BotAnalysis/Chatbot'; // Wrap this similarly
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Adminmain" element={<AdminMain />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
