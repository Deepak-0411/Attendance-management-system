import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import apiRequest from "../../utility/apiRequest";
import Logo from "../../assets/FAVICON.png";
import styles from "./ProtectedRoute.module.css";
import { toast } from "react-toastify";

const ProtectedRoute = ({ element, user }) => {
  const { token, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [defaultRoot, setDefaultRoot] = useState("/login");

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
        setLoading,
      });

      if (response.status === "success") {
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
    return (
      <div className={styles.loaderContainer}>
        <img className={styles.logo} src={Logo} alt="logo" />
      </div>
    );
  }

  // Redirect unauthorized users immediately
  return isAuthorized ? element : <Navigate to={`${defaultRoot}`} replace />;
};

export default ProtectedRoute;
