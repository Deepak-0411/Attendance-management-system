import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Faculty/Login";
import DisplayDuty from "./Faculty/DisplayDuty";
import Students from "./Faculty/Students";
import MarkAttendence from "./Faculty/MarkAttendence";
import ScanSheet from "./Faculty/ScanSheet";
import AdminLogin from "./Admin/AdminLogin";
import Dashboard from "./Admin/Dashboard";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<DisplayDuty />} />} />
          <Route path="/login" element={<Login />} />

          {/* Faculty Routes */}
          <Route
            path="/display-duty"
            element={<ProtectedRoute element={<DisplayDuty />} />}
          />
          <Route
            path="/students"
            element={<ProtectedRoute element={<Students />} />}
          />
          <Route
            path="/mark-attendance"
            element={<ProtectedRoute element={<MarkAttendence />} />}
          />
          <Route
            path="/scan-sheet"
            element={<ProtectedRoute element={<ScanSheet />} />}
          />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
