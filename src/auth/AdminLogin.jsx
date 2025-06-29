import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/modules/auth/AdminLogin.module.css";
import loginsvg from "../assets/login illustration.svg";
import apiRequest from "../utility/apiRequest";
import { toast } from "react-toastify";
import Input from "../components/Input/Input";

const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

 

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!(userId && password)) return;

    const response = await apiRequest({
      url: "/admin/login",
      method: "POST",
      body: { username: userId.trim(), password: password.trim() },
      token: false,
      setLoading,
    });
    

    if (response.status === "success" && response.data.message === "ok") {
      toast.success("LoggedIn Sucessfully!!! ");
      login(response.data.token);
      navigate("/admin/home");
    }  else {
      console.error("Error:", response.message);
      toast.error(`Error: ${response.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.illustration}>
          <img src={loginsvg} alt="Admin Login" />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login as Admin</h1>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <Input
              type={2}
              role={"text"}
              placeholder={"userId"}
              value={userId}
              setValue={(value) => setUserId(value)}
            />
            <Input
              type={2}
              role={"password"}
              placeholder={"password"}
              value={password}
              setValue={(value) => setPassword(value)}
            />
            <div className={styles.loginOptions}>
              <span className={styles.loginOptionsSpan}>{checkboxSVG}</span>
              <label>
                <input
                  type="checkbox"
                  className={styles.checkBox}
                  defaultChecked={true}
                  onClick={()=>toast.info("Cannot Change!!")}
                />
                remember me
              </label>
            </div>
            <button
              className={styles.loginButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


 const checkboxSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M14 2C11.8783 2 9.84344 2.84285 8.34315 4.34315C6.84285 5.84344 6 7.87827 6 10C6 12.1217 6.84285 14.1566 8.34315 15.6569C9.84344 17.1571 11.8783 18 14 18C16.1217 18 18.1566 17.1571 19.6569 15.6569C21.1571 14.1566 22 12.1217 22 10C22 7.87827 21.1571 5.84344 19.6569 4.34315C18.1566 2.84285 16.1217 2 14 2ZM4.93 5.82C4.01572 6.56996 3.27883 7.51305 2.77224 8.58156C2.26565 9.65006 2.00193 10.8175 2 12C2 14.1217 2.84285 16.1566 4.34315 17.6569C5.84344 19.1571 7.87827 20 10 20C10.64 20 11.27 19.92 11.88 19.77C10.12 19.38 8.5 18.5 7.17 17.29C6.2123 16.7777 5.41161 16.0151 4.85333 15.0835C4.29505 14.1518 4.00012 13.0861 4 12C4 11.7 4.03 11.41 4.07 11.11C4.03 10.74 4 10.37 4 10C4 8.56 4.32 7.13 4.93 5.82ZM18.09 6.08L19.5 7.5L13 14L9.21 10.21L10.63 8.79L13 11.17"
        fill="black"
      />
    </svg>
  );
