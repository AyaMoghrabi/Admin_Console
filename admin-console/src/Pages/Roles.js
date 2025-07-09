import React, { useEffect, useState } from "react";
import "../App.css";

function Roles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/roles", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  return (
    <div className="table-container">
      <h2>Roles</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Role</th></tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}><td>{role.id}</td><td>{role.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roles;
