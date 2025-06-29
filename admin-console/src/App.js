import "./App.css";
import Sidebar from "./Components/SideBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Users from "./Pages/Users";
import Roles from "./Pages/Roles";
import Permissions from "./Pages/Permissions";
import Hierarchy from "./Pages/Hierarchy";

function App() {
  return (
    <Router>
      <div className="App" style={{ display: "flex" }}>
        <Sidebar />
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/hierarchy" element={<Hierarchy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
