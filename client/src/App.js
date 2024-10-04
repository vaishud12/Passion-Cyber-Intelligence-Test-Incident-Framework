import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './BotAnalysis/Chatbot';
import Signup from './Signup-Login/Signup';
import Login from './Signup-Login/Login';
import ForgetPassword from './Signup-Login/ForgetPassword';
import ResetPassword from './Signup-Login/ResetPassword';
import AdminMain from './BotAnalysis/AdminMain';
import Home from './Home';
import './App.css';
import LanguageSwitcher from './components/LanguageSwitcher';

const App = () => {
  return (
    <div>
      <div className="LanguageSwitcher">
        {/* <LanguageSwitcher /> */}
      </div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Adminmain" element={<AdminMain />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
