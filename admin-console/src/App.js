import "./App.css";
import Sidebar from "./Components/SideBar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Users from "./Pages/Users";
import Roles from "./Pages/Roles";
import Permissions from "./Pages/Permissions";
import Hierarchy from "./Pages/Hierarchy";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const hideSidebar = location.pathname === '/' || location.pathname === '/register';
  return (
    <div className="App" style={{ display: "flex" }}>
      {!hideSidebar && isAuth && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
        <Route path="/permissions" element={<PrivateRoute><Permissions /></PrivateRoute>} />
        <Route path="/hierarchy" element={<PrivateRoute><Hierarchy /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
