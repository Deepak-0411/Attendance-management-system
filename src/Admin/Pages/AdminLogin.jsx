import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./CSS/AdminLogin.module.css";
import loginsvg from "../../assets/login illustration.svg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginerror, setloginError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setloginError("");

    try {
      const response = await fetch(
        " https://gbu-server.vercel.app/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

          },
          body: JSON.stringify({ username : email, password : password }),
        }
      );
      
      const data = await response.json();
      
      if (data.message === "ok") {
        login(data.token);
        navigate("/admin/dashboard");
      } else if(data.message==="Incorrect credentials") {
        setloginError("Invalid username or password");
      }
    } catch (error) {
      setloginError("Server error, please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.errorBox} ${showError ? styles.errorBoxShow : ""}`}
      >
        <p>Error: Cannot change!!</p>
      </div>
      <div className={styles.loginBox}>
        <div className={styles.illustration}>
          <img src={loginsvg} alt="Admin Login" />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login as Admin</h1>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              className={styles.loginInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.passwordToggle}
                style={{ opacity: password.length ? 1 : 0 }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="black"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="black"
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                )}
              </span>
            </div>

            <div className={styles.loginOptions}>
              <span className={styles.loginOptionsSpan}>
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
              </span>
              <label>
                <input
                  type="checkbox"
                  className={styles.checkBox}
                  defaultChecked={true}
                  onClick={() => setShowError(true)}
                />
                remember me
              </label>
            </div>
            {loginerror && <p className={styles.error}>{loginerror}</p>}
            <button
              id="btn"
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
