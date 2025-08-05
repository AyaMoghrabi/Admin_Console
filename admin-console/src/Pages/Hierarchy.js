import React, { useEffect, useState } from "react";
import DataTable from "../Components/DataTable";
import "../App.css";

function Hierarchy() {
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ level: "", description: "" });

  const columns = [
    { key: "id", label: "ID" },
    { key: "level", label: "Level" },
    { key: "description", label: "Description" }
  ];

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/hierarchy", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          setError('Authentication failed. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Hierarchy data:', data);
      setHierarchy(data);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      setError('Failed to fetch hierarchy: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleAddFormSubmit = async (e) => {
    if (e.type === 'toggle') {
      setShowAddForm(!showAddForm);
      return;
    }
    
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/hierarchy", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(addFormData),
      });
      
      if (response.ok) {
        setAddFormData({ level: "", description: "" });
        setShowAddForm(false);
        fetchHierarchy();
      } else {
        console.error('Error adding hierarchy entry');
      }
    } catch (error) {
      console.error('Error adding hierarchy entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Hierarchy</h2>
        </div>
        <div className="no-data">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Hierarchy</h2>
        </div>
        <div className="no-data" style={{ color: '#ff6b6b' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={hierarchy}
      columns={columns}
      title="Hierarchy"
      showAddForm={showAddForm}
      addFormData={addFormData}
      onAddFormChange={handleAddFormChange}
      onAddFormSubmit={handleAddFormSubmit}
    />
  );
}

export default Hierarchy;
