import AppRoutes from "./routes/AppRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { DataProvider } from "./context/DataContext";
import { FilterProvider } from "./context/FilterContext";

function App() {
  return (
    <>
      <DataProvider>
        <FilterProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
            />
        </FilterProvider>
      </DataProvider>
    </>
  );
}
export default App;
