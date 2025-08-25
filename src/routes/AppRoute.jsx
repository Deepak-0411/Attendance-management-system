import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import FacultyLayout from "../layout/FacultyLayout";
import PageNotFound from "../pages/PageNotFound";
import Devs from "../pages/Devs";

// Guard
import ProtectedRoute from "../routes/guard/ProtectedRoute";

// Auth Pages
import Login from "../auth/Login";
import AdminLogin from "../auth/AdminLogin";

// Admin Pages
import Home from "../pages/admin/Home";
import Attendance from "../pages/admin/Attendance";
import ExamDuty from "../pages/admin/ExamDuty";
import Rooms from "../pages/admin/Rooms";
import Faculty from "../pages/admin/Faculty";
import StudentDetails from "../pages/admin/StudentDetails";
import CourseDetails from "../pages/admin/CourseDetails";

// Faculty Pages
import DisplayDuty from "../pages/user/DisplayDuty";
import Students from "../pages/user/Students";
import MarkAttendence from "../pages/user/MarkAttendence";

import { setGlobalNavigate } from "../utility/navigation";


function AppRoute() {
  const initialRoot =
    window.innerWidth > 600 ? "/admin/home" : "/faculty/displayDuty";
  const [defaultRoot, setDefaultRoot] = useState(initialRoot);

  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, []);

  return (
    <Routes>
      <Route path="devTeam" element={<Devs />} />
      <Route path="/" element={<Navigate to={`${defaultRoot}`} />} />
      {/* Auth  */}
      <Route path="/faculty/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={<ProtectedRoute element={<FacultyLayout />} user="faculty" />}
      >
        <Route index element={<Navigate to="/faculty/displayDuty" />} />
        <Route path="displayDuty" element={<DisplayDuty />} />
        <Route path="students" element={<Students />} />
        <Route path="markAttendance" element={<MarkAttendence />} />
      </Route>

      {/* Admin Routes with Dashboard Layout */}
      <Route
        path="/admin"
        element={<ProtectedRoute element={<AdminLayout />} user="admin" />}
      >
        <Route index element={<Navigate to="/admin/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="examDuty" element={<ExamDuty />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="students" element={<StudentDetails />} />
        <Route path="course-details" element={<CourseDetails />} />
        {/* <Route path="search" element={<FallBack />} /> */}
      </Route>

      {/* Catch-all route */}
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoute;
