// import React, { useEffect, useState } from "react";
// import "../App.css";

// function Users() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/users')
//       .then(res => res.json())
//       .then(data => setUsers(data));
//   }, []);

//   return (
//     <div className="table-container">
//       <h2>Users</h2>
//       <table>
//         <thead>
//           <tr><th>ID</th><th>Name</th><th>Email</th></tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td></tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Users;


import React, { useEffect, useState } from "react";
import "../App.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ name: "", email: "" });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  return (
    <div className="table-container">
      <h2>Users</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" className="button">Add User</button>
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td><td>{user.name}</td><td>{user.email}</td>
              <td>
                <button
                  className="button"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
