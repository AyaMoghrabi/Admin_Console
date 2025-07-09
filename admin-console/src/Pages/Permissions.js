import React, { useEffect, useState } from "react";
import "../App.css";

function Permissions() {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/permissions", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((res) => res.json())
      .then((data) => setPermissions(data));
  }, []);

  return (
    <div className="table-container">
      <h2>Permissions</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Permission</th></tr>
        </thead>
        <tbody>
          {permissions.map(perm => (
            <tr key={perm.id}><td>{perm.id}</td><td>{perm.permission}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Permissions;
