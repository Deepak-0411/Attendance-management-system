import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();
    console.log(user);
    

    if (!user) {
        console.log("hello")
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
