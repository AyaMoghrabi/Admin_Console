import React, { useEffect, useState } from "react";
import "../App.css";

function Hierarchy() {
  const [hierarchy, setHierarchy] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hierarchy")
      .then((res) => res.json())
      .then((data) => setHierarchy(data));
  }, []);

  return (
    <div className="table-container">
      <h2>Hierarchy</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Level</th><th>Description</th></tr>
        </thead>
        <tbody>
          {hierarchy.map(item => (
            <tr key={item.id}><td>{item.id}</td><td>{item.level}</td><td>{item.description}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Hierarchy;
