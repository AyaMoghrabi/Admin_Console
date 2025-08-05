import React, { useState, useEffect } from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { useLocation, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="Sidebar">
      {/* Profile Section */}
      {user && (
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪
          </button>
        </div>
      )}

      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li
            className="row"
            id={location.pathname === val.link ? "active" : ""}
            key={key}
            onClick={() => navigate(val.link)}
          >
            <div className="sidebar-item">
              <span className="sidebar-icon">{val.icon}</span>
              <span className="sidebar-title">{val.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
