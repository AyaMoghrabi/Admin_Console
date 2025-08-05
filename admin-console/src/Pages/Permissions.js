import React, { useEffect, useState } from "react";
import DataTable from "../Components/DataTable";
import "../App.css";

function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ permission: "" });

  const columns = [
    { key: "id", label: "ID" },
    { key: "permission", label: "Permission Name" }
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/permissions", {
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
      console.log('Permissions data:', data);
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Failed to fetch permissions: ' + error.message);
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
      const response = await fetch("http://localhost:5000/api/permissions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(addFormData),
      });
      
      if (response.ok) {
        setAddFormData({ permission: "" });
        setShowAddForm(false);
        fetchPermissions();
      } else {
        console.error('Error adding permission');
      }
    } catch (error) {
      console.error('Error adding permission:', error);
    }
  };

  const handleDeletePermission = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/permissions/${id}`, {
        method: "DELETE",
        headers: { 
          'Authorization': 'Bearer ' + token
        },
      });
      
      if (response.ok) {
        fetchPermissions(); // Refresh the list
      } else {
        console.error('Error deleting permission');
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Permissions</h2>
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
          <h2>Permissions</h2>
        </div>
        <div className="no-data" style={{ color: '#ff6b6b' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={permissions}
      columns={columns}
      title="Permissions"
      showAddForm={showAddForm}
      addFormData={addFormData}
      onAddFormChange={handleAddFormChange}
      onAddFormSubmit={handleAddFormSubmit}
      onDelete={handleDeletePermission}
    />
  );
}

export default Permissions;
