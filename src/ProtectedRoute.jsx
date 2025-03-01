import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState, useMemo } from "react";
import styles from "./ProtectedRoute.module.css";

const ProtectedRoute = ({ element }) => {
  const { token, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [defaultRoot,setDefaultRoot]=useState("/login");

  // Memoized token to prevent unnecessary re-renders
  const authToken = useMemo(() => token, [token]);

  useEffect(() => {
    if (window.innerWidth > 600) 
      setDefaultRoot("/admin/login");
    
  }, []);
  
  if (!authToken) {
    return <Navigate to={`${defaultRoot}`} />;
  }
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(authToken);
        const response = await fetch(
          "https://gbu-server.vercel.app/api/user/dash",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        console.log("Auth Response:", data);

        setIsAuthorized(response.ok);
      } catch (error) {
        console.error("Authorization Error:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [authToken]);

  // Handle loading state
  if (isAuthorized === null) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Checking Authorization...</p>
      </div>
    );
  }

  // Redirect unauthorized users immediately
  return isAuthorized ? element : <Navigate to={`${defaultRoot}`} replace />;
};

export default ProtectedRoute;
