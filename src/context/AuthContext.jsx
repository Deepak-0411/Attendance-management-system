import { createContext, useContext, useState } from "react";
import { useData } from "./DataContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { dataReset } = useData();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (userData) => {
    localStorage.setItem("token", userData);
    setToken(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    dataReset("all");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
