import AppRoutes from "./routes/AppRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { FilterProvider } from "./context/FilterContext";

function App() {
  return (
    <>
      <DataProvider>
        <FilterProvider>
          <AuthProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
            />
          </AuthProvider>
        </FilterProvider>
      </DataProvider>
    </>
  );
}
export default App;
