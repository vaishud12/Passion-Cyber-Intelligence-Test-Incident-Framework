// App.js
import React from 'react';
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // This is already wrapped
import Signup from './Signup-Login/Signup'; // This is already wrapped
import Login from './Signup-Login/Login'; // Wrap this similarly
import ForgetPassword from './Signup-Login/ForgetPassword'; // Wrap this similarly
import ResetPassword from './Signup-Login/ResetPassword'; // Wrap this similarly
import AdminMain from './BotAnalysis/AdminMain'; // Wrap this similarly

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<PrivateRoute><ResetPassword /></PrivateRoute>} />
        <Route path="/Adminmain" element={<PrivateRoute><AdminMain /></PrivateRoute>} />
        
      </Routes>
    </Router>
  );
};

export default App;
