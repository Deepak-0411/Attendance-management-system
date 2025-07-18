import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/modules/auth/Login.module.css";
import Input from "../components/Input/Input";
import { toast } from "react-toastify";
import apiRequest from "../utility/apiRequest";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!(userId && password)) return;

    const response = await apiRequest({
      url: "/faculty/login",
      method: "POST",
      body: { username: userId.trim(), password: password.trim() },
      token: false,
      setLoading,
    });

    if (response.status === "success" && response.data.message === "ok") {
      toast.success("LoggedIn Sucessfully!!! ");
      login(response.data.token);
      navigate("/faculty/displayDuty");
    } else if (response.message === "Incorrect credentials") {
      toast.error("Invalid username or password");
    } else {
      console.error("Error:", response.message);
      toast.error(`Error: ${response.message}`);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div>
          <span>{profileSVG}</span>
        </div>
        <h1 className={styles.title}>LOGIN</h1>
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
                id="12121"
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
  );
};

export default Login;

  const profileSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="90"
      viewBox="0 0 68 68"
      fill="none"
    >
      <path
        d="M46.75 29.75C46.75 36.805 41.055 42.5 34 42.5C26.945 42.5 21.25 36.805 21.25 29.75C21.25 22.695 26.945 17 34 17C41.055 17 46.75 22.695 46.75 29.75Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M68 34C68 52.785 52.785 68 34 68C15.215 68 0 52.785 0 34C0 15.215 15.215 0 34 0C52.785 0 68 15.215 68 34ZM17 58.4375C17.68 57.307 24.2675 46.75 33.9575 46.75C43.605 46.75 50.235 57.3325 50.915 58.4375C54.8669 55.7047 58.0959 52.0528 60.3243 47.796C62.5527 43.5392 63.7137 38.8048 63.7075 34C63.7075 17.5525 50.405 4.25 33.9575 4.25C17.51 4.25 4.2075 17.5525 4.2075 34C4.2075 44.115 9.265 53.0825 17 58.4375Z"
        fill="black"
      />
    </svg>
  );
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

