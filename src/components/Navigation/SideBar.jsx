import React from 'react';
import './SideBar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Users list and channels</h3>
      <div className="channels">
        <p>#channel1</p>
        <p>#channel2</p>
      </div>

      <div className="profile">
        <div className="avatar"></div>
        <div className="status-bar"></div>
        <div className="avatar"></div>
        <div className="status-bar"></div>
      </div>
    </div>
  );
}

export default Sidebar;
