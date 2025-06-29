import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { useLocation, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li
            className="row"
            id={location.pathname === val.link ? "active" : ""}
            key={key}
            onClick={() => navigate(val.link)}
          >
            <div>{val.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
