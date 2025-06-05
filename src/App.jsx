import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <>
      <Router>
        <DataProvider>
          <AuthProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
            />
          </AuthProvider>
        </DataProvider>
      </Router>
    </>
  );
}

export default App;
