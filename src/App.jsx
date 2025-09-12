import AppRoutes from "./routes/AppRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { DataProvider } from "./context/DataContext";
import { FilterProvider } from "./context/FilterContext";
import { useEffect, useState } from "react";
import { useOffline } from "./context/OfflineContext";
import { setOfflineHandler } from "./utility/offlineHandler";

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
  const offlineContext = useOffline();

  useEffect(() => {
    setOfflineHandler({
      retry: () => window.location.reload(), // optional retry
      trigger: () => offlineContext.setOffline(true), // sets offline = true
    });
  }, []);

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
