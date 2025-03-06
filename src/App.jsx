import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Error404 from "./Auth/Error404";
import Login from "./Faculty/Login";
import DisplayDuty from "./Faculty/DisplayDuty";
import Students from "./Faculty/Students";
import MarkAttendence from "./Faculty/MarkAttendence";
import ScanSheet from "./Faculty/ScanSheet";
import AdminLogin from "./Admin/Pages/AdminLogin";
import Dashboard from "./Admin/Dashboard";
import Content from "./Admin/Content";
import { AuthProvider } from "./Auth/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";
import React from "react";
import Faculty from "./Admin/Pages/Faculty";
import CourseDetails from "./Admin/Pages/CourseDetails";
import StudentDetails from "./Admin/Pages/StudentDetails";

function App() {
  const [defaultRoot, setDefaultRoot] = useState("/displayDuty");

  useEffect(() => {
    if (window.innerWidth > 600) setDefaultRoot("/admin/dashboard");
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`${defaultRoot}`} />} />
          <Route path="/login" element={<Login />} />

          {/* Faculty Routes */}
          <Route path="/displayDuty" element={<ProtectedRoute element={<DisplayDuty />} user="faculty" />} />
          <Route path="/students" element={<ProtectedRoute element={<Students />} user="faculty" />} />
          <Route path="/markAttendance" element={<ProtectedRoute element={<MarkAttendence />} user="faculty" />} />

          {/* Admin Routes with Dashboard Layout */}
          <Route path="/admin" element={<ProtectedRoute element={<Dashboard />} user="admin"/>}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Content />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="students" element={<StudentDetails/>} />
            <Route path="course-details" element={<CourseDetails />} />
            <Route path="search" element={<Content />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Unauthorized Page */}
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
