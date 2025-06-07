import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import apiRequest from "../../utility/apiRequest";
import { toast } from "react-toastify";
import LogoSpinner from "../../components/Spinner/LogoSpinner";
import { useFilter } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";

const ProtectedRoute = ({ element, user }) => {
  const { token } = useAuth();
  const { loadFilterOptions, isFiltersEmpty } = useFilter();
  const { getFacultyInfo } = useData();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [defaultRoot, setDefaultRoot] = useState("/faculty/login");

  // Memoized token to prevent unnecessary re-renders
  const authToken = useMemo(() => token, [token]);

  useEffect(() => {
    if (window.innerWidth > 600) setDefaultRoot("/admin/login");
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await apiRequest({
        url: user === "faculty" ? "/user/dashboard" : "/admin/dash",
        method: "POST",
        token: authToken,
      });

      if (response.status === "success") {
        if (user === "faculty") {
          await getFacultyInfo(authToken);
        } else if (user === "admin" && isFiltersEmpty()) {
          await loadFilterOptions(authToken);
        }
        setIsAuthorized(true);
      } else {
        console.error("Authorization Error:", response.message);
        toast.error(`Authorization Failed`);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [authToken]);

  if (!authToken) {
    return <Navigate to={`${defaultRoot}`} />;
  }

  // Handle loading state
  if (isAuthorized === null) {
    return <LogoSpinner />;
  }

  // Redirect unauthorized users immediately
  return isAuthorized ? element : <Navigate to={`${defaultRoot}`} replace />;
};

export default ProtectedRoute;
