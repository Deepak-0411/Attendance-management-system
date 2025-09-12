import AppRoutes from "./routes/AppRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { DataProvider } from "./context/DataContext";
import { FilterProvider } from "./context/FilterContext";
import { useEffect, useState } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

function App() {
  const isMobile = useIsMobile();
  return (
    <DataProvider>
      <FilterProvider>
        <AppRoutes />
        <ToastContainer
          position={isMobile ? "top-center" : "top-right"}
          autoClose={3000}
          theme="colored"
        />
      </FilterProvider>
    </DataProvider>
  );
}
export default App;
