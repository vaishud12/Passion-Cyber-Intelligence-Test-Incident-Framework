import React, { useState } from 'react';
import { FaTags, FaCompass, FaUser, FaTable, FaChevronRight, FaChevronLeft } from 'react-icons/fa'; // Import additional icons
import './Sidebar.css';

const Sidebar = ({ onMenuItemClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (action) => {
    if (onMenuItemClick) onMenuItemClick(action);
  };

  return (
    <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
      <div
        className="toggle-button"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <FaChevronLeft /> : <FaChevronRight />}
      </div>
      <div className="menu-items">
      <div className="menu-item" onClick={() => handleClick('dashboard')}>
          <FaTable />
          {expanded && <span className="menu-text">Home</span>}
        </div>
        <div className="menu-item" onClick={() => handleClick('fTable')}>
        onClick={() => handleClick('incidentCategory')}
          {expanded && <span className="menu-text">Incident</span>}
        </div>
        <div className="menu-item" onClick={() => handleClick('rtable')}>
          <FaCompass />
          {expanded && <span className="menu-text">Resolution</span>}
        </div>
        <div className="menu-item" onClick={() => handleClick('userTable')}>
          <FaUser />
          {expanded && <span className="menu-text">Users</span>}
        </div>
        <div className="menu-item" onClick={() => handleClick('incidentCategory')}>
          <FaTags />
          {expanded && <span className="menu-text">Category</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
