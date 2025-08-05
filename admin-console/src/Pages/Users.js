import React, { useEffect, useState } from "react";
import DataTable from "../Components/DataTable";
import "../App.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: "", email: "", password: "" });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addFormData),
      });
      
      if (response.ok) {
        setAddFormData({ name: "", email: "", password: "" });
        setShowAddForm(false);
        fetchUsers();
      } else {
        console.error('Error adding user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Users</h2>
        </div>
        <div className="no-data">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={users}
      columns={columns}
      title="Users"
      onDelete={handleDelete}
      showAddForm={showAddForm}
      addFormData={addFormData}
      onAddFormChange={handleAddFormChange}
      onAddFormSubmit={handleAddFormSubmit}
    />
  );
}

export default Users;
