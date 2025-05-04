import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./service/admin/admin";
import StudentService from "./service/student/StudentService";
import LoginSignup from "./Pages/LoginSignup/LoginSignup";
import FacultyService from "./service/faculty/FacultyService";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginSignup />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Student Routes */}
          <Route element={<PrivateRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentService />} />
          </Route>

          {/* Faculty Routes */}
          <Route element={<PrivateRoute allowedRoles={["faculty"]} />}>
            <Route path="/faculty" element={<FacultyService />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
