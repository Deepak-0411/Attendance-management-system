import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../utility/apiRequest";
import LogoSpinner from "../../components/Spinner/LogoSpinner";
import { useFilter } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";

const ProtectedRoute = ({ element, user }) => {
  const { loadFilterOptions, isFiltersEmpty } = useFilter();
  const { getFacultyInfo } = useData();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [defaultRoot, setDefaultRoot] = useState("/faculty/login");

  useEffect(() => {
    if (window.innerWidth > 600) setDefaultRoot("/admin/login");
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await apiRequest({
        url: user === "faculty" ? "/api/soict/faculty-auth" : "/api/soict/admin-auth",
        method: "GET",
      });

      if (response.status === "success") {
        if (user === "faculty") {
          await getFacultyInfo();
        } else if (user === "admin" && isFiltersEmpty()) {
          await loadFilterOptions();
        }
        setIsAuthorized(true);
      } else {
        console.error("Authorization Error:", response.message);
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  // Handle loading state
  if (isAuthorized === null) {
    return <LogoSpinner />;
  }

  // Redirect unauthorized users immediately
  return isAuthorized ? element : <Navigate to={`${defaultRoot}`} replace />;
};

export default ProtectedRoute;
